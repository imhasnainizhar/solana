import type { Payload, PayloadRequest } from 'payload'

import type { PostgresAdapter } from '@payloadcms/db-postgres'

import { sql } from '@payloadcms/db-postgres'
import { createHash, randomBytes } from 'crypto'

import { brand } from '@/lib/brand'

import {
  LOGIN_TOKENS_SLUG,
  MAGIC_LINK_TTL_MS,
  RATE_LIMIT_PER_EMAIL,
  RATE_LIMIT_PER_IP,
  RATE_LIMIT_WINDOW_MS,
  serverURL,
} from './config'

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')

/** Hash IPs (with the app secret) so raw addresses are never stored. */
export const hashIP = (ip: string, secret: string) => sha256(`${secret}:${ip}`)

export function clientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

/** True if the email or the IP has requested too many links in the window (DB-backed, works on serverless). */
export async function isRateLimited({
  email,
  ipHash,
  payload,
  req,
}: {
  email: string
  ipHash: string
  payload: Payload
  req: PayloadRequest
}): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const [byEmail, byIP] = await Promise.all([
    payload.count({
      collection: LOGIN_TOKENS_SLUG,
      overrideAccess: true,
      req,
      where: { and: [{ email: { equals: email } }, { createdAt: { greater_than: since } }] },
    }),
    payload.count({
      collection: LOGIN_TOKENS_SLUG,
      overrideAccess: true,
      req,
      where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than: since } }] },
    }),
  ])
  return byEmail.totalDocs >= RATE_LIMIT_PER_EMAIL || byIP.totalDocs >= RATE_LIMIT_PER_IP
}

/**
 * Creates a single-use token (only its SHA-256 hash is stored) and returns the
 * plaintext sign-in URL.
 */
export async function createMagicLink({
  email,
  ipHash,
  payload,
  redirect,
  req,
  userAgent,
}: {
  email: string
  ipHash: string
  payload: Payload
  redirect: null | string
  req: PayloadRequest
  userAgent: null | string
}): Promise<string> {
  // Opportunistic cleanup of tokens that expired more than a day ago.
  await payload.delete({
    collection: LOGIN_TOKENS_SLUG,
    overrideAccess: true,
    req,
    where: { expiresAt: { less_than: new Date(Date.now() - 86_400_000).toISOString() } },
  })

  const token = randomBytes(32).toString('base64url')
  await payload.create({
    collection: LOGIN_TOKENS_SLUG,
    data: {
      email,
      expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS).toISOString(),
      ipHash,
      redirect: redirect ?? undefined,
      tokenHash: sha256(token),
      userAgent: userAgent?.slice(0, 256) ?? undefined,
    },
    overrideAccess: true,
    req,
  })
  return `${serverURL()}/auth/verify?token=${token}`
}

/**
 * Atomically consumes a token with a single conditional
 * `UPDATE … WHERE used_at IS NULL AND expires_at > now() RETURNING …`, which
 * guarantees single use even under concurrent requests (Payload's bulk update
 * is find-then-update, so it can't give that guarantee).
 * Returns the email + redirect on success, or null.
 */
export async function consumeMagicLink({
  payload,
  token,
}: {
  payload: Payload
  token: string
}): Promise<null | { email: string; redirect: null | string }> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null
  const tokenHash = sha256(token)

  const db = (payload.db as unknown as PostgresAdapter).drizzle
  const result = await db.execute<{ email: string; redirect: null | string }>(sql`
    UPDATE "login_tokens"
       SET "used_at" = now(), "updated_at" = now()
     WHERE "token_hash" = ${tokenHash}
       AND "used_at" IS NULL
       AND "expires_at" > now()
 RETURNING "email", "redirect"`)
  const row = result.rows[0]
  return row ? { email: row.email, redirect: row.redirect ?? null } : null
}

const escapeHTML = (v: string) =>
  v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

const hasEmailTransport = () => Boolean(process.env.SMTP_HOST)

/** In dev (or with AUTH_LOG_MAGIC_LINKS=true) links are logged when no SMTP transport is configured. */
const mayLogLinks = () =>
  process.env.NODE_ENV !== 'production' || process.env.AUTH_LOG_MAGIC_LINKS === 'true'

export async function sendMagicLinkEmail({
  email,
  payload,
  url,
}: {
  email: string
  payload: Payload
  url: string
}): Promise<void> {
  if (!hasEmailTransport()) {
    if (mayLogLinks()) {
      payload.logger.info(`[auth] Magic link for ${email} (no SMTP configured): ${url}`)
    } else {
      payload.logger.error(
        '[auth] Magic link requested but no email transport is configured (set SMTP_HOST…).',
      )
    }
    return
  }

  const minutes = Math.round(MAGIC_LINK_TTL_MS / 60_000)
  const name = escapeHTML(brand.name)
  const href = escapeHTML(url)
  await payload.sendEmail({
    to: email,
    subject: `Your sign-in link for ${brand.name}`,
    text: `Sign in to ${brand.name}:\n\n${url}\n\nThis link expires in ${minutes} minutes and can be used once. If you didn't request it, you can ignore this email.`,
    html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1d1b18">
  <p style="font-size:13px;letter-spacing:.02em;text-transform:lowercase;margin:0 0 28px">${name}</p>
  <h1 style="font-size:22px;font-weight:500;margin:0 0 12px">Sign in</h1>
  <p style="font-size:15px;line-height:1.5;margin:0 0 24px">Click the button below to sign in. This link expires in ${minutes} minutes and can only be used once.</p>
  <p style="margin:0 0 28px"><a href="${href}" style="display:inline-block;background:#1d1b18;color:#faf7f1;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:15px">Sign in to ${name}</a></p>
  <p style="font-size:13px;color:#6b665e;line-height:1.5;margin:0">If you didn't request this, you can safely ignore this email.</p>
</div>`,
  })
}

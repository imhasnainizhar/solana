/**
 * Passwordless auth — shared configuration.
 *
 * WHY A CUSTOM STRATEGY (and not a plugin / next-auth):
 * Payload 3 has no built-in OAuth or magic-link login. Its supported extension
 * point is `auth.strategies` + `auth.disableLocalStrategy`
 * (https://payloadcms.com/docs/authentication/custom-strategies). The community
 * plugins either cover only OAuth (payload-oauth2), don't do magic links
 * (payload-auth-plugin) or bridge to Auth.js, whose v5 future is uncertain
 * (payload-authjs). So the `users` collection disables the local (password)
 * strategy entirely and registers our own `passwordless` strategy:
 *
 *  - Sessions are *Payload-format* JWTs, signed with Payload's exported `jwtSign`
 *    + `getFieldsToSign`, tracked in Payload's own `sessions` array via
 *    `addSessionToUser`, and set in Payload's standard `<cookiePrefix>-token`
 *    cookie via `generatePayloadCookie`. Payload's built-in `/api/users/me`,
 *    `/api/users/refresh-token` and `/api/users/logout` keep working, and the
 *    admin panel needs no patching.
 *  - Every Payload internal we rely on is isolated in `session.ts` /
 *    `strategy.ts`, so auth changes in Payload v4 touch two small files.
 *  - Google uses Arctic (tiny, maintained OAuth client) for Authorization Code +
 *    PKCE, and `jose` to verify the ID token against Google's JWKS.
 *
 * With no local strategy there is no password field, hash, salt, login,
 * forgot-password or reset-password endpoint — nothing password-shaped exists.
 */
import { getServerSideURL } from '@/utilities/getURL'

export const USERS_SLUG = 'users'
export const LOGIN_TOKENS_SLUG = 'login-tokens'

/** Magic links expire after 15 minutes. */
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000

/** Rate limits for POST /api/auth/magic-link (per rolling window). */
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
export const RATE_LIMIT_PER_EMAIL = 3
export const RATE_LIMIT_PER_IP = 10

/** Short-lived cookies holding the Google OAuth state / PKCE verifier. */
export const OAUTH_COOKIE = 'sol-oauth'
export const OAUTH_COOKIE_TTL_S = 10 * 60

export const serverURL = (): string => getServerSideURL().replace(/\/$/, '')

export const isSecureOrigin = (): boolean => serverURL().startsWith('https://')

/** Lower-cased, trimmed list from ADMIN_EMAILS (comma-separated). */
export const adminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

export const isAdminEmail = (email: string): boolean => adminEmails().includes(email.toLowerCase())

export const googleEnabled = (): boolean =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

export const googleRedirectURI = (): string => `${serverURL()}/api/auth/google/callback`

export const normaliseEmail = (value: unknown): null | string => {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  // Deliberately simple: one @, something on each side, a dot in the domain, no spaces.
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

/**
 * Only same-site relative paths are allowed as post-login redirects
 * (prevents open redirects like `//evil.com` or `https://evil.com`).
 */
export const safeRedirect = (value: unknown): null | string => {
  if (typeof value !== 'string') return null
  const v = value.trim()
  if (!v.startsWith('/') || v.startsWith('//') || v.startsWith('/\\') || v.length > 512) return null
  if (/[\r\n\t]/.test(v)) return null
  return v
}

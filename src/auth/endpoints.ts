import type { Endpoint, PayloadRequest } from 'payload'

import { generateCookie, parseCookies } from 'payload/shared'

import {
  googleEnabled,
  isSecureOrigin,
  normaliseEmail,
  OAUTH_COOKIE,
  OAUTH_COOKIE_TTL_S,
  safeRedirect,
  serverURL,
} from './config'
import { createGoogleAuthorization, verifyGoogleCallback } from './google'
import {
  clientIP,
  createMagicLink,
  hashIP,
  isRateLimited,
  sendMagicLinkEmail,
} from './magicLink'
import { issueSession } from './session'
import { isAdmin, upsertUser } from './users'

/** Where to land after sign-in: the requested path, else /admin for admins, else /account. */
export const landingPath = (user: { roles?: null | string[] }, redirect: null | string) =>
  redirect ?? (isAdmin(user as never) ? '/admin' : '/account')

/** Where to send sign-in errors: the admin login page for admin flows, else /login. */
export const errorURL = (redirect: null | string, message: string) => {
  const page = redirect?.startsWith('/admin') ? '/admin/login' : '/login'
  return `${serverURL()}${page}?error=${encodeURIComponent(message)}`
}

const redirectResponse = (location: string, cookies: string[] = []) => {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store' })
  for (const c of cookies) headers.append('Set-Cookie', c)
  return new Response(null, { headers, status: 302 })
}

const GENERIC_OK = {
  message: 'If that address can receive email, a sign-in link is on its way. It expires in 15 minutes.',
  ok: true,
}

/** POST /api/auth/magic-link { email, redirect? } */
const magicLinkEndpoint: Endpoint = {
  path: '/auth/magic-link',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const body = (await req.json?.().catch(() => null)) as null | Record<string, unknown>
    const email = normaliseEmail(body?.email)
    if (!email) {
      return Response.json({ message: 'Please enter a valid email address.', ok: false }, { status: 400 })
    }
    const redirect = safeRedirect(body?.redirect)
    const ipHash = hashIP(clientIP(req.headers), req.payload.secret)

    if (await isRateLimited({ email, ipHash, payload: req.payload, req })) {
      return Response.json(
        { message: 'Too many sign-in requests. Please wait a few minutes and try again.', ok: false },
        { status: 429 },
      )
    }

    try {
      const url = await createMagicLink({
        email,
        ipHash,
        payload: req.payload,
        redirect,
        req,
        userAgent: req.headers.get('user-agent'),
      })
      await sendMagicLinkEmail({ email, payload: req.payload, url })
    } catch (err) {
      // Never reveal delivery problems per address (no user enumeration).
      req.payload.logger.error({ err, msg: '[auth] Failed to create/send magic link' })
    }
    // Same response whether or not an account exists.
    return Response.json(GENERIC_OK)
  },
}

const oauthCookie = (value: string, maxAge: number) =>
  generateCookie<false>({
    name: OAUTH_COOKIE,
    httpOnly: true,
    maxAge,
    path: '/api/auth/google',
    returnCookieAsObject: false,
    sameSite: 'Lax',
    secure: isSecureOrigin(),
    value,
  })

/** GET /api/auth/google?redirect=/path → Google consent screen */
const googleStartEndpoint: Endpoint = {
  path: '/auth/google',
  method: 'get',
  handler: (req: PayloadRequest) => {
    const redirect = safeRedirect(req.searchParams.get('redirect'))
    if (!googleEnabled()) return redirectResponse(errorURL(redirect, 'Google sign-in is not configured.'))

    const { codeVerifier, nonce, state, url } = createGoogleAuthorization()
    // state, PKCE verifier, nonce and redirect live in one short-lived httpOnly cookie
    // scoped to /api/auth/google.
    const value = Buffer.from(JSON.stringify({ codeVerifier, nonce, redirect, state })).toString('base64url')
    return redirectResponse(url.toString(), [oauthCookie(value, OAUTH_COOKIE_TTL_S)])
  },
}

/** GET /api/auth/google/callback?code&state → session cookie → redirect */
const googleCallbackEndpoint: Endpoint = {
  path: '/auth/google/callback',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const clear = oauthCookie('', 0)
    let stored: { codeVerifier?: string; nonce?: string; redirect?: null | string; state?: string } = {}
    try {
      const raw = parseCookies(req.headers).get(OAUTH_COOKIE)
      if (raw) stored = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    } catch {
      stored = {}
    }
    const redirect = safeRedirect(stored.redirect)
    const fail = (message: string) => redirectResponse(errorURL(redirect, message), [clear])

    const code = req.searchParams.get('code')
    const state = req.searchParams.get('state')
    if (req.searchParams.get('error')) return fail('Google sign-in was cancelled.')
    if (!googleEnabled()) return fail('Google sign-in is not configured.')
    if (!code || !state || !stored.state || state !== stored.state || !stored.codeVerifier || !stored.nonce) {
      return fail('Your sign-in session expired. Please try again.')
    }

    try {
      const identity = await verifyGoogleCallback({
        code,
        codeVerifier: stored.codeVerifier,
        nonce: stored.nonce,
      })
      const user = await upsertUser({
        email: identity.email,
        googleSubject: identity.sub,
        name: identity.name,
        payload: req.payload,
        req,
      })
      const cookie = await issueSession({ payload: req.payload, req, userId: user.id })
      return redirectResponse(`${serverURL()}${landingPath(user, redirect)}`, [clear, cookie])
    } catch (err) {
      req.payload.logger.error({ err, msg: '[auth] Google sign-in failed' })
      return fail('We could not sign you in with Google. Please try again.')
    }
  },
}

export const authEndpoints: Endpoint[] = [
  magicLinkEndpoint,
  googleStartEndpoint,
  googleCallbackEndpoint,
]

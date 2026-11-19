import { generateCodeVerifier, generateState, Google } from 'arctic'
import { createRemoteJWKSet, jwtVerify } from 'jose'

import { googleRedirectURI } from './config'

const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com']
const googleJWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const client = () =>
  new Google(
    process.env.GOOGLE_CLIENT_ID || '',
    process.env.GOOGLE_CLIENT_SECRET || '',
    googleRedirectURI(),
  )

/** Builds the Google authorization URL (Authorization Code + PKCE S256 + state + nonce). */
export function createGoogleAuthorization() {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const nonce = generateState()
  const url = client().createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile'])
  url.searchParams.set('nonce', nonce)
  url.searchParams.set('prompt', 'select_account')
  return { codeVerifier, nonce, state, url }
}

export type GoogleIdentity = { email: string; name?: string; sub: string }

/**
 * Exchanges the code (with the PKCE verifier) and verifies the returned ID token
 * against Google's JWKS: signature, `iss`, `aud`, expiry and `nonce`.
 * Only verified emails are accepted.
 */
export async function verifyGoogleCallback({
  code,
  codeVerifier,
  nonce,
}: {
  code: string
  codeVerifier: string
  nonce: string
}): Promise<GoogleIdentity> {
  const tokens = await client().validateAuthorizationCode(code, codeVerifier)
  const { payload: claims } = await jwtVerify(tokens.idToken(), googleJWKS, {
    audience: process.env.GOOGLE_CLIENT_ID,
    issuer: GOOGLE_ISSUERS,
  })
  if (claims.nonce !== nonce) throw new Error('Nonce mismatch')
  if (claims.email_verified !== true || typeof claims.email !== 'string') {
    throw new Error('Google account email is not verified')
  }
  if (typeof claims.sub !== 'string') throw new Error('Missing subject')
  return {
    email: claims.email.toLowerCase(),
    name: typeof claims.name === 'string' ? claims.name : undefined,
    sub: claims.sub,
  }
}

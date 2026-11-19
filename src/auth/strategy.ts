import type { AuthStrategy, AuthStrategyFunction } from 'payload'

import { jwtVerify } from 'jose'
import { JWT_AUTH_VERSION } from 'payload'
import { parseCookies } from 'payload/shared'

import { USERS_SLUG } from './config'

/**
 * Reads the session JWT the same way Payload's local strategy does: from the
 * `<cookiePrefix>-token` cookie (with Payload's CSRF origin check), or from an
 * `Authorization: JWT …` / `Bearer …` header.
 */
function extractToken(
  headers: Headers,
  payload: Parameters<AuthStrategyFunction>[0]['payload'],
): null | string {
  const auth = headers.get('Authorization')
  if (auth?.startsWith('JWT ')) return auth.slice(4)
  if (auth?.startsWith('Bearer ')) return auth.slice(7)

  const token = parseCookies(headers).get(`${payload.config.cookiePrefix}-token`)
  if (!token) return null

  const csrf = payload.config.csrf
  const origin = headers.get('Origin')
  if (origin) return csrf.length === 0 || csrf.includes(origin) ? token : null
  if (csrf.length === 0) return token
  const site = headers.get('Sec-Fetch-Site')
  if (site === 'same-origin' || site === 'same-site' || site === 'none') return token
  if (
    site === 'cross-site' &&
    headers.get('Sec-Fetch-Mode') === 'navigate' &&
    headers.get('Sec-Fetch-Dest') === 'document'
  ) {
    return token
  }
  return null
}

const authenticate: AuthStrategyFunction = async ({ headers, isGraphQL, payload, req }) => {
  const token = extractToken(headers, payload)
  if (!token) return { user: null }

  try {
    const { payload: claims, protectedHeader } = await jwtVerify(
      token,
      new TextEncoder().encode(payload.secret),
      { algorithms: ['HS256'] },
    )
    if (protectedHeader.authVersion !== JWT_AUTH_VERSION) return { user: null }
    if (claims.collection !== USERS_SLUG) return { user: null }
    const id = claims.id
    const sid = claims.sid
    if ((typeof id !== 'number' && typeof id !== 'string') || typeof sid !== 'string') {
      return { user: null }
    }

    const collection = payload.collections[USERS_SLUG].config
    const user = await payload.findByID({
      id,
      collection: USERS_SLUG,
      depth: isGraphQL ? 0 : collection.auth.depth,
      disableErrors: true,
      overrideAccess: true,
      req,
    })
    // The session must still exist on the user (logout / revocation removes it).
    const sessions = (user as { sessions?: { expiresAt: string; id: string }[] } | null)?.sessions
    const session = sessions?.find((s) => s.id === sid)
    if (!user || !session) return { user: null }

    return {
      user: Object.assign(user, {
        _sid: sid,
        _strategy: passwordlessStrategy.name,
        collection: USERS_SLUG,
      }) as never,
    }
  } catch {
    return { user: null }
  }
}

export const passwordlessStrategy: AuthStrategy = {
  name: 'passwordless',
  authenticate,
}

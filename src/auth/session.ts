import type { Payload, PayloadRequest, TypedUser } from 'payload'

import { getFieldsToSign, jwtSign } from 'payload'
import { addSessionToUser, generateExpiredPayloadCookie, generatePayloadCookie } from 'payload/shared'

import { USERS_SLUG } from './config'

/**
 * Issues a Payload session for `userId` exactly the way Payload's own login
 * operation does (minus the password check): add a session (sid) to the user,
 * sign the standard JWT and build the standard `<cookiePrefix>-token` cookie.
 *
 * Returns the `Set-Cookie` header value.
 */
export async function issueSession({
  payload,
  req,
  userId,
}: {
  payload: Payload
  req: PayloadRequest
  userId: number | string
}): Promise<string> {
  const collectionConfig = payload.collections[USERS_SLUG].config

  const user = (await payload.db.findOne({
    collection: USERS_SLUG,
    req,
    where: { id: { equals: userId } },
  })) as null | TypedUser
  if (!user) throw new Error('User not found')

  const { sid } = await addSessionToUser({ collectionConfig, payload, req, user })

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email: (user as { email?: string }).email ?? '',
    sid,
    user,
  })

  const { token } = await jwtSign({
    fieldsToSign,
    secret: payload.secret,
    tokenExpiration: collectionConfig.auth.tokenExpiration,
  })

  return generatePayloadCookie({
    collectionAuthConfig: collectionConfig.auth,
    cookiePrefix: payload.config.cookiePrefix,
    token,
  })
}

/** Removes one session (sid) from a user — used on logout. */
export async function revokeSession({
  payload,
  req,
  sid,
  userId,
}: {
  payload: Payload
  req: PayloadRequest
  sid: string
  userId: number | string
}): Promise<void> {
  const user = (await payload.db.findOne({
    collection: USERS_SLUG,
    req,
    where: { id: { equals: userId } },
  })) as null | Record<string, unknown>
  const sessions = user?.sessions as { id: string }[] | undefined
  if (!user || !sessions?.length) return

  user.sessions = sessions.filter((s) => s.id !== sid)
  // Don't bump updatedAt for a session-only change (mirrors Payload's logout).
  user.updatedAt = null
  await payload.db.updateOne({
    id: userId,
    collection: USERS_SLUG,
    data: user,
    req,
    returning: false,
  })
}

export function expiredSessionCookie(payload: Payload): string {
  return generateExpiredPayloadCookie({
    collectionAuthConfig: payload.collections[USERS_SLUG].config.auth,
    cookiePrefix: payload.config.cookiePrefix,
  })
}

import type { Payload, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

import { isAdminEmail, USERS_SLUG } from './config'

/**
 * Finds or creates the user for a verified email address.
 *
 * - New users get the `customer` role; emails listed in ADMIN_EMAILS also get `admin`.
 * - Existing users listed in ADMIN_EMAILS are promoted to admin (never demoted —
 *   roles are managed in the admin panel after bootstrap).
 * - `googleSubject` (Google's stable `sub`) is linked on first Google sign-in; a
 *   user already linked to a *different* Google account is rejected.
 */
export async function upsertUser({
  email,
  googleSubject,
  name,
  payload,
  req,
}: {
  email: string
  googleSubject?: string
  name?: string
  payload: Payload
  req: PayloadRequest
}): Promise<User> {
  const admin = isAdminEmail(email)

  let existing: User | undefined
  if (googleSubject) {
    existing = (
      await payload.find({
        collection: USERS_SLUG,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        req,
        where: { googleSubject: { equals: googleSubject } },
      })
    ).docs[0]
  }
  existing ??= (
    await payload.find({
      collection: USERS_SLUG,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      req,
      where: { email: { equals: email } },
    })
  ).docs[0]

  if (!existing) {
    return payload.create({
      collection: USERS_SLUG,
      data: {
        email,
        googleSubject,
        name: name || undefined,
        roles: admin ? ['admin', 'customer'] : ['customer'],
      },
      overrideAccess: true,
      req,
    })
  }

  if (googleSubject && existing.googleSubject && existing.googleSubject !== googleSubject) {
    throw new Error('This email is linked to a different Google account.')
  }

  const roles = existing.roles ?? []
  const data: Partial<User> = {}
  if (admin && !roles.includes('admin')) data.roles = [...roles, 'admin']
  if (googleSubject && !existing.googleSubject) data.googleSubject = googleSubject
  if (name && !existing.name) data.name = name

  if (Object.keys(data).length === 0) return existing
  return payload.update({
    id: existing.id,
    collection: USERS_SLUG,
    data,
    overrideAccess: true,
    req,
  })
}

export const isAdmin = (user: Pick<User, 'roles'>): boolean => Boolean(user.roles?.includes('admin'))

import type { User } from '@/payload-types'

import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { checkRole } from '@/access/utilities'

/** Server-side role check for build mode: the logged-in Payload user, if they are an admin. */
export async function getBuildModeAdmin() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  const admin = user && user.collection === 'users' && checkRole(['admin'], user as User)
  return { payload, user: admin ? (user as User) : null }
}

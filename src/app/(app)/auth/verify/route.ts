import configPromise from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { serverURL } from '@/auth/config'
import { errorURL, landingPath } from '@/auth/endpoints'
import { consumeMagicLink } from '@/auth/magicLink'
import { issueSession } from '@/auth/session'
import { upsertUser } from '@/auth/users'

export const dynamic = 'force-dynamic'

const redirect = (location: string, cookie?: string) => {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' })
  if (cookie) headers.append('Set-Cookie', cookie)
  return new Response(null, { headers, status: 302 })
}

/**
 * GET /auth/verify?token=… — validates and consumes a magic-link token,
 * finds or creates the user, sets the Payload session cookie and redirects.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || ''
  const payload = await getPayload({ config: configPromise })

  const consumed = await consumeMagicLink({ payload, token })
  if (!consumed) {
    return redirect(errorURL(null, 'This sign-in link is invalid or has expired. Please request a new one.'))
  }

  try {
    const req = await createLocalReq({}, payload)
    const user = await upsertUser({ email: consumed.email, payload, req })
    const cookie = await issueSession({ payload, req, userId: user.id })
    return redirect(`${serverURL()}${landingPath(user, consumed.redirect)}`, cookie)
  } catch (err) {
    payload.logger.error({ err, msg: '[auth] Magic-link sign-in failed' })
    return redirect(errorURL(consumed.redirect, 'We could not sign you in. Please try again.'))
  }
}

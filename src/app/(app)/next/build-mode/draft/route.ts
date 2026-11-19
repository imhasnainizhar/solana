import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { getSafeRedirect } from 'payload/shared'

import { getBuildModeAdmin } from '../auth'

export const dynamic = 'force-dynamic'

/**
 * GET /next/build-mode/draft?enable=1&path=/shop
 * Toggles Next.js draft mode for admins (no preview secret needed: the admin
 * session is verified server-side), then returns to `path`.
 */
export async function GET(req: NextRequest): Promise<Response> {
  const { user } = await getBuildModeAdmin()
  if (!user) return new Response('Only admins can preview drafts', { status: 403 })

  const enable = req.nextUrl.searchParams.get('enable') === '1'
  const path = getSafeRedirect({
    fallbackTo: '/',
    redirectTo: req.nextUrl.searchParams.get('path') || '/',
  })

  const draft = await draftMode()
  if (enable) draft.enable()
  else draft.disable()

  redirect(path || '/')
}

import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { getBuildModeAdmin } from './auth'

export const dynamic = 'force-dynamic'

const EDITABLE = new Set(['pages', 'products'])

/**
 * GET /next/build-mode?collection=pages&id=1
 * Build-mode state for the storefront bar. The admin role is checked server-side
 * (payload.auth with the request cookies); non-admins just get `{ admin: false }`.
 */
export async function GET(req: NextRequest) {
  const { payload, user } = await getBuildModeAdmin()
  const noStore = { headers: { 'Cache-Control': 'private, no-store' } }
  if (!user) return NextResponse.json({ admin: false }, noStore)

  const { isEnabled: draft } = await draftMode()
  const collection = req.nextUrl.searchParams.get('collection')
  const id = req.nextUrl.searchParams.get('id')

  let status: 'published' | 'changed' | 'draft' | null = null
  if (collection && id && EDITABLE.has(collection)) {
    try {
      const latest = await payload.findByID({
        collection: collection as 'pages' | 'products',
        id,
        depth: 0,
        draft: true,
        select: { _status: true },
      })
      if (latest?._status === 'published') status = 'published'
      else {
        const live = await payload.find({
          collection: collection as 'pages' | 'products',
          depth: 0,
          limit: 1,
          pagination: false,
          select: { _status: true },
          where: { and: [{ id: { equals: id } }, { _status: { equals: 'published' } }] },
        })
        status = live.docs.length ? 'changed' : 'draft'
      }
    } catch {
      status = null
    }
  }

  return NextResponse.json(
    { admin: true, draft, status, user: { email: user.email, name: user.name ?? null } },
    noStore,
  )
}

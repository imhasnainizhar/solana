import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Newsletter / waitlist sign-ups from the Newsletter block.
 * The public form posts to `POST /api/subscribers/join` ({ email, source }),
 * which always answers `{ ok: true }` for a valid address — repeat sign-ups are
 * a no-op, so the endpoint does not reveal whether an email is already listed.
 * Only admins can read / edit / delete (or create directly).
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    group: 'Customers',
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Where the sign-up came from (e.g. "waitlist", "footer").' },
      maxLength: 64,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.email && typeof data.email === 'string') data.email = data.email.trim().toLowerCase()
        if (data?.source && typeof data.source === 'string') data.source = data.source.slice(0, 64)
        return data
      },
    ],
  },
  endpoints: [
    {
      path: '/join',
      method: 'post',
      handler: async (req) => {
        let body: { email?: unknown; source?: unknown } = {}
        try {
          body = (await req.json?.()) || {}
        } catch {
          return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
        }
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
        const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'newsletter'
        if (!EMAIL.test(email) || email.length > 254) {
          return Response.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
        }
        const existing = await req.payload.find({
          collection: 'subscribers',
          where: { email: { equals: email } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        if (existing.totalDocs === 0) {
          await req.payload.create({
            collection: 'subscribers',
            data: { email, source },
            overrideAccess: true,
          })
        }
        return Response.json({ ok: true })
      },
    },
  ],
  timestamps: true,
}

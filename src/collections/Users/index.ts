import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'
import { revokeSession } from '@/auth/session'
import { passwordlessStrategy } from '@/auth/strategy'
import { baseSessionsField } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    // Accounts are created only by the sign-in flows (Google / magic link) or by admins.
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    unlock: adminOnly,
    update: adminOrSelf,
  },
  admin: {
    group: 'Users',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'email',
  },
  /**
   * Passwordless: the local (email + password) strategy is disabled, so there is
   * no password field, login, forgot- or reset-password endpoint. Sign-in happens
   * through Google OAuth or an email magic link (see src/auth/config.ts for why),
   * which issue a standard Payload session that `passwordlessStrategy` verifies.
   */
  auth: {
    disableLocalStrategy: true,
    strategies: [passwordlessStrategy],
    tokenExpiration: 1209600, // 14 days
    cookies: {
      sameSite: 'Lax',
      secure: (process.env.NEXT_PUBLIC_SERVER_URL || '').startsWith('https://') || Boolean(process.env.VERCEL),
    },
  },
  hooks: {
    // Payload's logout clears the cookie; with the local strategy disabled it
    // doesn't remove the session, so revoke it here (works for admin + storefront).
    afterLogout: [
      async ({ req }) => {
        const user = req.user as ({ _sid?: string } & typeof req.user) | null
        if (user?._sid) {
          await revokeSession({ payload: req.payload, req, sid: user._sid, userId: user.id })
        }
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      index: true,
      required: true,
      unique: true,
      // Email is the identity — only admins may change it (prevents account takeover
      // by a user switching their address to someone else's).
      access: {
        update: adminOnlyFieldAccess,
      },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)],
      },
    },
    {
      name: 'googleSubject',
      type: 'text',
      index: true,
      unique: true,
      label: 'Google account ID',
      access: {
        create: () => false,
        read: adminOnlyFieldAccess,
        update: () => false,
      },
      admin: {
        description: 'Linked automatically on first Google sign-in.',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id'],
      },
    },
    // Payload only adds the sessions array for local-strategy collections; our
    // strategy uses the same session model, so add it explicitly.
    baseSessionsField,
  ],
}

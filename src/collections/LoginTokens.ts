import type { CollectionConfig } from 'payload'

import { LOGIN_TOKENS_SLUG } from '@/auth/config'

/**
 * Single-use magic-link tokens. Only the SHA-256 hash of a token is stored;
 * the plaintext exists only in the emailed link. Also used as the
 * (serverless-safe) rate-limit ledger per email / hashed IP.
 * Not exposed over the API — only the server-side auth code touches it.
 */
export const LoginTokens: CollectionConfig = {
  slug: LOGIN_TOKENS_SLUG,
  access: {
    create: () => false,
    delete: () => false,
    read: () => false,
    update: () => false,
  },
  admin: {
    hidden: true,
  },
  fields: [
    { name: 'tokenHash', type: 'text', index: true, required: true, unique: true },
    { name: 'email', type: 'text', index: true, required: true },
    { name: 'expiresAt', type: 'date', index: true, required: true },
    { name: 'usedAt', type: 'date' },
    { name: 'ipHash', type: 'text', index: true },
    { name: 'userAgent', type: 'text' },
    { name: 'redirect', type: 'text' },
  ],
  timestamps: true,
}

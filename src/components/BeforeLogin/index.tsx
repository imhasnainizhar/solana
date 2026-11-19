import type { ServerProps } from 'payload'

import React from 'react'

import { googleEnabled, safeRedirect } from '@/auth/config'

import { AdminSignIn } from './AdminSignIn'

/**
 * Admin login view content. The users collection disables Payload's local
 * strategy, so Payload renders no email/password form — this passwordless UI
 * is the only way in. ADMIN_EMAILS users get the admin role on first sign-in.
 */
export const BeforeLogin: React.FC<ServerProps> = ({ searchParams }) => {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : null
  const redirect = safeRedirect(searchParams?.redirect)
  return (
    <AdminSignIn
      error={error}
      googleEnabled={googleEnabled()}
      redirect={redirect?.startsWith('/admin') ? redirect : '/admin'}
    />
  )
}

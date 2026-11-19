'use client'

import { useState } from 'react'

export type MagicLinkStatus = {
  email?: string
  message?: string
  state: 'error' | 'idle' | 'loading' | 'sent'
}

/** Requests a sign-in link from POST /api/auth/magic-link. */
export function useMagicLink(redirect?: null | string) {
  const [status, setStatus] = useState<MagicLinkStatus>({ state: 'idle' })

  const request = async (email: string) => {
    setStatus({ state: 'loading' })
    try {
      const res = await fetch('/api/auth/magic-link', {
        body: JSON.stringify({ email, redirect: redirect || undefined }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const json = (await res.json().catch(() => ({}))) as { message?: string; ok?: boolean }
      if (!res.ok || !json.ok) throw new Error(json.message || 'Something went wrong. Please try again.')
      setStatus({ email, message: json.message, state: 'sent' })
    } catch (err) {
      setStatus({ message: err instanceof Error ? err.message : 'Something went wrong.', state: 'error' })
    }
  }

  return { request, reset: () => setStatus({ state: 'idle' }), status }
}

export const googleHref = (redirect?: null | string) =>
  `/api/auth/google${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`

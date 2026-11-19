import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { googleEnabled, safeRedirect } from '@/auth/config'
import { PasswordlessSignIn } from '@/components/auth/PasswordlessSignIn'
import { RenderParams } from '@/components/RenderParams'
import { brand } from '@/lib/brand'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

type Props = { searchParams: Promise<{ redirect?: string }> }

export default async function Login({ searchParams }: Props) {
  const { redirect: redirectParam } = await searchParams
  const next = safeRedirect(redirectParam)
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) redirect(next ?? '/account')

  return (
    <div className="container">
      <div className="mx-auto mt-24 mb-16 max-w-[26rem] md:mt-32 md:mb-24">
        <RenderParams />
        <h1 className="sol-h2 mb-3">Sign in</h1>
        <p className="mb-10 text-[15px] text-ink-soft">
          New here or returning — it&apos;s the same step. No password needed: continue with Google
          or get a one-time sign-in link by email.
        </p>
        <PasswordlessSignIn googleEnabled={googleEnabled()} redirect={next} />
        <p className="mt-10 text-[13px] text-ink-muted">
          By continuing you agree to {brand.name}&apos;s terms and privacy policy.
        </p>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Sign in with Google or an email link — no password needed.',
  openGraph: mergeOpenGraph({ title: 'Sign in', url: '/login' }),
  title: 'Sign in',
}

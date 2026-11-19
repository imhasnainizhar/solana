'use client'

import { ArrowRight, Check, Loader2 } from 'lucide-react'
import React, { useId } from 'react'

import { GoogleIcon } from './GoogleIcon'
import { googleHref, useMagicLink } from './useMagicLink'

type Props = {
  googleEnabled: boolean
  redirect?: null | string
}

/** Storefront sign-in: "Continue with Google" + "Email me a sign-in link". No passwords. */
export function PasswordlessSignIn({ googleEnabled, redirect }: Props) {
  const { request, reset, status } = useMagicLink(redirect)
  const inputId = useId()
  const msgId = useId()

  if (status.state === 'sent') {
    return (
      <div aria-live="polite" className="flex flex-col gap-3" role="status">
        <p className="inline-flex items-center gap-2 text-[17px] tracking-[-0.01em]">
          <Check aria-hidden className="h-[18px] w-[18px]" /> Check your inbox
        </p>
        <p className="text-[15px] text-ink-soft">
          If <strong className="font-medium text-ink">{status.email}</strong> can receive email, a
          sign-in link is on its way. It works once and expires in 15 minutes.
        </p>
        <button className="self-start text-[14px] underline underline-offset-4" onClick={reset} type="button">
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {googleEnabled && (
        <>
          <a className="sol-btn sol-btn-ghost w-full" href={googleHref(redirect)}>
            <GoogleIcon /> Continue with Google
          </a>
          <div aria-hidden className="flex items-center gap-4 text-[12px] uppercase tracking-[0.08em] text-ink-muted">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          void request(String(new FormData(e.currentTarget).get('email') || ''))
        }}
      >
        <label className="text-[13px] text-ink-soft" htmlFor={inputId}>
          Email address
        </label>
        <div className="-mt-2 flex items-center gap-3 border-b-[1.5px] border-ink pb-2.5">
          <input
            aria-describedby={status.state === 'error' ? msgId : undefined}
            aria-invalid={status.state === 'error' || undefined}
            autoComplete="email"
            className="min-w-0 flex-1 bg-transparent text-[16px] tracking-[-0.01em] outline-none placeholder:text-ink/45"
            id={inputId}
            inputMode="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>
        <button className="sol-btn sol-btn-primary w-full" disabled={status.state === 'loading'} type="submit">
          {status.state === 'loading' ? (
            <Loader2 aria-hidden className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <>
              Email me a sign-in link <ArrowRight aria-hidden className="h-[16px] w-[16px]" />
            </>
          )}
        </button>
        {status.state === 'error' && (
          <p className="text-[13px] text-[var(--sol-danger)]" id={msgId} role="alert">
            {status.message}
          </p>
        )}
      </form>
    </div>
  )
}

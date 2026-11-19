'use client'

import React, { useId } from 'react'

import { GoogleIcon } from '@/components/auth/GoogleIcon'
import { googleHref, useMagicLink } from '@/components/auth/useMagicLink'

type Props = { error: null | string; googleEnabled: boolean; redirect: string }

export function AdminSignIn({ error, googleEnabled, redirect }: Props) {
  const { request, reset, status } = useMagicLink(redirect)
  const inputId = useId()

  return (
    <div className="sol-admin-signin">
      <h1 className="sol-admin-signin__title">Sign in</h1>
      <p className="sol-admin-signin__lead">
        Passwordless — continue with Google or get a one-time link by email.
      </p>

      {error && (
        <p className="sol-admin-signin__error" role="alert">
          {error}
        </p>
      )}

      {status.state === 'sent' ? (
        <div aria-live="polite" role="status">
          <p>
            <strong>Check your inbox.</strong> If {status.email} can receive email, a sign-in link
            is on its way. It works once and expires in 15 minutes.
          </p>
          <button className="btn btn--style-secondary btn--size-medium" onClick={reset} type="button">
            Use a different email
          </button>
        </div>
      ) : (
        <>
          {googleEnabled && (
            <>
              <a className="btn btn--style-secondary btn--size-large sol-admin-signin__google" href={googleHref(redirect)}>
                <GoogleIcon /> Continue with Google
              </a>
              <div aria-hidden className="sol-admin-signin__or">
                <span>or</span>
              </div>
            </>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void request(String(new FormData(e.currentTarget).get('email') || ''))
            }}
          >
            <div className="field-type email">
              <label className="field-label" htmlFor={inputId}>
                Email
              </label>
              <div className="field-type__wrap">
                <input autoComplete="email" id={inputId} name="email" required type="email" />
              </div>
            </div>
            {status.state === 'error' && (
              <p className="sol-admin-signin__error" role="alert">
                {status.message}
              </p>
            )}
            <button
              className="btn btn--style-primary btn--size-large sol-admin-signin__submit"
              disabled={status.state === 'loading'}
              type="submit"
            >
              {status.state === 'loading' ? 'Sending…' : 'Email me a sign-in link'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

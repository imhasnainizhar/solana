'use client'

import type { NewsletterBlock as Props } from '@/payload-types'

import { backgroundClass, isDark } from '@/blocks/shared/section'
import { cn } from '@/utilities/cn'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import React, { useId, useState } from 'react'

type Status = { state: 'idle' | 'loading' | 'done' | 'error'; message?: string }

export function NewsletterBlock(props: Props & { id?: string }) {
  const { heading, body, placeholder, buttonLabel, source, successMessage, layout, background, anchor } = props
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const inputId = useId()
  const msgId = useId()
  const dark = isDark(background)
  const card = layout === 'card'

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') || '')
    setStatus({ state: 'loading' })
    try {
      const res = await fetch('/api/subscribers/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: source || 'newsletter' }),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) throw new Error(json.error || 'Something went wrong. Please try again.')
      setStatus({ state: 'done', message: successMessage || "You're on the list." })
    } catch (err) {
      setStatus({ state: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  return (
    <section
      className={cn('px-[var(--sol-gutter)] py-16 md:py-24', backgroundClass(background))}
      data-surface={dark ? 'dark' : undefined}
      id={anchor || props.id}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl',
          card && 'flex max-w-2xl flex-col items-center rounded-[28px] px-6 py-14 text-center md:px-14',
          card && (dark ? 'bg-white/5' : 'bg-paper shadow-[var(--sol-shadow-float)]'),
        )}
      >
        <h2 className={cn('max-w-[22em] text-balance tracking-[-0.015em]', card ? 'sol-h2' : 'text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.3]')}>
          {heading}
        </h2>
        {body && <p className={cn('mt-3 max-w-[34rem] text-[15px]', dark ? 'opacity-70' : 'text-ink-soft')}>{body}</p>}

        {status.state === 'done' ? (
          <p aria-live="polite" className="mt-6 inline-flex items-center gap-2 text-[15px]" role="status">
            <Check aria-hidden className="h-4 w-4" /> {status.message}
          </p>
        ) : (
          <form
            className={cn(
              'mt-6 flex w-full max-w-[380px] items-center gap-3 border-b-[1.5px] pb-2.5',
              dark ? 'border-on-hero' : 'border-ink',
            )}
            noValidate={false}
            onSubmit={onSubmit}
          >
            <label className="sr-only" htmlFor={inputId}>
              Email address
            </label>
            <input
              aria-describedby={status.state === 'error' ? msgId : undefined}
              aria-invalid={status.state === 'error' || undefined}
              autoComplete="email"
              className={cn(
                'min-w-0 flex-1 bg-transparent text-[15px] tracking-[-0.01em] outline-none',
                dark ? 'placeholder:text-on-hero/55' : 'placeholder:text-ink/55',
              )}
              id={inputId}
              name="email"
              placeholder={placeholder || 'Enter your email'}
              required
              type="email"
            />
            <button
              aria-label={buttonLabel || 'Subscribe'}
              className="-m-2.5 grid shrink-0 place-items-center p-2.5 transition-transform duration-200 hover:translate-x-[3px] disabled:opacity-50"
              disabled={status.state === 'loading'}
              type="submit"
            >
              {status.state === 'loading' ? (
                <Loader2 aria-hidden className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <ArrowRight aria-hidden className="h-[18px] w-[18px]" />
              )}
            </button>
          </form>
        )}
        {status.state === 'error' && (
          <p className="mt-3 text-[13px] text-[var(--sol-danger)]" id={msgId} role="alert">
            {status.message}
          </p>
        )}
      </div>
    </section>
  )
}

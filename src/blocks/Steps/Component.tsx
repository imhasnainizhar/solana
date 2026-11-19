import type { StepsBlock as Props } from '@/payload-types'

import { backgroundClass, isDark } from '@/blocks/shared/section'
import { Reveal } from '@/components/site/Reveal'
import { cn } from '@/utilities/cn'
import React from 'react'

export function StepsBlock(props: Props & { id?: string }) {
  const { heading, intro, steps, numberStyle, background, anchor } = props
  const headingId = `${anchor || props.id || 'steps'}-heading`
  const dark = isDark(background)

  return (
    <section
      className={cn('px-[var(--sol-gutter)] py-16 md:py-24', backgroundClass(background))}
      data-surface={dark ? 'dark' : undefined}
      id={anchor || props.id}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 md:gap-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:sticky lg:top-[calc(var(--sol-nav-h)+2.5rem)] lg:col-span-5">
          <h2 className="sol-h2" id={headingId}>
            {heading.split('\n').map((line, i) => (
              <span className="block" key={i}>
                {line}
              </span>
            ))}
          </h2>
          {intro && <p className={cn('mt-6 max-w-sm text-[15px] leading-relaxed', dark ? 'opacity-70' : 'text-ink-soft')}>{intro}</p>}
        </div>
        <ol aria-labelledby={headingId} className="flex w-full flex-col gap-10 md:gap-14 lg:col-span-7">
          {steps.map((step, i) => {
            const n = numberStyle === 'plain' ? String(i + 1) : String(i + 1).padStart(2, '0')
            return (
              <Reveal as="li" className="flex items-start gap-6 md:gap-10" delay={i * 90} key={step.id || i}>
                <span
                  aria-hidden
                  className={cn('sol-h2 w-[2ch] shrink-0 tabular-nums', dark ? 'text-on-hero/60' : 'text-brand')}
                >
                  {n}
                </span>
                <p className={cn('pt-1 text-[17px] leading-[1.5] md:text-lg', dark ? 'opacity-75' : 'text-ink-soft')}>
                  <span className="sr-only">Step {n}: </span>
                  {step.title && <strong className={cn('font-medium', dark ? '' : 'text-ink')}>{step.title} </strong>}
                  {step.body}
                </p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

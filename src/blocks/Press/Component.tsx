import type { PressBlock as Props } from '@/payload-types'

import { backgroundClass } from '@/blocks/shared/section'
import { Reveal } from '@/components/site/Reveal'
import { cn } from '@/utilities/cn'
import { mediaSrc } from '@/utilities/mediaSrc'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : null

function Wrap({ url, className, children }: { url?: string | null; className: string; children: React.ReactNode }) {
  return url ? (
    <a className={className} href={url} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  )
}

export function PressBlock(props: Props & { id?: string }) {
  const { heading, style, items, background, anchor } = props
  const headingId = `${anchor || props.id || 'press'}-heading`
  const single = items.length === 1

  return (
    <section
      aria-labelledby={headingId}
      className={cn('px-[var(--sol-gutter)] py-16 md:py-24', backgroundClass(background))}
      id={anchor || props.id}
    >
      <Reveal className="mx-auto max-w-6xl">
        <h2 className="sol-h2 mb-10 md:mb-14" id={headingId}>
          {heading}
        </h2>

        {style === 'quotes' ? (
          <ul className="grid gap-x-10 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const logo = mediaSrc(item.logo, item.publication)
              return (
                <li key={item.id || i}>
                  <Wrap className="group block" url={item.url}>
                    {logo ? (
                      <span className="relative block h-7 w-32">
                        <Image alt={logo.alt} className="object-contain object-left" fill sizes="128px" src={logo.src} />
                      </span>
                    ) : (
                      <p className="sol-eyebrow">
                        <cite className="not-italic">{item.publication}</cite>
                        {item.date && (
                          <>
                            <span aria-hidden className="mx-1.5">·</span>
                            <time className="text-ink-soft" dateTime={item.date}>{fmt(item.date)}</time>
                          </>
                        )}
                      </p>
                    )}
                    <blockquote className="mt-4 font-display text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.2] tracking-[-0.02em]">
                      “{item.quote}”
                    </blockquote>
                    {item.url && (
                      <span className="mt-4 inline-flex items-center gap-1 text-sm text-ink-soft group-hover:text-ink">
                        Read <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </Wrap>
                </li>
              )
            })}
          </ul>
        ) : (
          <ul
            aria-label="Press coverage"
            className={cn(
              'sol-rail grid snap-x snap-mandatory grid-flow-col gap-6 overflow-x-auto',
              single ? 'auto-cols-[100%]' : 'auto-cols-[88%] md:auto-cols-[calc((100%-1.5rem)/2)]',
            )}
          >
            {items.map((item, i) => {
              const img = mediaSrc(item.image, '')
              return (
                <li className="snap-start" key={item.id || i}>
                  <Wrap
                    className={cn(
                      'group relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-[18px] bg-hero text-on-hero',
                      single ? 'md:aspect-[21/9] md:min-h-[360px]' : 'md:aspect-[4/3]',
                    )}
                    url={item.url}
                  >
                    {img && (
                      <Image
                        alt=""
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        fill
                        sizes={single ? '(max-width: 768px) 100vw, 1152px' : '(max-width: 768px) 88vw, 560px'}
                        src={img.src}
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,color-mix(in_srgb,var(--sol-ink)_82%,transparent))]"
                    />
                    <span className="relative block max-w-[760px] p-6 md:p-9">
                      <span className="sol-eyebrow block text-on-hero/80">
                        <cite className="not-italic">{item.publication}</cite>
                        {item.date && (
                          <>
                            <span aria-hidden className="mx-1.5">·</span>
                            <time dateTime={item.date}>{fmt(item.date)}</time>
                          </>
                        )}
                      </span>
                      <span className="mt-3 block text-[clamp(1.75rem,3.4vw,2.875rem)] leading-[1.08] tracking-[-0.02em]">
                        {item.quote}
                      </span>
                    </span>
                  </Wrap>
                </li>
              )
            })}
          </ul>
        )}
      </Reveal>
    </section>
  )
}

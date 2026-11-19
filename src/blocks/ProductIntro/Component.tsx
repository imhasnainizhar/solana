import type { ProductIntroBlock as Props } from '@/payload-types'

import { ButtonLink } from '@/blocks/shared/ButtonLink'
import { backgroundClass } from '@/blocks/shared/section'
import { Reveal } from '@/components/site/Reveal'
import { cn } from '@/utilities/cn'
import { focalPosition, mediaSrc } from '@/utilities/mediaSrc'
import Image from 'next/image'
import React from 'react'

export function ProductIntroBlock(props: Props & { id?: string }) {
  const { name, watermark, promise, secondary, image, tagline, callouts, enableLink, link, background, anchor } =
    props
  const img = mediaSrc(image, name)

  return (
    <section
      className={cn(
        'relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-[var(--sol-gutter)] py-24 md:py-40',
        backgroundClass(background),
      )}
      id={anchor || props.id}
    >
      <Reveal className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center" delay={100}>
        <span
          aria-hidden
          className="sol-display whitespace-nowrap uppercase opacity-[0.05]"
          style={{ fontSize: '20vw', lineHeight: 0.8 }}
        >
          {watermark || name}
        </span>
      </Reveal>

      <div className="relative z-10 mt-8 flex w-full max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-0">
        <Reveal
          className="relative h-[350px] w-full shrink-0 overflow-hidden rounded-[calc(24px*var(--sol-radius-scale))] bg-stone p-5 shadow-[var(--sol-shadow-card)] sm:h-[450px] md:h-[550px] lg:h-[650px] lg:w-[65%]"
          delay={250}
        >
          {img && (
            <Image
              alt={img.alt}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              src={img.src}
              style={{ objectPosition: focalPosition(img) }}
            />
          )}
          {callouts && callouts.length > 0 && (
            <div className="relative z-10 flex h-full items-end gap-3">
              {callouts.map((c, i) => {
                const cimg = mediaSrc(c.image, c.label)
                return (
                  <div
                    className="flex w-[124px] flex-col overflow-hidden rounded-[calc(16px*var(--sol-radius-scale))] bg-[#5a6770]/90 text-white shadow-xl backdrop-blur-md sm:w-[150px] md:w-[196px]"
                    key={c.id || i}
                  >
                    {cimg && (
                      <div className="relative aspect-[4/3] w-full">
                        <Image alt={cimg.alt} className="object-cover" fill sizes="200px" src={cimg.src} />
                      </div>
                    )}
                    <p className="px-2 py-2 text-center text-[10px] font-medium leading-tight text-white/95 md:text-xs">
                      {c.label}
                      {c.detail && (
                        <>
                          <br />({c.detail})
                        </>
                      )}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
          {tagline && (
            <span className="absolute bottom-5 right-5 z-10 hidden max-w-[50%] sm:block text-right text-sm font-semibold uppercase tracking-[0.06em] text-white/60 mix-blend-overlay md:text-base">
              {tagline}
            </span>
          )}
        </Reveal>

        <Reveal className="relative z-20 mx-4 -mt-16 w-auto sm:-mt-24 lg:-ml-20 lg:mt-0 lg:w-[45%]" delay={450}>
          <div className="rounded-[calc(24px*var(--sol-radius-scale))] bg-cream/70 p-8 text-ink shadow-[var(--sol-shadow-card)] backdrop-blur-3xl md:p-12">
            <h2 className="sol-display mb-6 text-4xl tracking-[-0.03em] sm:text-5xl">{name}</h2>
            <p className="text-base leading-[1.5] sm:text-lg">{promise}</p>
            {secondary && <p className="mt-6 text-base leading-[1.5] text-ink-soft sm:text-lg">{secondary}</p>}
            {enableLink && link && <ButtonLink arrow className="mt-8" link={link} />}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

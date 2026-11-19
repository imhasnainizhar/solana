'use client'

import type { SabiHeroBlock as Props } from '@/payload-types'

import { ButtonLink } from '@/blocks/shared/ButtonLink'
import { cn } from '@/utilities/cn'
import { mediaSrc, focalPosition, type ImageData } from '@/utilities/mediaSrc'
import Image from 'next/image'
import React, { useEffect, useMemo, useRef } from 'react'

/* Column width weights (sabi mixes narrow and wide columns) and per-column motion. */
const WIDTHS = [0.92, 1.28, 1.5, 2.1, 1.38, 1.3, 1.1, 1.6]
const SPEEDS = [0.16, -0.1, 0.26, -0.06, 0.2, -0.14, 0.12, -0.2]
const HEIGHTS = [78, 62, 90, 70, 84, 58, 96, 66] // tile heights in svh
const OFFSETS = [-6, -38, -14, -2, -26, -48, -20, -10] // column start offsets in svh

type Column = { tiles: { img: ImageData; h: number; key: string }[]; offset: number; speed: number; width: number }

function buildColumns(images: ImageData[], count: number, minHeight: number): Column[] {
  if (images.length === 0) return []
  return Array.from({ length: count }, (_, ci) => {
    const tiles: Column['tiles'] = []
    let total = OFFSETS[ci % OFFSETS.length]
    let ti = 0
    // round-robin through the images, repeating until the column overflows the section
    while (total < minHeight && ti < 40) {
      const img = images[(ci + ti * count) % images.length]
      const h = HEIGHTS[(ci * 3 + ti) % HEIGHTS.length]
      tiles.push({ img, h, key: `${ci}-${ti}` })
      total += h
      ti++
    }
    return {
      tiles,
      offset: OFFSETS[ci % OFFSETS.length],
      speed: SPEEDS[ci % SPEEDS.length],
      width: WIDTHS[ci % WIDTHS.length],
    }
  })
}

function Collage({ columns, drift, className }: { columns: Column[]; drift: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 gap-[clamp(4px,0.78vw,10px)] px-[clamp(4px,0.78vw,10px)]', className)}
    >
      {columns.map((col, ci) => (
        <div className="relative min-w-0" key={ci} style={{ flex: col.width }}>
          <div
            className={cn(drift && 'sol-drift')}
            style={{
              ['--drift' as string]: `${ci % 2 ? 4 : -4}%`,
              ['--drift-dur' as string]: `${32 + ((ci * 7) % 18)}s`,
            }}
          >
            <div
              className="flex flex-col gap-[clamp(4px,0.78vw,10px)] will-change-transform"
              style={{
                marginTop: `${col.offset}svh`,
                transform: `translate3d(0, calc(var(--hero-p, 0) * ${col.speed}px), 0)`,
              }}
            >
              {col.tiles.map((t, ti) => (
                <div
                  className="relative w-full shrink-0 overflow-hidden rounded-tile bg-white/5"
                  key={t.key}
                  style={{ height: `${t.h}svh` }}
                >
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    priority={ti < 2 && ci < 4}
                    sizes="(max-width: 768px) 40vw, 22vw"
                    src={t.img.src}
                    style={{ objectPosition: focalPosition(t.img) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SabiHeroBlock(props: Props & { id?: string }) {
  const {
    eyebrow,
    headline,
    subheading,
    links,
    tiles,
    columnsDesktop,
    columnsMobile,
    height,
    overlay,
    parallax,
    drift,
  } = props
  const ref = useRef<HTMLElement>(null)
  const tall = height !== 'screen'
  const sectionH = tall ? 220 : 100

  const images = useMemo(
    () => (tiles || []).map((t) => mediaSrc(t.image)).filter((i): i is ImageData => Boolean(i)),
    [tiles],
  )
  const desktop = useMemo(
    () => buildColumns(images, Math.min(Math.max(columnsDesktop || 6, 3), 8), sectionH + 70),
    [images, columnsDesktop, sectionH],
  )
  const mobile = useMemo(
    () => buildColumns(images, Math.min(Math.max(columnsMobile || 3, 2), 4), sectionH + 70),
    [images, columnsMobile, sectionH],
  )

  // Scroll parallax: one CSS variable per frame; columns multiply it by their own speed.
  useEffect(() => {
    const el = ref.current
    const strength = (parallax ?? 35) / 35
    if (!el || strength === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame: number | null = null
    const update = () => {
      frame = null
      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      el.style.setProperty('--hero-p', String(Math.round(-rect.top * strength)))
    }
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [parallax])

  const dim = Math.min(Math.max(overlay ?? 55, 0), 90) / 100

  return (
    <section
      className="relative isolate overflow-clip bg-hero text-on-hero md:[clip-path:inset(0_round_0_0_var(--sol-radius-section)_var(--sol-radius-section))]"
      data-nav-theme="dark"
      data-surface="dark"
      id={props.id}
      ref={ref}
      style={{ height: `${sectionH}svh` }}
    >
      <Collage className="hidden md:flex" columns={desktop} drift={drift !== false} />
      <Collage className="flex md:hidden" columns={mobile} drift={drift !== false} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />

      <div className="pointer-events-none sticky top-0 z-10 flex h-svh flex-col items-center justify-center px-5 text-center">
        {eyebrow && <p className="sol-eyebrow mb-5 opacity-80">{eyebrow}</p>}
        <h1 className="sol-display text-balance" style={{ fontSize: 'var(--sol-text-hero)', lineHeight: 1 }}>
          {headline}
        </h1>
        {subheading && (
          <p className="mt-6 max-w-[34rem] text-balance text-[17px] leading-[1.45] opacity-80 md:text-lg">{subheading}</p>
        )}
        {links && links.length > 0 && (
          <div className="pointer-events-auto mt-9 flex flex-wrap justify-center gap-3">
            {links.map(({ link, id }) => (
              <ButtonLink key={id} link={link} tone="light" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

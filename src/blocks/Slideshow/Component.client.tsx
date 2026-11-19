'use client'

/**
 * Slideshow — React port of the Elewind Shopify theme's slideshow
 * (sections/slideshow.liquid + blocks/_slide.liquid / _slide-content.liquid).
 *
 * Ported behaviours (Elewind name → here):
 *  - Transitions `fade` / `slide` / `rise` / `wipe` with Elewind's timings
 *    (fade & slide 800ms, rise 1400ms with the creative prev/next transforms
 *    [-30% y, -2deg, 1.17 scale] / [104% y, 2deg, 1.04 scale], wipe 1000ms with
 *    the clip-path reveal from the entering edge, incoming media settling from ⅛
 *    width and the base media drifting ¼ width).  Swiper is not used: the same
 *    motion is drawn with the Web Animations API.
 *  - Loop (`loop: true`), autoplay with configurable interval ("Change slides every").
 *  - Autoplay *holds* (`hold(reason, on)`): off-screen (IntersectionObserver),
 *    keyboard focus inside, dragging, pointer hover (pause on hover) and the
 *    user's play/pause button — the timer stops where it is and resumes from there.
 *  - Timer-driven fills (`tick()` → `--ssh-fill`): progress line, bar fills and the
 *    play/pause ring (pathLength 1 dash offset); `progressStyle: position` shows
 *    slide position instead.
 *  - Controls: default (arrows + counter + line), progress text, arrows + play,
 *    dots, bars with labels (labels default to the slide heading, `applyLabels`).
 *  - Counter styles `1 / 3` and `01 | 03`, the latter rolling the old number out
 *    and the new one in (`rollCounter`).
 *  - Arrow styles chevron / long arrow.
 *  - Media zoom on change (`zoomMedia`): active media 1.2 → 1 over 900ms, the
 *    previous one eases back to 1.2 over 2.7s.
 *  - Per-slide text reveal (`revealText` / `stageReveals`): content rows rise
 *    60px into place 100ms apart each time a slide becomes active.
 *  - Swipe to change slides (`allowTouchMove`), plus ←/→ keys.
 *  - Per-slide colour scheme, 9-way text position (desktop) + top/middle/bottom
 *    (mobile), text alignment, separate mobile image, overlay.
 *  - Reduced motion: no autoplay, no zoom/reveal, instant transitions.
 *  - Dispatches `slideshow:change` (bubbles; detail { index, total, id }).
 * Not ported: "content outside the slide", sticky/cover-on-scroll mode,
 * thumbnails control, drag-to-scrub (a swipe triggers the transition instead).
 */

import type { SlideshowBlock } from '@/payload-types'

import { ButtonLink } from '@/blocks/shared/ButtonLink'
import { cn } from '@/utilities/cn'
import { focalPosition, mediaSrc } from '@/utilities/mediaSrc'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Slide = SlideshowBlock['slides'][number]
type Effect = 'fade' | 'slide' | 'rise' | 'wipe'

const SPEED: Record<Effect, number> = { fade: 800, slide: 800, rise: 1400, wipe: 1000 }
const EASE_MOVE = 'cubic-bezier(0.65, 0, 0.35, 1)'
const EASE_ZOOM = 'cubic-bezier(0.25, 0.6, 0.5, 0.95)'
const EASE_TEXT = 'cubic-bezier(0.165, 0.84, 0.44, 1)'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const posClass: Record<string, string> = {
  'top-left': 'md:items-start md:justify-start',
  'top-center': 'md:items-start md:justify-center',
  'top-right': 'md:items-start md:justify-end',
  'middle-left': 'md:items-center md:justify-start',
  'middle-center': 'md:items-center md:justify-center',
  'middle-right': 'md:items-center md:justify-end',
  'bottom-left': 'md:items-end md:justify-start',
  'bottom-center': 'md:items-end md:justify-center',
  'bottom-right': 'md:items-end md:justify-end',
}
const mobilePos: Record<string, string> = {
  top: 'items-start',
  middle: 'items-center',
  bottom: 'items-end',
}
const alignClass: Record<string, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}
const lightText = (scheme?: string | null) => scheme !== 'dark' && scheme !== 'cream'

export function SlideshowClient(props: SlideshowBlock & { id?: string }) {
  const {
    slides,
    transition,
    autoplay,
    interval,
    pauseOnHover,
    swipe,
    controls = 'default',
    progressStyle,
    counterStyle,
    arrowStyle,
    container,
    heightDesktop,
    heightMobile,
    radius,
    anchor,
  } = props
  const effect: Effect = (transition as Effect) || 'fade'
  const total = slides.length
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null) // outgoing slide stays visible mid-transition
  const [paused, setPaused] = useState(false) // user play/pause
  const rootRef = useRef<HTMLElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const indexRef = useRef(0)
  const busy = useRef(false)
  const holds = useRef<Set<string>>(new Set())
  const elapsed = useRef(0)
  const animations = useRef<Animation[]>([])
  const delay = Math.min(Math.max(interval || 5, 2), 10) * 1000
  const timerMode = Boolean(autoplay) && progressStyle !== 'position'
  const sectionId = anchor || props.id

  /** Writes the fill (0..1) used by the progress line, bars and play ring. */
  const tick = useCallback((value: number) => {
    rootRef.current?.style.setProperty('--ssh-fill', value.toFixed(4))
  }, [])

  // ── Per-slide entrance: media zoom + text rise (zoomMedia / revealText) ──────
  const stage = useCallback((next: number, prev: number | null, textDelay: number) => {
    if (reducedMotion()) return
    const el = slideRefs.current[next]
    const media = el?.querySelector<HTMLElement>('[data-ssh-media]')
    media?.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }], {
      duration: 900,
      easing: EASE_ZOOM,
      fill: 'forwards',
    })
    if (prev !== null && prev !== next) {
      const prevMedia = slideRefs.current[prev]?.querySelector<HTMLElement>('[data-ssh-media]')
      prevMedia?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }], {
        duration: 2700,
        easing: EASE_ZOOM,
        fill: 'forwards',
      })
    }
    el?.querySelectorAll<HTMLElement>('[data-ssh-row]').forEach((row, i) => {
      row.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 60px, 0)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 800, delay: textDelay + i * 100, easing: EASE_TEXT, fill: 'both' },
      )
    })
  }, [])

  // ── Transition between two slides ───────────────────────────────────────────
  const go = useCallback(
    (target: number, dirHint?: 1 | -1) => {
      const from = indexRef.current
      const to = ((target % total) + total) % total
      if (to === from || busy.current || total < 2) return
      const dir: 1 | -1 = dirHint ?? (to > from ? 1 : -1)
      const inEl = slideRefs.current[to]
      const outEl = slideRefs.current[from]
      animations.current.forEach((a) => a.cancel())
      animations.current = []
      elapsed.current = 0
      tick(timerMode ? 0 : (to + 1) / total)
      indexRef.current = to
      setIndex(to)

      if (!inEl || !outEl || reducedMotion()) {
        stage(to, from, 0)
        return
      }
      busy.current = true
      setLeaving(from)
      const d = SPEED[effect]
      const opts = { duration: d, easing: EASE_MOVE, fill: 'both' as const }
      const run: Animation[] = []
      const inMedia = inEl.querySelector<HTMLElement>('[data-ssh-move]')
      const outMedia = outEl.querySelector<HTMLElement>('[data-ssh-move]')

      outEl.style.zIndex = '1'
      inEl.style.zIndex = '2'
      if (effect === 'fade') {
        run.push(inEl.animate([{ opacity: 0 }, { opacity: 1 }], { ...opts, easing: 'ease' }))
      } else if (effect === 'slide') {
        run.push(
          inEl.animate(
            [{ transform: `translate3d(${dir * 100}%,0,0)` }, { transform: 'none' }],
            opts,
          ),
        )
        run.push(
          outEl.animate(
            [{ transform: 'none' }, { transform: `translate3d(${-dir * 100}%,0,0)` }],
            opts,
          ),
        )
      } else if (effect === 'rise') {
        const y = dir > 0 ? 104 : -104
        run.push(
          inEl.animate(
            [
              { transform: `translate3d(0, ${y}%, 0) rotate(${2 * dir}deg) scale(1.04)` },
              { transform: 'none' },
            ],
            opts,
          ),
        )
        run.push(
          outEl.animate(
            [
              { transform: 'none', filter: 'brightness(1)' },
              {
                transform: `translate3d(0, ${-30 * dir}%, -1px) rotate(${-2 * dir}deg) scale(1.17)`,
                filter: 'brightness(0.45)',
              },
            ],
            opts,
          ),
        )
      } else {
        // wipe: incoming is uncovered from the edge it enters by
        const start = dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'
        run.push(inEl.animate([{ clipPath: start }, { clipPath: 'inset(0 0 0 0)' }], opts))
        if (inMedia)
          run.push(
            inMedia.animate(
              [{ transform: `translate3d(${dir * 12.5}%,0,0)` }, { transform: 'none' }],
              opts,
            ),
          )
        if (outMedia)
          run.push(
            outMedia.animate(
              [{ transform: 'none' }, { transform: `translate3d(${-dir * 25}%,0,0)` }],
              opts,
            ),
          )
      }
      animations.current = run
      stage(to, from, effect === 'wipe' ? 600 : effect === 'rise' ? 500 : 250)

      window.setTimeout(() => {
        run.forEach((a) => a.cancel())
        outEl.style.zIndex = ''
        inEl.style.zIndex = ''
        busy.current = false
        setLeaving(null)
      }, d + 30)

      rootRef.current?.dispatchEvent(
        new CustomEvent('slideshow:change', {
          bubbles: true,
          detail: { index: to, total, id: sectionId },
        }),
      )
    },
    [effect, stage, tick, timerMode, total, sectionId],
  )

  const next = useCallback(() => go(indexRef.current + 1, 1), [go])
  const prev = useCallback(() => go(indexRef.current - 1, -1), [go])

  // first slide entrance once it scrolls into view
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    tick(timerMode ? 0 : 1 / total)
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        stage(indexRef.current, null, 200)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [stage, tick, timerMode, total])

  // ── Autoplay with holds ─────────────────────────────────────────────────────
  const hold = useCallback((reason: string, on: boolean) => {
    if (on) holds.current.add(reason)
    else holds.current.delete(reason)
  }, [])

  useEffect(() => {
    hold('user', paused)
  }, [paused, hold])

  useEffect(() => {
    if (!autoplay || total < 2 || reducedMotion()) return
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => hold('offscreen', !e.isIntersecting)),
    )
    io.observe(el)
    let last = performance.now()
    let frame = requestAnimationFrame(function loop(now) {
      const dt = now - last
      last = now
      if (holds.current.size === 0 && !busy.current && document.visibilityState === 'visible') {
        elapsed.current += dt
        if (timerMode) tick(Math.min(1, elapsed.current / delay))
        if (elapsed.current >= delay) {
          elapsed.current = 0
          go(indexRef.current + 1, 1)
        }
      }
      frame = requestAnimationFrame(loop)
    })
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [autoplay, delay, go, hold, tick, timerMode, total])

  // focus hold: only keyboard focus (focus-visible), not the play button itself
  const onFocusChange = () => {
    window.setTimeout(() => {
      const f = document.activeElement as HTMLElement | null
      hold(
        'focus',
        Boolean(
          f &&
          rootRef.current?.contains(f) &&
          f.matches(':focus-visible') &&
          !f.matches('[data-ssh-play]'),
        ),
      )
    })
  }

  // ── Swipe ────────────────────────────────────────────────────────────────
  const drag = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!swipe || e.button !== 0 || (e.target as HTMLElement).closest('a,button')) return
    drag.current = { x: e.clientX, y: e.clientY }
    hold('drag', true)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    drag.current = null
    hold('drag', false)
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next()
      else prev()
    }
  }

  const active = slides[index]
  const pad = (n: number) => (counterStyle === 'divider' ? String(n).padStart(2, '0') : String(n))
  const ArrowPrev = arrowStyle === 'long' ? ArrowLeft : ChevronLeft
  const ArrowNext = arrowStyle === 'long' ? ArrowRight : ChevronRight
  const onLight = lightText(active?.scheme)
  const inset = container !== 'full'
  const hD = Math.min(Math.max(heightDesktop || 88, 50), 100)
  const hM = Math.min(Math.max(heightMobile || 80, 60), 100)

  const arrowBtn = cn(
    'grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-colors',
    onLight ? 'bg-white/12 text-white hover:bg-white/25' : 'bg-ink/8 text-ink hover:bg-ink/15',
  )

  return (
    <section
      aria-label="Featured slideshow"
      aria-roledescription="carousel"
      className={cn(
        'relative',
        inset ? 'bg-cream px-[clamp(0.5rem,1.2vw,1rem)] py-[clamp(0.5rem,1.2vw,1rem)]' : '',
      )}
      data-nav-theme={onLight ? 'dark' : undefined}
      id={sectionId}
      onBlur={onFocusChange}
      onFocus={onFocusChange}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }}
      onMouseEnter={() => pauseOnHover && hold('hover', true)}
      onMouseLeave={() => hold('hover', false)}
      ref={rootRef}
      style={
        {
          ['--ssh-h' as string]: `${hD}svh`,
          ['--ssh-h-m' as string]: `${hM}svh`,
        } as React.CSSProperties
      }
    >
      <div
        className="relative h-[var(--ssh-h-m)] touch-pan-y overflow-hidden bg-hero select-none md:h-[var(--ssh-h)]"
        onPointerCancel={() => {
          drag.current = null
          hold('drag', false)
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ borderRadius: inset ? `${radius ?? 24}px` : 0, isolation: 'isolate' }}
      >
        <div aria-live={autoplay && !paused ? 'off' : 'polite'}>
          {slides.map((slide, i) => (
            <SlideView
              active={i === index}
              visible={i === index || i === leaving}
              index={i}
              key={slide.id || i}
              ref={(el) => {
                slideRefs.current[i] = el
              }}
              slide={slide}
              total={total}
            />
          ))}
        </div>

        {total > 1 && (
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 md:p-7',
              onLight ? 'text-white' : 'text-ink',
            )}
          >
            {(controls === 'default' || controls === 'progress-text') && (
              <div className="pointer-events-auto ml-auto flex items-center gap-4">
                <Counter
                  current={pad(index + 1)}
                  divider={counterStyle === 'divider'}
                  total={pad(total)}
                />
                <span
                  aria-hidden
                  className="relative h-px w-16 overflow-hidden bg-current/25 md:w-24"
                >
                  <span
                    className="absolute inset-0 origin-left bg-current"
                    style={{ transform: 'scaleX(var(--ssh-fill, 0))' }}
                  />
                </span>
                {controls === 'default' && (
                  <span className="flex gap-2">
                    <button
                      aria-label="Previous slide"
                      className={arrowBtn}
                      onClick={prev}
                      type="button"
                    >
                      <ArrowPrev aria-hidden className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Next slide"
                      className={arrowBtn}
                      onClick={next}
                      type="button"
                    >
                      <ArrowNext aria-hidden className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {controls === 'arrows-play' && (
              <div className="pointer-events-auto ml-auto flex items-center gap-2">
                <button
                  aria-label="Previous slide"
                  className={arrowBtn}
                  onClick={prev}
                  type="button"
                >
                  <ArrowPrev aria-hidden className="h-4 w-4" />
                </button>
                {autoplay && (
                  <button
                    aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                    aria-pressed={paused}
                    className={cn(arrowBtn, 'relative')}
                    data-ssh-play
                    onClick={() => setPaused((p) => !p)}
                    type="button"
                  >
                    <svg aria-hidden className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
                      <circle
                        cx="22"
                        cy="22"
                        fill="none"
                        opacity="0.25"
                        r="20.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        fill="none"
                        pathLength={1}
                        r="20.5"
                        stroke="currentColor"
                        strokeDasharray="1"
                        strokeWidth="1.5"
                        style={{ strokeDashoffset: 'calc(1 - var(--ssh-fill, 0))' }}
                      />
                    </svg>
                    {paused ? (
                      <Play aria-hidden className="h-3.5 w-3.5" />
                    ) : (
                      <Pause aria-hidden className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
                <button aria-label="Next slide" className={arrowBtn} onClick={next} type="button">
                  <ArrowNext aria-hidden className="h-4 w-4" />
                </button>
              </div>
            )}

            {controls === 'dots' && (
              <div
                className="pointer-events-auto mx-auto flex items-center gap-2"
                role="group"
                aria-label="Choose slide"
              >
                {slides.map((s, i) => (
                  <button
                    aria-current={i === index ? 'true' : undefined}
                    aria-label={`Go to slide ${i + 1}`}
                    className="grid h-8 place-items-center px-1"
                    key={s.id || i}
                    onClick={() => go(i)}
                    type="button"
                  >
                    <span
                      className={cn(
                        'relative block h-1.5 overflow-hidden rounded-full bg-current/30 transition-[width] duration-500',
                        i === index ? 'w-8' : 'w-1.5',
                      )}
                    >
                      {i === index && (
                        <span
                          className="absolute inset-0 origin-left bg-current"
                          style={{ transform: `scaleX(${timerMode ? 'var(--ssh-fill, 0)' : 1})` }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {controls === 'bars' && (
              <div
                className="pointer-events-auto grid w-full gap-3 md:gap-5"
                role="group"
                aria-label="Choose slide"
                style={{ gridTemplateColumns: `repeat(${total}, minmax(0,1fr))` }}
              >
                {slides.map((s, i) => (
                  <button
                    aria-current={i === index ? 'true' : undefined}
                    className={cn(
                      'text-left transition-opacity',
                      i === index ? 'opacity-100' : 'opacity-60 hover:opacity-90',
                    )}
                    key={s.id || i}
                    onClick={() => go(i)}
                    type="button"
                  >
                    <span className="relative block h-0.5 overflow-hidden rounded-full bg-current/25">
                      <span
                        className="absolute inset-0 origin-left bg-current"
                        style={{
                          transform: `scaleX(${i === index ? (timerMode ? 'var(--ssh-fill, 0)' : 1) : i < index && !timerMode ? 1 : 0})`,
                        }}
                      />
                    </span>
                    <span className="mt-2.5 hidden truncate text-[13px] md:block">
                      {s.label || s.heading || `Slide ${i + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/** "01 | 03" counter — the old number rolls up and out while the new one rolls in. */
function Counter({
  current,
  total,
  divider,
}: {
  current: string
  total: string
  divider: boolean
}) {
  return (
    <span className="flex items-center gap-2 text-[13px] tabular-nums">
      <span aria-hidden className="relative inline-grid h-[1.2em] overflow-hidden">
        <span className="animate-[ssh-roll_0.45s_var(--sol-ease-out)]" key={current}>
          {current}
        </span>
      </span>
      <span aria-hidden className="opacity-50">
        {divider ? '|' : '/'}
      </span>
      <span aria-hidden className="opacity-70">
        {total}
      </span>
      <span className="sr-only">
        Slide {Number(current)} of {Number(total)}
      </span>
    </span>
  )
}

const SlideView = React.forwardRef<
  HTMLDivElement,
  { slide: Slide; active: boolean; visible: boolean; index: number; total: number }
>(function SlideView({ slide, active, visible, index, total }, ref) {
  const img = mediaSrc(slide.image, slide.heading || '')
  const imgM = mediaSrc(slide.imageMobile, slide.heading || '')
  const scheme = slide.scheme || 'light'
  const light = lightText(scheme)
  const panel = scheme === 'cream' || scheme === 'ink'
  const dim = Math.min(Math.max(slide.overlay ?? 25, 0), 80) / 100

  return (
    <div
      aria-hidden={!active}
      aria-label={`${index + 1} of ${total}`}
      aria-roledescription="slide"
      className={cn('absolute inset-0 overflow-hidden', visible ? 'visible' : 'invisible')}
      data-surface={light ? 'dark' : undefined}
      inert={!active}
      ref={ref}
      role="group"
      style={{ zIndex: active ? 1 : 0 }}
    >
      <div className="absolute inset-0" data-ssh-move>
        <div className="absolute inset-0" data-ssh-media>
          {img && (
            <Image
              alt={img.alt}
              className={cn('object-cover', imgM && 'hidden md:block')}
              fill
              priority={index === 0}
              sizes="100vw"
              src={img.src}
              style={{ objectPosition: focalPosition(img) }}
            />
          )}
          {imgM && (
            <Image
              alt={imgM.alt}
              className="object-cover md:hidden"
              fill
              sizes="100vw"
              src={imgM.src}
              style={{ objectPosition: focalPosition(imgM) }}
            />
          )}
        </div>
      </div>
      {dim > 0 && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: light
              ? `linear-gradient(180deg, rgb(0 0 0 / calc(${dim * 0.5} * var(--sol-hero-overlay))) 0%, rgb(0 0 0 / calc(${dim} * var(--sol-hero-overlay))) 100%)`
              : `rgb(250 247 241 / calc(${dim * 0.6} * var(--sol-hero-overlay)))`,
          }}
        />
      )}
      <div
        className={cn(
          'absolute inset-0 flex justify-center p-5 pb-24 pt-[calc(var(--sol-nav-h)+2rem)] md:p-12 md:pb-28',
          mobilePos[slide.positionMobile || 'bottom'],
          posClass[slide.position || 'bottom-left'],
        )}
      >
        <div
          className={cn(
            'flex max-w-[36rem] flex-col gap-4',
            alignClass[slide.alignment || 'left'],
            light ? 'text-white' : 'text-ink',
            panel && 'rounded-[calc(24px*var(--sol-radius-scale))] p-7 backdrop-blur-xl md:p-9',
            scheme === 'cream' && 'bg-cream/85 text-ink',
            scheme === 'ink' && 'bg-ink/80 text-on-hero',
          )}
        >
          {slide.eyebrow && (
            <p className="sol-eyebrow opacity-80" data-ssh-row>
              {slide.eyebrow}
            </p>
          )}
          {slide.heading && (
            <h3
              className="sol-display text-[clamp(2.25rem,5.5vw,4.75rem)] text-balance"
              data-ssh-row
            >
              {slide.heading}
            </h3>
          )}
          {slide.subheading && (
            <p
              className="max-w-[30rem] text-[16px] leading-[1.5] opacity-85 md:text-[17px]"
              data-ssh-row
            >
              {slide.subheading}
            </p>
          )}
          {slide.links && slide.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3" data-ssh-row>
              {slide.links.map(({ link, id }) => (
                <ButtonLink
                  key={id}
                  link={link}
                  tone={light || scheme === 'ink' ? 'light' : 'dark'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

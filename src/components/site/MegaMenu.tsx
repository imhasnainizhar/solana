'use client'

import { cn } from '@/utilities/cn'
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { NavItem } from './nav'

/**
 * Desktop mega menu (re-implemented from nemaya's interaction model):
 * opens on hover with intent delay, on click or keyboard; closes on mouse-leave,
 * Escape (focus returns to the trigger), outside click or navigation.
 * The panel is a detached rounded card that drops below the floating pill.
 */
export function MegaMenu({
  items,
  onOpenChange,
}: {
  items: NavItem[]
  onOpenChange?: (open: boolean) => void
}) {
  const [state, setState] = useState<{ id: string | null; path: string }>({ id: null, path: '' })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({})
  const pathname = usePathname()
  const openId = state.path === pathname ? state.id : null

  const set = useCallback(
    (id: string | null) => setState({ id, path: pathname }),
    [pathname],
  )
  const schedule = useCallback(
    (id: string | null, ms: number) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => set(id), ms)
    },
    [set],
  )

  useEffect(() => {
    onOpenChange?.(openId !== null)
  }, [openId, onOpenChange])

  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      triggers.current[openId]?.focus()
      set(null)
    }
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) set(null)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [openId, set])

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const megaItems = items.filter((i) => i.kind === 'mega')

  return (
    <div className="hidden lg:block" onMouseLeave={() => schedule(null, 180)} ref={root}>
      <ul className="flex items-center gap-0.5">
        {items.map((item) => (
          <li key={item.id}>
            {item.kind === 'mega' ? (
              <button
                aria-controls={`mega-${item.id}`}
                aria-expanded={openId === item.id}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] tracking-[-0.005em] transition-colors',
                  openId === item.id ? 'bg-stone text-ink' : 'opacity-80 hover:opacity-100',
                )}
                onClick={() => set(openId === item.id ? null : item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    set(item.id)
                    setTimeout(() => {
                      document.querySelector<HTMLElement>(`#mega-${item.id} a`)?.focus()
                    }, 60)
                  }
                }}
                onMouseEnter={() => schedule(item.id, openId ? 0 : 120)}
                ref={(el) => {
                  triggers.current[item.id] = el
                }}
                type="button"
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  className={cn('h-3.5 w-3.5 transition-transform duration-300', openId === item.id && 'rotate-180')}
                />
              </button>
            ) : (
              <Link
                className="inline-flex rounded-full px-3.5 py-2 text-[13.5px] tracking-[-0.005em] opacity-80 transition-opacity hover:opacity-100"
                href={item.href}
                onMouseEnter={() => schedule(null, 150)}
                {...(item.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {megaItems.map((item) => (
        <div
          className="sol-mega absolute inset-x-0 top-full pt-2"
          data-open={openId === item.id}
          id={`mega-${item.id}`}
          inert={openId !== item.id}
          key={item.id}
          onMouseEnter={() => timer.current && clearTimeout(timer.current)}
        >
          <div className="rounded-[calc(28px*var(--sol-radius-scale))] bg-paper p-3 text-ink shadow-[var(--sol-shadow-float)] ring-1 ring-ink/5 backdrop-blur-xl">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${Math.max(item.groups.length, 1)}, minmax(0, 1fr)) ${
                  item.featured.length ? `minmax(0, ${item.featured.length * 0.9}fr)` : ''
                }`,
              }}
            >
              {item.groups.map((group, gi) => (
                <div className="sol-mega-col p-5" key={group.title + gi} style={{ ['--i' as string]: gi }}>
                  <p className="sol-eyebrow mb-4 text-ink-muted">{group.title}</p>
                  <ul className="space-y-0.5">
                    {group.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link
                          className="group -mx-3 flex items-start justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-stone/70"
                          href={l.href}
                          onClick={() => set(null)}
                        >
                          <span className="min-w-0">
                            <span className="block text-[15px] leading-tight">{l.label}</span>
                            {l.description && (
                              <span className="mt-1 block truncate text-[13px] text-ink-soft">{l.description}</span>
                            )}
                          </span>
                          <ArrowRight
                            aria-hidden
                            className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {gi === 0 && (
                    <Link
                      className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
                      href={item.href}
                      onClick={() => set(null)}
                    >
                      View all <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              ))}
              {item.featured.length > 0 && (
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: `repeat(${item.featured.length}, minmax(0, 1fr))` }}
                >
                  {item.featured.map((f, fi) => (
                    <Link
                      className="sol-mega-col group relative block min-h-[300px] overflow-hidden rounded-[calc(20px*var(--sol-radius-scale))] bg-stone"
                      href={f.href}
                      key={f.title + fi}
                      onClick={() => set(null)}
                      style={{ ['--i' as string]: item.groups.length + fi }}
                    >
                      {f.image && (
                        <Image
                          alt={f.image.alt}
                          className="object-cover transition-transform duration-700 ease-[var(--sol-ease-out)] group-hover:scale-[1.04]"
                          fill
                          sizes="320px"
                          src={f.image.src}
                        />
                      )}
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(0_0_0/0.55))]" />
                      <span className="absolute inset-x-0 bottom-0 p-5 text-on-hero">
                        {f.eyebrow && <span className="sol-eyebrow block opacity-80">{f.eyebrow}</span>}
                        <span className="mt-1 flex items-center justify-between gap-2 text-xl leading-tight tracking-tight">
                          {f.title}
                          <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0" />
                        </span>
                        {f.caption && <span className="mt-1 block text-[13px] opacity-75">{f.caption}</span>}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

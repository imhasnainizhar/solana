'use client'

import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, ShoppingBag, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import type { NavItem } from './nav'
import { RollText } from './RollText'
import { Sheet, SheetClose } from './Sheet'
import { useCartCount } from './useCartCount'
import { useUI } from './ui-context'

const big =
  'flex w-full items-center justify-between py-1.5 text-left font-display text-[32px] leading-[1.15] tracking-[-0.03em]'

/**
 * Menu drawer (re-implemented from nemaya's menu-drawer): a detached panel that
 * slides in from the left, big rolling-letter links with a staggered reveal and
 * drill-down submenus (mega-menu groups) that slide in from the right.
 */
export function MenuDrawer({ items, wordmark }: { items: NavItem[]; wordmark: string }) {
  const ui = useUI()
  const { user } = useAuth()
  const count = useCartCount()
  const [sub, setSub] = useState<string | null>(null)
  const open = ui.panel === 'menu'
  const close = () => {
    ui.close()
    setTimeout(() => setSub(null), 600)
  }

  return (
    <Sheet
      anchor="left"
      className="inset-y-2 left-2 w-[min(440px,calc(100%-1rem))] rounded-[calc(28px*var(--sol-radius-scale))]"
      label="Menu"
      onClose={close}
      open={open}
    >
      <div className="relative h-full overflow-hidden">
        {/* root panel */}
        <div
          aria-hidden={sub !== null}
          className="flex h-full flex-col overflow-y-auto px-6 pb-8 sol-rail"
          inert={sub !== null}
        >
          <div className="sol-reveal flex items-center justify-between pb-8 pt-5" style={{ ['--d' as string]: '0.15s' }}>
            <span className="font-display text-[22px] tracking-[-0.045em]">{wordmark}</span>
            <SheetClose label="Close menu" onClick={close} />
          </div>

          <nav aria-label="Menu">
            <ul>
              {[{ id: 'home', label: 'Home', href: '/', kind: 'link' as const, groups: [], featured: [] }, ...items].map(
                (item, i) => (
                  <li className="sol-reveal" key={item.id} style={{ ['--d' as string]: `${0.2 + i * 0.045}s` }}>
                    {item.kind === 'mega' ? (
                      <button className={big} onClick={() => setSub(item.id)} type="button">
                        <RollText>{item.label}</RollText>
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-stone">
                          <ChevronRight aria-hidden className="h-4 w-4" />
                        </span>
                      </button>
                    ) : (
                      <Link className={big} href={item.href} onClick={close}>
                        <RollText>{item.label}</RollText>
                      </Link>
                    )}
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="sol-reveal mt-8 grid grid-cols-3 gap-2" style={{ ['--d' as string]: '0.45s' }}>
            <Link
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone/80 py-3.5 text-xs font-medium transition-colors hover:bg-stone"
              href={user ? '/account' : '/login'}
              onClick={close}
            >
              <User aria-hidden className="h-4 w-4" /> {user ? 'Account' : 'Sign in'}
            </Link>
            <button
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone/80 py-3.5 text-xs font-medium transition-colors hover:bg-stone"
              onClick={() => ui.open('search')}
              type="button"
            >
              <Search aria-hidden className="h-4 w-4" /> Search
            </button>
            <button
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone/80 py-3.5 text-xs font-medium transition-colors hover:bg-stone"
              onClick={() => ui.open('cart')}
              type="button"
            >
              <ShoppingBag aria-hidden className="h-4 w-4" /> Cart ({count})
            </button>
          </div>

          {items.flatMap((i) => i.featured).slice(0, 1).map((f) => (
            <Link
              className="sol-reveal group relative mt-6 block aspect-[16/10] overflow-hidden rounded-[calc(22px*var(--sol-radius-scale))] bg-stone"
              href={f.href}
              key={f.title}
              onClick={close}
              style={{ ['--d' as string]: '0.5s' }}
            >
              {f.image && (
                <Image alt={f.image.alt} className="object-cover" fill sizes="420px" src={f.image.src} />
              )}
              <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(0_0_0/0.55))]" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-on-hero">
                <span>
                  {f.eyebrow && <span className="sol-eyebrow block opacity-80">{f.eyebrow}</span>}
                  <span className="text-lg leading-tight">{f.title}</span>
                </span>
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* drill-down submenus */}
        {items
          .filter((i) => i.kind === 'mega')
          .map((item) => (
            <div
              aria-hidden={sub !== item.id}
              className="sol-submenu absolute inset-0 overflow-y-auto bg-paper px-6 pb-8 sol-rail"
              data-active={sub === item.id}
              inert={sub !== item.id}
              key={item.id}
            >
              <button
                className="mb-6 mt-5 flex w-full items-center gap-2 border-b border-line pb-4 text-sm"
                onClick={() => setSub(null)}
                type="button"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-stone">
                  <ChevronLeft aria-hidden className="h-4 w-4" />
                </span>
                Back
              </button>
              <p className="sol-eyebrow mb-2 text-ink-muted">{item.label}</p>
              <Link
                className={cn(big, 'sol-sub-item')}
                href={item.href}
                onClick={close}
                style={{ ['--i' as string]: 0 }}
              >
                <RollText>View all</RollText>
              </Link>
              {item.groups.map((group, gi) => (
                <div className="mt-6" key={group.title + gi}>
                  <p className="sol-eyebrow sol-sub-item mb-2 text-ink-muted" style={{ ['--i' as string]: gi * 4 + 1 }}>
                    {group.title}
                  </p>
                  {group.links.map((l, li) => (
                    <Link
                      className="sol-sub-item flex items-baseline justify-between gap-3 py-2"
                      href={l.href}
                      key={l.href + l.label}
                      onClick={close}
                      style={{ ['--i' as string]: gi * 4 + li + 2 }}
                    >
                      <span className="font-display text-2xl tracking-[-0.02em]">{l.label}</span>
                      {l.description && <span className="truncate text-xs text-ink-soft">{l.description}</span>}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
      </div>
    </Sheet>
  )
}

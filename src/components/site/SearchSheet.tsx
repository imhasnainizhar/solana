'use client'

import { ArrowRight, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'

import type { NavItem, NavLink } from './nav'
import { Sheet, SheetClose } from './Sheet'
import { useUI } from './ui-context'

/** Search panel: drops from the top, submits to /shop?q=… and lists quick links. */
export function SearchSheet({ items }: { items: NavItem[] }) {
  const ui = useUI()
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const quick: NavLink[] = items
    .flatMap((i): NavLink[] => (i.kind === 'mega' ? i.groups.flatMap((g) => g.links) : [i]))
    .slice(0, 6)

  return (
    <Sheet
      anchor="top"
      className="inset-x-2 top-2 mx-auto max-w-[760px] rounded-[calc(28px*var(--sol-radius-scale))]"
      initialFocus={input}
      label="Search"
      onClose={ui.close}
      open={ui.panel === 'search'}
    >
      <form
        className="flex items-center gap-3 border-b border-line px-5 py-4 md:px-7"
        onSubmit={(e) => {
          e.preventDefault()
          const q = input.current?.value.trim()
          ui.close()
          router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
        }}
        role="search"
      >
        <Search aria-hidden className="h-5 w-5 shrink-0 text-ink-soft" strokeWidth={1.6} />
        <label className="sr-only" htmlFor="site-search">
          Search products
        </label>
        <input
          autoComplete="off"
          className="h-12 min-w-0 flex-1 bg-transparent font-display text-2xl tracking-[-0.02em] outline-none focus-visible:outline-none placeholder:text-ink-muted md:text-3xl"
          id="site-search"
          name="q"
          placeholder="Search the store"
          ref={input}
          type="search"
        />
        <SheetClose label="Close search" onClick={ui.close} />
      </form>
      {quick.length > 0 && (
        <div className="px-5 py-5 md:px-7">
          <p className="sol-eyebrow mb-3 text-ink-muted">Quick links</p>
          <ul className="grid gap-1 sm:grid-cols-2">
            {quick.map((l) => (
              <li key={l.href + l.label}>
                <Link
                  className="group flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors hover:bg-stone/70"
                  href={l.href}
                  onClick={ui.close}
                >
                  {l.label}
                  <ArrowRight aria-hidden className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  )
}

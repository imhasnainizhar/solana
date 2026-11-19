'use client'

import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { MegaMenu } from './MegaMenu'
import { MenuTrigger } from './MenuTrigger'
import type { NavItem } from './nav'
import { useCartCount } from './useCartCount'
import { useUI } from './ui-context'

/**
 * Floating navbar: a detached, blurred pill.
 *  - hides when scrolling down, re-appears when scrolling up (never while a menu is open)
 *  - switches to light-on-dark while it sits over any `[data-nav-theme="dark"]` section
 *    (e.g. the SabiHero), and is fully transparent at the very top of a dark hero
 */
export function Navbar({ items, wordmark }: { items: NavItem[]; wordmark: string }) {
  const ui = useUI()
  const count = useCartCount()
  const { user } = useAuth()
  const [hidden, setHidden] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [megaOpen, setMegaOpen] = useState(false)
  const lastY = useRef(0)
  const frame = useRef<number | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const measure = useCallback(() => {
    frame.current = null
    const y = window.scrollY
    const delta = y - lastY.current
    if (Math.abs(delta) > 6) {
      setHidden(delta > 0 && y > 140)
      lastY.current = y
    }
    setAtTop(y < 24)
    const probe = (navRef.current?.getBoundingClientRect().bottom ?? 60) - 20
    let dark = false
    document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top <= probe && r.bottom >= probe) dark = true
    })
    setOnDark(dark)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(measure)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [measure])

  const forceShow = megaOpen || ui.panel !== null
  const dark = onDark && !megaOpen
  const bare = dark && atTop

  return (
    <header
      className="sol-nav pointer-events-none fixed inset-x-0 top-[var(--sol-nav-inset)] z-50 px-[var(--sol-nav-inset)]"
      data-hidden={hidden && !forceShow}
      ref={navRef}
    >
      <nav
        aria-label="Main"
        className={cn(
          'sol-nav-pill pointer-events-auto relative mx-auto grid h-[var(--sol-nav-h)] max-w-[var(--sol-maxw-wide)] grid-cols-[1fr_auto] items-center gap-4 rounded-full pl-5 pr-2 md:pl-6 lg:grid-cols-[1fr_auto_1fr]',
          bare
            ? 'bg-transparent text-on-hero'
            : dark
              ? 'bg-black/25 text-on-hero ring-1 ring-white/10 backdrop-blur-xl'
              : 'bg-cream/75 text-ink shadow-[var(--sol-shadow-float)] ring-1 ring-ink/5 backdrop-blur-xl',
        )}
        data-surface={dark ? 'dark' : 'light'}
      >
        <Link
          aria-label="Home"
          className="justify-self-start font-display text-[22px] leading-none tracking-[-0.045em] md:text-[24px]"
          href="/"
        >
          {wordmark}
        </Link>

        <MegaMenu items={items} onOpenChange={setMegaOpen} />

        <div className="flex items-center justify-self-end gap-0.5">
          <button
            aria-label="Search"
            className="sol-icon-btn hidden lg:grid"
            onClick={() => ui.open('search')}
            type="button"
          >
            <Search aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          <Link
            aria-label={user ? 'Your account' : 'Sign in'}
            className="sol-icon-btn hidden lg:grid"
            href={user ? '/account' : '/login'}
          >
            <User aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </Link>
          <button
            aria-haspopup="dialog"
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            className={cn(
              'relative ml-1 hidden h-10 items-center gap-2 rounded-full px-4 text-[13.5px] transition-colors lg:inline-flex',
              dark ? 'bg-white/12 hover:bg-white/20' : 'bg-ink text-cream hover:bg-ink/85',
            )}
            onClick={() => ui.open('cart')}
            type="button"
          >
            <ShoppingBag aria-hidden className="h-4 w-4" strokeWidth={1.7} />
            Cart
            <span className="tabular-nums opacity-70">{count}</span>
          </button>
          <MenuTrigger className="lg:hidden" />
        </div>
      </nav>
    </header>
  )
}

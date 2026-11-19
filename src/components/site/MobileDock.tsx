'use client'

import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { Home, Search, ShoppingBag, Store, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useCartCount } from './useCartCount'
import { useUI } from './ui-context'

/**
 * Floating bottom dock for phones/tablets (hidden from lg up), after nemaya's
 * mobile-dock: a frosted pill that rises in once the page has painted.
 */
export function MobileDock() {
  const ui = useUI()
  const pathname = usePathname()
  const count = useCartCount()
  const { user } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250)
    return () => clearTimeout(t)
  }, [])

  const item =
    'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1 text-[10.5px] leading-3 transition-colors'
  const tone = (on: boolean) => (on ? 'text-ink' : 'text-ink-soft')

  return (
    <div
      className="sol-dock fixed inset-x-0 bottom-3 z-40 mx-auto max-w-[560px] px-3 lg:hidden"
      data-ready={ready}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <nav
        aria-label="Quick navigation"
        className="flex h-[var(--sol-dock-h)] items-center rounded-full bg-paper/70 px-3 shadow-[var(--sol-shadow-float)] ring-1 ring-ink/5 backdrop-blur-xl"
      >
        <Link aria-current={pathname === '/' ? 'page' : undefined} className={cn(item, tone(pathname === '/' && !ui.panel))} href="/">
          <Home aria-hidden className="h-[22px] w-[22px]" strokeWidth={1.5} />
          Home
        </Link>
        <Link
          aria-current={pathname.startsWith('/shop') ? 'page' : undefined}
          className={cn(item, tone(pathname.startsWith('/shop') && !ui.panel))}
          href="/shop"
        >
          <Store aria-hidden className="h-[22px] w-[22px]" strokeWidth={1.5} />
          Shop
        </Link>
        <button
          aria-haspopup="dialog"
          className={cn(item, tone(ui.panel === 'search'))}
          onClick={() => ui.open('search')}
          type="button"
        >
          <Search aria-hidden className="h-[22px] w-[22px]" strokeWidth={1.5} />
          Search
        </button>
        <button
          aria-haspopup="dialog"
          aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          className={cn(item, tone(ui.panel === 'cart'))}
          onClick={() => ui.open('cart')}
          type="button"
        >
          <span className="relative block">
            <ShoppingBag aria-hidden className="h-[22px] w-[22px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-2 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold leading-none text-cream tabular-nums">
                {count}
              </span>
            )}
          </span>
          Cart
        </button>
        <Link
          aria-current={pathname.startsWith('/account') ? 'page' : undefined}
          className={cn(item, tone(pathname.startsWith('/account') && !ui.panel))}
          href={user ? '/account' : '/login'}
        >
          <User aria-hidden className="h-[22px] w-[22px]" strokeWidth={1.5} />
          {user ? 'Account' : 'Sign in'}
        </Link>
      </nav>
    </div>
  )
}

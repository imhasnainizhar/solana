'use client'

import { cn } from '@/utilities/cn'
import { X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const subscribe = () => () => undefined
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

type SheetProps = {
  open: boolean
  onClose: () => void
  /** accessible name of the dialog */
  label: string
  anchor?: 'left' | 'right' | 'top' | 'bottom'
  /** classes for the floating panel (size + position) */
  className?: string
  children: React.ReactNode
  /** element to focus when opened (defaults to the panel itself) */
  initialFocus?: React.RefObject<HTMLElement | null>
}

/**
 * Detached floating drawer (cart, menu, search):
 * portal + overlay, slides from an edge, Esc / overlay click closes, focus is
 * trapped inside and restored to the opener on close, page scroll is locked.
 * Motion lives in motion.css (.sol-overlay / .sol-sheet) and honours
 * prefers-reduced-motion.
 */
export function Sheet({
  open,
  onClose,
  label,
  anchor = 'right',
  className,
  children,
  initialFocus,
}: SheetProps) {
  const isClient = useIsClient()
  const [rendered, setRendered] = useState(open)
  const [shown, setShown] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  if (open && !rendered) setRendered(true)

  useEffect(() => {
    if (!rendered) return
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow = 'hidden'
      if (scrollbar > 0) document.documentElement.style.paddingRight = `${scrollbar}px`
      // let the closed state paint first so the transition runs
      const show = window.setTimeout(() => setShown(true), 20)
      const focus = window.setTimeout(() => {
        const target = initialFocus?.current || panelRef.current
        target?.focus({ preventScroll: true })
      }, 60)
      return () => {
        window.clearTimeout(show)
        window.clearTimeout(focus)
      }
    }
    const hide = window.setTimeout(() => setShown(false), 0)
    document.documentElement.style.overflow = ''
    document.documentElement.style.paddingRight = ''
    lastFocus.current?.focus?.({ preventScroll: true })
    const unmount = window.setTimeout(() => setRendered(false), 650)
    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(unmount)
    }
  }, [open, rendered, initialFocus])

  // unlock scroll if unmounted while open
  useEffect(
    () => () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.paddingRight = ''
    },
    [],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.closest('[inert]') && el.offsetParent !== null,
      )
      if (nodes.length === 0) {
        e.preventDefault()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  if (!isClient || !rendered) return null

  return createPortal(
    <div className="fixed inset-0 z-[70]" data-open={shown && open} onKeyDown={onKeyDown}>
      <div aria-hidden className="sol-overlay absolute inset-0" onClick={onClose} />
      <div
        aria-label={label}
        aria-modal="true"
        className={cn(
          'sol-sheet absolute flex flex-col overflow-hidden bg-paper text-ink shadow-[var(--sol-shadow-card)] outline-none',
          className,
        )}
        data-anchor={anchor}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function SheetClose({ onClick, className, label = 'Close' }: { onClick: () => void; className?: string; label?: string }) {
  return (
    <button
      aria-label={label}
      className={cn(
        'sol-close grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone transition-colors hover:bg-line',
        className,
      )}
      onClick={onClick}
      type="button"
    >
      <X className="h-4 w-4" strokeWidth={1.8} />
    </button>
  )
}

'use client'

import { cn } from '@/utilities/cn'

import { useUI } from './ui-context'

/** Two-line glyph that morphs into a close "×" while the menu drawer is open. */
export function MenuTrigger({ className }: { className?: string }) {
  const ui = useUI()
  const open = ui.panel === 'menu'
  return (
    <button
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={cn('sol-icon-btn', className)}
      onClick={() => ui.toggle('menu')}
      type="button"
    >
      <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" viewBox="0 0 24 24">
        <path
          className="sol-morph"
          d="M4 9h16"
          style={{ transform: open ? 'translateY(3px) rotate(45deg)' : 'none', transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <path
          className="sol-morph"
          d="M4 15h16"
          style={{ transform: open ? 'translateY(-3px) rotate(-45deg)' : 'none', transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      </svg>
    </button>
  )
}

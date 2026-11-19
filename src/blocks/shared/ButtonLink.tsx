import { cn } from '@/utilities/cn'
import { resolveHref, type LinkFieldValue } from '@/utilities/resolveLink'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  link?: (LinkFieldValue & { appearance?: string | null }) | null
  /** "light" = cream button for dark surfaces */
  tone?: 'dark' | 'light'
  className?: string
  arrow?: boolean
}

/** Renders a Payload `link` field as a pill button (default = solid, outline = ghost). */
export function ButtonLink({ link, tone = 'dark', className, arrow }: Props) {
  const href = resolveHref(link)
  if (!href || !link?.label) return null
  const ghost = link.appearance === 'outline'
  return (
    <Link
      className={cn(
        'sol-btn',
        ghost ? 'sol-btn-ghost' : tone === 'light' ? 'sol-btn-light' : 'sol-btn-primary',
        className,
      )}
      href={href}
      {...(link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
    >
      {link.label}
      {arrow && <ArrowRight aria-hidden className="h-4 w-4" />}
    </Link>
  )
}

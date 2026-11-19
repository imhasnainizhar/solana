'use client'

import { cn } from '@/utilities/cn'
import React, { useEffect, useRef, useState } from 'react'

/**
 * Fades/rises its children into view once (IntersectionObserver).
 * Under prefers-reduced-motion the CSS shows content immediately.
 */
export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  style,
}: {
  as?: 'div' | 'li' | 'section' | 'span'
  children: React.ReactNode
  className?: string
  delay?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return React.createElement(
    Tag,
    {
      className: cn('sol-inview', className),
      'data-shown': shown,
      ref,
      style: { ...style, ['--d' as string]: `${delay}ms` },
    },
    children,
  )
}

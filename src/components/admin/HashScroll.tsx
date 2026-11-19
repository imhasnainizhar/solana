'use client'

import React, { useEffect } from 'react'

/**
 * Admin provider: makes storefront "Edit section" deep links work. When the URL
 * hash points at a blocks-field row (e.g. `#layout-row-3`), wait for the edit
 * view to render, then scroll the row into view and flash it.
 */
export function HashScroll({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!/^[\w-]+-row-\d+$/.test(id)) return
      let tries = 0
      const timer = window.setInterval(() => {
        const el = document.getElementById(id)
        if (el || ++tries > 40) window.clearInterval(timer)
        if (!el) return
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('sol-row-flash')
        window.setTimeout(() => el.classList.remove('sol-row-flash'), 2400)
      }, 150)
    }
    go()
    window.addEventListener('hashchange', go)
    return () => window.removeEventListener('hashchange', go)
  }, [])
  return <>{children}</>
}

'use client'

import React, { useEffect, useState } from 'react'

import { buildThemeCss, resolveMotion, type ThemeSettings } from '@/theme/css'

/**
 * While the Theme global is open in the admin's Live Preview, Payload posts the
 * unsaved form data to this iframe on every change. Re-build the theme CSS in
 * the browser so colour / font / radius tweaks show instantly, before saving.
 * (Saving re-renders the server <style> via RefreshRouteOnSave anyway.)
 */
export function ThemeLivePreview() {
  const [css, setCss] = useState<string | null>(null)

  useEffect(() => {
    if (window.self === window.top) return // only inside the live-preview iframe
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const msg = event.data as { type?: string; globalSlug?: string; data?: ThemeSettings }
      if (msg?.type !== 'payload-live-preview' || msg.globalSlug !== 'theme' || !msg.data) return
      setCss(buildThemeCss(msg.data))
      document.documentElement.dataset.motion = resolveMotion(msg.data)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Rendered after the server theme <style>, so it wins at equal specificity.
  return css ? <style data-theme-live-preview="">{css}</style> : null
}

'use client'

import { usePathname } from 'next/navigation'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type Panel = 'menu' | 'cart' | 'search' | null

type UIContextValue = {
  panel: Panel
  open: (panel: Exclude<Panel, null>) => void
  close: () => void
  toggle: (panel: Exclude<Panel, null>) => void
}

const UIContext = createContext<UIContextValue>({
  panel: null,
  open: () => undefined,
  close: () => undefined,
  toggle: () => undefined,
})

/** One panel (menu drawer, cart drawer, search) is open at a time; navigation closes it. */
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ panel: Panel; path: string | null }>({ panel: null, path: null })
  const pathname = usePathname()

  // A panel opened on another route is treated as closed (route change closes panels).
  const panel = state.path === pathname ? state.panel : null

  const open = useCallback((p: Exclude<Panel, null>) => setState({ panel: p, path: pathname }), [pathname])
  const close = useCallback(() => setState((s) => ({ ...s, panel: null })), [])
  const toggle = useCallback(
    (p: Exclude<Panel, null>) =>
      setState((s) => (s.panel === p && s.path === pathname ? { ...s, panel: null } : { panel: p, path: pathname })),
    [pathname],
  )

  const value = useMemo(() => ({ panel, open, close, toggle }), [panel, open, close, toggle])
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUI = () => useContext(UIContext)

'use client'

import { useSyncExternalStore } from 'react'

/** The document the current storefront route renders (set by <BuildModeDoc/>). */
export type BuildModeDocInfo = {
  collection: 'pages' | 'products'
  id: number | string
  title?: string | null
}

let current: BuildModeDocInfo | null = null
const listeners = new Set<() => void>()

export const setBuildModeDoc = (doc: BuildModeDocInfo | null) => {
  current = doc
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useBuildModeDoc = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  )

'use client'

import { useEffect } from 'react'

import { type BuildModeDocInfo, setBuildModeDoc } from './store'

/** Tells the build-mode bar which admin document the current route renders. Renders nothing. */
export function BuildModeDoc({ collection, id, title }: BuildModeDocInfo) {
  useEffect(() => {
    setBuildModeDoc({ collection, id, title })
    return () => setBuildModeDoc(null)
  }, [collection, id, title])
  return null
}

import React from 'react'

import { brand } from '@/lib/brand'

/** Admin login / nav logo: the lowercase wordmark set in the display face. */
export const Logo = () => {
  return (
    <span
      style={{
        fontFamily: 'var(--font-inter-tight), system-ui, sans-serif',
        fontSize: 34,
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}
    >
      {brand.wordmark}
    </span>
  )
}

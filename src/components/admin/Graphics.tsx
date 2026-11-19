import React from 'react'

import { brand } from '@/lib/brand'

/** Placeholder brand mark (ring) — replace with your own logo. */
const Mark = ({ size }: { size: number }) => (
  <svg aria-hidden height={size} viewBox="0 0 64 64" width={size}>
    <rect fill="currentColor" height="64" rx="16" width="64" />
    <circle cx="32" cy="32" fill="none" r="13" stroke="var(--theme-bg, #fff)" strokeWidth="5" />
  </svg>
)

/** Admin nav icon. */
export const Icon = () => <Mark size={26} />

/** Admin login logo. */
export const Logo = () => (
  <span style={{ alignItems: 'center', display: 'inline-flex', gap: 14 }}>
    <Mark size={44} />
    <span style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1 }}>
      {brand.wordmark}
    </span>
  </span>
)

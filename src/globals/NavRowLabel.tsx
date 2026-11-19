'use client'

import { useRowLabel } from '@payloadcms/ui'

type Row = { kind?: string; link?: { label?: string } }

export const NavRowLabel = () => {
  const { data, rowNumber } = useRowLabel<Row>()
  const label = data?.link?.label || `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  return (
    <span>
      {label}
      {data?.kind === 'mega' ? ' · mega menu' : ''}
    </span>
  )
}

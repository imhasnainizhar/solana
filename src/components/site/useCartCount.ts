'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useMemo } from 'react'

export function useCartCount() {
  const { cart } = useCart()
  return useMemo(
    () => (cart?.items || []).reduce((n: number, item: { quantity?: number | null }) => n + (item.quantity || 0), 0),
    [cart],
  )
}

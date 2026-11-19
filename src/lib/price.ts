import type { Product } from '@/payload-types'

/** Lowest / highest price across a product and its variants (cents). */
export function priceRange(p: Product): { low: number | null; high: number | null } {
  const prices: number[] = []
  if (p.enableVariants) {
    for (const v of p.variants?.docs || []) {
      if (typeof v === 'object' && typeof v.priceInUSD === 'number') prices.push(v.priceInUSD)
    }
  }
  if (!prices.length && typeof p.priceInUSD === 'number') prices.push(p.priceInUSD)
  if (!prices.length) return { low: null, high: null }
  return { low: Math.min(...prices), high: Math.max(...prices) }
}

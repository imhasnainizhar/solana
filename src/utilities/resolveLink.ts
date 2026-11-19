import type { Page, Product } from '@/payload-types'

/** Shape produced by the `link()` field builder (src/fields/link.ts). */
export type LinkFieldValue = {
  type?: 'reference' | 'custom' | null
  newTab?: boolean | null
  url?: string | null
  label?: string | null
  reference?:
    | {
        relationTo: 'pages' | 'products'
        value: Page | Product | number | string
      }
    | null
}

export type ResolvedLink = { href: string; label: string; newTab: boolean }

/** Turns a Payload link field into an href; returns null when it cannot be resolved. */
export const resolveHref = (link?: LinkFieldValue | null): string | null => {
  if (!link) return null
  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const slug = link.reference.value?.slug
    if (!slug) return null
    if (link.reference.relationTo === 'products') return `/products/${slug}`
    return slug === 'home' ? '/' : `/${slug}`
  }
  return link.url || null
}

export const resolveLink = (link?: LinkFieldValue | null, fallbackLabel = ''): ResolvedLink | null => {
  const href = resolveHref(link)
  if (!href) return null
  return { href, label: link?.label || fallbackLabel, newTab: Boolean(link?.newTab) }
}

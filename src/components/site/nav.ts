import type { Footer, Header } from '@/payload-types'

import { mediaSrc, type ImageData } from '@/utilities/mediaSrc'
import { resolveHref, type LinkFieldValue } from '@/utilities/resolveLink'

export type NavLink = { label: string; href: string; newTab?: boolean; description?: string }
export type NavFeature = {
  title: string
  eyebrow?: string
  caption?: string
  href: string
  image: ImageData | null
}
export type NavGroup = { title: string; links: NavLink[] }
export type NavItem = {
  id: string
  label: string
  href: string
  newTab?: boolean
  kind: 'link' | 'mega'
  groups: NavGroup[]
  featured: NavFeature[]
}
export type FooterData = {
  tagline?: string
  legal?: string
  showWordmark: boolean
  columns: NavGroup[]
}

const toLink = (link: LinkFieldValue | undefined | null, description?: string | null): NavLink | null => {
  const href = resolveHref(link)
  if (!href || !link?.label) return null
  return { label: link.label, href, newTab: Boolean(link.newTab), description: description || undefined }
}

/** Normalises the Header global (depth ≥ 1) into plain, serialisable nav data for client components. */
export const toNavItems = (header: Header | null | undefined): NavItem[] =>
  (header?.navItems || []).flatMap((item, index) => {
    const link = item.link as LinkFieldValue
    const href = resolveHref(link) || '#'
    const label = link?.label
    if (!label) return []
    const kind = item.kind === 'mega' ? 'mega' : 'link'
    return [
      {
        id: item.id || String(index),
        label,
        href,
        newTab: Boolean(link?.newTab),
        kind,
        groups:
          kind === 'mega'
            ? (item.groups || []).map((g) => ({
                title: g.title,
                links: (g.links || [])
                  .map((l) => toLink(l.link as LinkFieldValue, l.description))
                  .filter((l): l is NavLink => Boolean(l)),
              }))
            : [],
        featured:
          kind === 'mega'
            ? (item.featured || []).map((f) => ({
                title: f.title,
                eyebrow: f.eyebrow || undefined,
                caption: f.caption || undefined,
                href: resolveHref(f.link as LinkFieldValue) || href,
                image: mediaSrc(f.image, f.title),
              }))
            : [],
      } satisfies NavItem,
    ]
  })

export const toFooterData = (footer: Footer | null | undefined): FooterData => ({
  tagline: footer?.tagline || undefined,
  legal: footer?.legal || undefined,
  showWordmark: footer?.showWordmark !== false,
  columns: (footer?.columns || []).map((c) => ({
    title: c.title,
    links: (c.links || [])
      .map((l) => toLink(l.link as LinkFieldValue))
      .filter((l): l is NavLink => Boolean(l)),
  })),
})

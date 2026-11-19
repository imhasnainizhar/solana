import type { Plugin } from 'payload'

/**
 * Groups the admin sidebar into Store / Content / Settings. Runs last so it
 * also covers collections added by the ecommerce, form-builder and SEO plugins.
 */
const GROUPS: Record<string, string[]> = {
  Store: [
    'products',
    'variants',
    'variantTypes',
    'variantOptions',
    'categories',
    'orders',
    'carts',
    'transactions',
    'addresses',
  ],
  Content: ['pages', 'media', 'forms', 'form-submissions', 'subscribers'],
  Settings: ['users', 'header', 'footer', 'theme'],
}

const groupFor = (slug: string) =>
  Object.keys(GROUPS).find((group) => GROUPS[group]!.includes(slug))

const order = Object.keys(GROUPS)
const rank = (slug: string) => {
  const group = groupFor(slug)
  return group ? order.indexOf(group) : order.length
}

export const adminGroupsPlugin: Plugin = (config) => ({
  ...config,
  // The sidebar/dashboard lists groups in order of first appearance, so sort (stably) by group.
  collections: config.collections
    ?.map((c) => {
      const group = groupFor(c.slug)
      return group ? { ...c, admin: { ...c.admin, group } } : c
    })
    .sort((a, b) => rank(a.slug) - rank(b.slug)),
  globals: config.globals?.map((g) => {
    const group = groupFor(g.slug)
    return group ? { ...g, admin: { ...g.admin, group } } : g
  }),
})

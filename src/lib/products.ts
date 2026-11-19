import type { Product } from '@/payload-types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

type ID = number | string

const published = (draft: boolean): Where[] => (draft ? [] : [{ _status: { equals: 'published' } }])

/** Full product (variants, variant types + options, gallery) for purchase UIs. */
export async function getProductForPurchase(id: ID): Promise<Product | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { and: [{ id: { equals: id } }, ...published(draft)] },
    populate: {
      variants: { title: true, priceInUSD: true, inventory: true, options: true },
    },
  })
  return result.docs?.[0] || null
}

/** Lightweight product list for cards. */
export async function getProducts(opts: {
  ids?: ID[]
  categoryId?: ID | null
  limit?: number
}): Promise<Product[]> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const and: Where[] = [...published(draft)]
  if (opts.ids?.length) and.push({ id: { in: opts.ids } })
  if (opts.categoryId != null) and.push({ categories: { contains: opts.categoryId } })
  const result = await payload.find({
    collection: 'products',
    depth: 1,
    draft,
    limit: opts.limit || 12,
    overrideAccess: draft,
    pagination: false,
    sort: '-createdAt',
    where: { and },
    select: {
      title: true,
      slug: true,
      gallery: true,
      priceInUSD: true,
      enableVariants: true,
      variants: true,
      meta: true,
      categories: true,
    },
    populate: { variants: { priceInUSD: true } },
  })
  const docs = result.docs as Product[]
  if (opts.ids?.length) {
    const order = opts.ids.map(String)
    docs.sort((a, b) => order.indexOf(String(a.id)) - order.indexOf(String(b.id)))
  }
  return docs
}

export { priceRange } from './price'

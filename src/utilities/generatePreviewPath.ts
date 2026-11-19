import { PreviewSearchParams } from '@/app/(app)/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  products: '/products',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    path: `${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}

/** Live-preview URL for globals (header, footer, theme): previews a storefront path in draft mode. */
export const generateGlobalPreviewPath = (path = '/') =>
  `/next/preview?${new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams).toString()}`

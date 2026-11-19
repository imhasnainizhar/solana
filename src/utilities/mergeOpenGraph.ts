import type { Metadata } from 'next'

import { brand } from '@/lib/brand'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: brand.description,
  images: [
    {
      url: '/og-image.png',
    },
  ],
  siteName: brand.name,
  title: brand.name,
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

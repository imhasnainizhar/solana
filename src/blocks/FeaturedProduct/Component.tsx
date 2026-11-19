import type { FeaturedProductBlock as Props } from '@/payload-types'

import { backgroundClass, isDark } from '@/blocks/shared/section'
import { getProductForPurchase } from '@/lib/products'
import { cn } from '@/utilities/cn'
import React from 'react'

import { Purchase } from './Purchase.client'

export async function FeaturedProductBlock(props: Props & { id?: string }) {
  const { product: ref, eyebrow, heading, description, highlights, imagePosition, buttonLabel, background, anchor } =
    props
  const id = typeof ref === 'object' && ref ? ref.id : ref
  const product = id != null ? await getProductForPurchase(id) : null
  if (!product) return null

  return (
    <section
      className={cn('sol-section', backgroundClass(background))}
      data-surface={isDark(background) ? 'dark' : undefined}
      id={anchor || props.id}
    >
      <div className="sol-container">
        <Purchase
          buttonLabel={buttonLabel || 'Add to cart'}
          dark={isDark(background)}
          description={description || product.meta?.description || ''}
          eyebrow={eyebrow || ''}
          heading={heading || product.title}
          highlights={(highlights || []).map((h) => h.text)}
          imageRight={imagePosition === 'right'}
          product={product}
        />
      </div>
    </section>
  )
}

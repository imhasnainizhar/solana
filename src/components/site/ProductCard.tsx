import type { Product } from '@/payload-types'

import { Price } from '@/components/Price'
import { priceRange } from '@/lib/price'
import { cn } from '@/utilities/cn'
import { mediaSrc } from '@/utilities/mediaSrc'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

/** Minimal product card: tall rounded image (second image on hover), title, price. */
export function ProductCard({ product, className, sizes }: { product: Product; className?: string; sizes?: string }) {
  const gallery = product.gallery || []
  const first = mediaSrc(gallery[0]?.image, product.title) || mediaSrc(product.meta?.image, product.title)
  const second = mediaSrc(gallery[1]?.image, product.title)
  const { low, high } = priceRange(product)

  return (
    <Link className={cn('group block', className)} href={`/products/${product.slug}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--sol-radius-md)] bg-stone">
        {first && (
          <Image
            alt={first.alt}
            className={cn(
              'object-cover transition-[transform,opacity] duration-700 ease-[var(--sol-ease-out)] group-hover:scale-[1.03]',
              second && 'group-hover:opacity-0',
            )}
            fill
            sizes={sizes || '(max-width: 768px) 80vw, 33vw'}
            src={first.src}
          />
        )}
        {second && (
          <Image
            alt=""
            className="object-cover opacity-0 transition-[transform,opacity] duration-700 ease-[var(--sol-ease-out)] group-hover:scale-[1.03] group-hover:opacity-100"
            fill
            sizes={sizes || '(max-width: 768px) 80vw, 33vw'}
            src={second.src}
          />
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="text-[15px] leading-tight">{product.title}</h3>
        {low !== null && (
          <span className="text-[15px] text-ink-soft tabular-nums">
            {high !== null && high !== low ? (
              <Price as="span" highestAmount={high} lowestAmount={low} />
            ) : (
              <Price amount={low} as="span" />
            )}
          </span>
        )}
      </div>
    </Link>
  )
}

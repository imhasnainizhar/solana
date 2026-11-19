import type { CollectionBlock as Props } from '@/payload-types'

import { backgroundClass } from '@/blocks/shared/section'
import { ProductCard } from '@/components/site/ProductCard'
import { Reveal } from '@/components/site/Reveal'
import { getProducts } from '@/lib/products'
import { cn } from '@/utilities/cn'
import { resolveLink, type LinkFieldValue } from '@/utilities/resolveLink'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const gridCols: Record<string, string> = {
  '2': 'grid-cols-2',
  '3': 'grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-2 lg:grid-cols-4',
}
const railCols: Record<string, string> = {
  '2': 'auto-cols-[82%] sm:auto-cols-[calc((100%-1.25rem)/2)]',
  '3': 'auto-cols-[78%] sm:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-2.5rem)/3)]',
  '4': 'auto-cols-[72%] sm:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-3.75rem)/4)]',
}

export async function CollectionBlock(props: Props & { id?: string }) {
  const { heading, intro, source, category, products: picked, display, columns, limit, enableLink, link, background, anchor } =
    props
  const cols = columns || '3'

  const products =
    source === 'manual'
      ? await getProducts({ ids: (picked || []).map((p) => (typeof p === 'object' ? p.id : p)) })
      : await getProducts({
          categoryId: source === 'category' && category ? (typeof category === 'object' ? category.id : category) : null,
          limit: limit || 6,
        })

  if (!products.length) return null
  const more = enableLink ? resolveLink(link as LinkFieldValue, 'View all') : null

  return (
    <section className={cn('sol-section', backgroundClass(background))} id={anchor || props.id}>
      <div className="sol-container">
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            {heading && <h2 className="sol-h2">{heading}</h2>}
            {intro && <p className="mt-3 max-w-md text-[15px] text-ink-soft">{intro}</p>}
          </div>
          {more && (
            <Link className="hidden shrink-0 items-center gap-1.5 text-sm hover:opacity-60 sm:inline-flex" href={more.href}>
              {more.label} <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          )}
        </div>
        {display === 'carousel' ? (
          <ul
            aria-label={heading || 'Products'}
            className={cn('sol-rail -mx-[var(--sol-gutter)] grid snap-x snap-mandatory grid-flow-col gap-5 overflow-x-auto scroll-px-[var(--sol-gutter)] px-[var(--sol-gutter)]', railCols[cols])}
          >
            {products.map((p, i) => (
              <Reveal as="li" className="snap-start" delay={i * 70} key={p.id}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul className={cn('grid gap-x-3 gap-y-10 sm:gap-x-5', gridCols[cols])}>
            {products.map((p, i) => (
              <Reveal as="li" delay={(i % Number(cols)) * 80} key={p.id}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        )}
        {more && (
          <Link className="mt-10 inline-flex items-center gap-1.5 text-sm sm:hidden" href={more.href}>
            {more.label} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  )
}

'use client'

import type { Cart, Product, Variant, VariantOption } from '@/payload-types'

import { Price } from '@/components/Price'
import { cn } from '@/utilities/cn'
import { mediaSrc } from '@/utilities/mediaSrc'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ArrowRight, Loader2, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Sheet, SheetClose } from './Sheet'
import { useCartCount } from './useCartCount'
import { useUI } from './ui-context'

type Item = NonNullable<Cart['items']>[number]

/** Image for a line: the gallery image tagged with the variant's option, else the first one. */
const lineImage = (product: Product, variant?: Variant | null) => {
  const gallery = product.gallery || []
  if (variant?.options?.length) {
    const ids = variant.options.map((o: number | VariantOption) => (typeof o === 'object' ? o.id : o))
    const match = gallery.find((g) => {
      const id = typeof g.variantOption === 'object' ? g.variantOption?.id : g.variantOption
      return id != null && ids.includes(id)
    })
    if (match) return mediaSrc(match.image, product.title)
  }
  return mediaSrc(gallery[0]?.image, product.title)
}

/**
 * Side floating cart: detached rounded panel sliding in from the right over a
 * blurred overlay (UX after nemaya's cart-drawer), wired to the ecommerce
 * plugin's cart hooks (increment / decrement / remove, subtotal).
 */
export function CartDrawer() {
  const ui = useUI()
  const { cart, decrementItem, incrementItem, removeItem, isLoading } = useCart()
  const count = useCartCount()
  const items = ((cart?.items || []) as Item[]).filter(
    (i) => i && typeof i.product === 'object' && i.product !== null,
  )

  return (
    <Sheet
      anchor="right"
      className="inset-y-2 right-2 w-[min(460px,calc(100%-1rem))] rounded-[28px]"
      label="Shopping cart"
      onClose={ui.close}
      open={ui.panel === 'cart'}
    >
      <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-5">
        <h2 className="font-display text-[26px] tracking-[-0.03em]">
          Cart{' '}
          <span className="text-ink-muted tabular-nums" aria-label={`${count} items`}>
            {count}
          </span>
        </h2>
        <SheetClose label="Close cart" onClick={ui.close} />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center">
          <span className="sol-reveal grid h-16 w-16 place-items-center rounded-full bg-stone" style={{ ['--d' as string]: '0.2s' }}>
            <ShoppingBag aria-hidden className="h-6 w-6" strokeWidth={1.4} />
          </span>
          <p className="sol-reveal mt-5 font-display text-2xl tracking-[-0.02em]" style={{ ['--d' as string]: '0.26s' }}>
            Your cart is empty
          </p>
          <p className="sol-reveal mt-1 text-sm text-ink-soft" style={{ ['--d' as string]: '0.3s' }}>
            Nothing here yet — let&apos;s fix that.
          </p>
          <Link className="sol-btn sol-btn-primary sol-reveal mt-7" href="/shop" onClick={ui.close} style={{ ['--d' as string]: '0.34s' }}>
            Browse the shop
          </Link>
        </div>
      ) : (
        <>
          <ul aria-busy={isLoading} className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 transition-opacity', isLoading && 'opacity-70')}>
            {items.map((item, idx) => {
              const product = item.product as Product
              const variant = typeof item.variant === 'object' ? item.variant : null
              const image = lineImage(product, variant)
              const unit = (variant ? variant.priceInUSD : product.priceInUSD) ?? null
              const stock = variant ? variant.inventory : product.inventory
              const atMax = typeof stock === 'number' && item.quantity >= stock
              const options = variant?.options
                ?.map((o: number | VariantOption) => (typeof o === 'object' ? o.label : null))
                .filter(Boolean)
                .join(' · ')
              return (
                <li
                  className="sol-reveal flex gap-4 border-b border-line/70 py-5 last:border-0"
                  key={item.id || idx}
                  style={{ ['--d' as string]: `${0.2 + idx * 0.05}s` }}
                >
                  <Link
                    className="relative aspect-[4/5] w-[84px] shrink-0 overflow-hidden rounded-[16px] bg-stone"
                    href={`/products/${product.slug}`}
                    onClick={ui.close}
                  >
                    {image && <Image alt={image.alt} className="object-cover" fill sizes="84px" src={image.src} />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-medium">{product.title}</p>
                        {options && <p className="mt-0.5 text-[13px] text-ink-soft">{options}</p>}
                      </div>
                      {typeof unit === 'number' && (
                        <Price amount={unit * item.quantity} as="p" className="text-[15px] tabular-nums" />
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-full ring-1 ring-line">
                        <button
                          aria-label={`Decrease quantity of ${product.title}`}
                          className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-stone disabled:opacity-40"
                          disabled={isLoading || !item.id}
                          onClick={() => item.id && decrementItem(item.id)}
                          type="button"
                        >
                          <Minus aria-hidden className="h-3.5 w-3.5" />
                        </button>
                        <span aria-live="polite" className="w-7 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          aria-label={`Increase quantity of ${product.title}`}
                          className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-stone disabled:opacity-40"
                          disabled={isLoading || atMax || !item.id}
                          onClick={() => item.id && incrementItem(item.id)}
                          type="button"
                        >
                          <Plus aria-hidden className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        aria-label={`Remove ${product.title} from cart`}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[13px] text-ink-soft transition-colors hover:text-ink disabled:opacity-40"
                        disabled={isLoading || !item.id}
                        onClick={() => item.id && removeItem(item.id)}
                        type="button"
                      >
                        {isLoading ? <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" /> : <X aria-hidden className="h-3.5 w-3.5" />}
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="border-t border-line bg-cream/60 px-6 pb-6 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              {typeof cart?.subtotal === 'number' && (
                <Price amount={cart.subtotal} as="span" className="font-display text-2xl tracking-[-0.02em] tabular-nums" />
              )}
            </div>
            <p className="mt-1 text-xs text-ink-muted">Shipping and taxes are calculated at checkout.</p>
            <Link className="sol-btn sol-btn-primary mt-5 w-full" href="/checkout" onClick={ui.close}>
              Checkout <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </Sheet>
  )
}

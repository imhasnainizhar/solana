'use client'

import type { Product, Variant, VariantOption, VariantType } from '@/payload-types'

import { Price } from '@/components/Price'
import { useUI } from '@/components/site/ui-context'
import { cn } from '@/utilities/cn'
import { mediaSrc, type ImageData } from '@/utilities/mediaSrc'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { Check, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  product: Product
  eyebrow: string
  heading: string
  description: string
  highlights: string[]
  imageRight: boolean
  buttonLabel: string
  dark: boolean
}

const optionId = (o: number | VariantOption) => (typeof o === 'object' ? o.id : o)

export function Purchase({ product, eyebrow, heading, description, highlights, imageRight, buttonLabel, dark }: Props) {
  const ui = useUI()
  const { addItem, isLoading } = useCart()

  const types = useMemo(
    () =>
      product.enableVariants
        ? (product.variantTypes || []).filter((t): t is VariantType => typeof t === 'object')
        : [],
    [product],
  )
  const variants = useMemo(
    () => (product.variants?.docs || []).filter((v): v is Variant => typeof v === 'object'),
    [product],
  )
  const optionsOf = (t: VariantType) =>
    (t.options?.docs || []).filter((o): o is VariantOption => typeof o === 'object')

  // default selection: the first in-stock variant, in the admin's option order
  const [selected, setSelected] = useState<Record<number, number>>(() => {
    const rank = (v: Variant) =>
      types.reduce((acc, t) => {
        const ids = optionsOf(t).map((o) => o.id)
        const hit = v.options.map(optionId).find((id) => ids.includes(id))
        return acc * 100 + (hit != null ? ids.indexOf(hit) : 99)
      }, 0)
    const ordered = [...variants].sort((a, b) => rank(a) - rank(b))
    const first = ordered.find((v) => (v.inventory ?? 0) > 0) || ordered[0]
    const sel: Record<number, number> = {}
    if (!first) return sel
    for (const t of types) {
      const match = optionsOf(t).find((o) => first.options.map(optionId).includes(o.id))
      if (match) sel[t.id] = match.id
    }
    return sel
  })

  const variantFor = (sel: Record<number, number>) =>
    variants.find((v) => {
      const ids = v.options.map(optionId)
      return types.every((t) => sel[t.id] != null && ids.includes(sel[t.id]))
    })

  const variant = product.enableVariants ? variantFor(selected) : undefined
  const stock = product.enableVariants ? (variant?.inventory ?? 0) : (product.inventory ?? 0)
  const price = (variant ? variant.priceInUSD : product.priceInUSD) ?? null
  const [qty, setQty] = useState(1)

  // gallery: images tagged with a selected option first
  const selectedKey = Object.values(selected).join(',')
  const images = useMemo(() => {
    const selectedIds = selectedKey ? selectedKey.split(',').map(Number) : []
    const items = (product.gallery || []).map((g) => ({
      img: mediaSrc(g.image, product.title),
      option: g.variantOption ? optionId(g.variantOption) : null,
    }))
    const tagged = items.filter((i) => i.option != null && selectedIds.includes(i.option))
    const rest = items.filter((i) => !tagged.includes(i))
    return [...tagged, ...rest].map((i) => i.img).filter((i): i is ImageData => Boolean(i))
  }, [product, selectedKey])
  const [active, setActive] = useState(0)
  const current = images[Math.min(active, images.length - 1)]

  const canBuy = (!product.enableVariants || Boolean(variant)) && stock > 0

  const add = async () => {
    try {
      await addItem({ product: product.id, variant: variant?.id }, qty)
      ui.open('cart')
    } catch {
      toast.error('Could not add to cart. Please try again.')
    }
  }

  const muted = dark ? 'text-on-hero/65' : 'text-ink-soft'

  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16',
        imageRight && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {/* gallery */}
      <div className="lg:sticky lg:top-[calc(var(--sol-nav-h)+2rem)]">
        <div className={cn('relative aspect-[4/5] overflow-hidden rounded-[24px]', dark ? 'bg-white/5' : 'bg-stone')}>
          {current && (
            <Image
              alt={current.alt}
              className="object-cover transition-opacity duration-500"
              fill
              key={current.src}
              priority={false}
              sizes="(max-width: 1024px) 100vw, 55vw"
              src={current.src}
            />
          )}
        </div>
        {images.length > 1 && (
          <div aria-label="Product images" className="sol-rail mt-3 flex gap-2 overflow-x-auto" role="tablist">
            {images.map((img, i) => (
              <button
                aria-label={`Show image ${i + 1}`}
                aria-selected={i === active}
                className={cn(
                  'relative aspect-square w-[72px] shrink-0 overflow-hidden rounded-[14px] ring-offset-2 transition',
                  dark ? 'bg-white/5 ring-offset-hero' : 'bg-stone ring-offset-cream',
                  i === active ? (dark ? 'ring-1 ring-on-hero' : 'ring-1 ring-ink') : 'opacity-70 hover:opacity-100',
                )}
                key={img.src + i}
                onClick={() => setActive(i)}
                role="tab"
                type="button"
              >
                <Image alt="" className="object-cover" fill sizes="72px" src={img.src} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* details */}
      <div className="lg:py-6">
        {eyebrow && <p className={cn('sol-eyebrow mb-4', muted)}>{eyebrow}</p>}
        <h2 className="sol-display text-[clamp(2.5rem,5vw,4rem)]">{heading}</h2>
        {typeof price === 'number' && (
          <Price amount={price} as="p" className="mt-4 text-xl tabular-nums" />
        )}
        {description && <p className={cn('mt-6 max-w-[34rem] text-[17px] leading-[1.55]', muted)}>{description}</p>}

        {types.map((t) => (
          <fieldset className="mt-8" key={t.id}>
            <legend className="mb-3 text-sm">
              {t.label}
              <span className={cn('ml-2', muted)}>
                {optionsOf(t).find((o) => o.id === selected[t.id])?.label}
              </span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {optionsOf(t).map((o) => {
                const next = { ...selected, [t.id]: o.id }
                const v = variantFor(next)
                const available = Boolean(v && (v.inventory ?? 0) > 0)
                const on = selected[t.id] === o.id
                return (
                  <button
                    aria-pressed={on}
                    className={cn(
                      'min-h-11 rounded-full px-5 text-sm transition-colors',
                      on
                        ? dark
                          ? 'bg-on-hero text-ink'
                          : 'bg-ink text-cream'
                        : dark
                          ? 'ring-1 ring-white/20 hover:ring-white/50'
                          : 'ring-1 ring-line hover:ring-ink/40',
                      !available && 'line-through opacity-45',
                    )}
                    key={o.id}
                    onClick={() => {
                      setSelected(next)
                      setActive(0)
                      setQty(1)
                    }}
                    type="button"
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className={cn('inline-flex h-12 items-center rounded-full', dark ? 'ring-1 ring-white/20' : 'ring-1 ring-line')}>
            <button
              aria-label="Decrease quantity"
              className="grid h-12 w-12 place-items-center rounded-full disabled:opacity-40"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              type="button"
            >
              <Minus aria-hidden className="h-4 w-4" />
            </button>
            <span aria-live="polite" className="w-6 text-center tabular-nums">
              {qty}
            </span>
            <button
              aria-label="Increase quantity"
              className="grid h-12 w-12 place-items-center rounded-full disabled:opacity-40"
              disabled={qty >= stock}
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
              type="button"
            >
              <Plus aria-hidden className="h-4 w-4" />
            </button>
          </div>
          <button
            className={cn('sol-btn min-w-[12rem] flex-1', dark ? 'sol-btn-light' : 'sol-btn-primary')}
            disabled={!canBuy || isLoading}
            onClick={add}
            type="button"
          >
            {canBuy ? buttonLabel : 'Sold out'}
          </button>
        </div>
        <p className={cn('mt-3 text-[13px]', muted)}>
          {canBuy ? (stock < 10 ? `Only ${stock} left in this batch.` : 'In stock — ships in 2–4 days.') : 'This option is currently unavailable.'}
        </p>

        {highlights.length > 0 && (
          <ul className={cn('mt-8 space-y-2.5 border-t pt-8 text-[15px]', dark ? 'border-white/10' : 'border-line')}>
            {highlights.map((h) => (
              <li className="flex items-start gap-3" key={h}>
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
                {h}
              </li>
            ))}
          </ul>
        )}
        <Link className={cn('mt-8 inline-block text-sm underline underline-offset-4', muted)} href={`/products/${product.slug}`}>
          Full details
        </Link>
      </div>
    </div>
  )
}

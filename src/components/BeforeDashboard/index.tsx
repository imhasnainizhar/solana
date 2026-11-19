import type { BasePayload, TypedUser } from 'payload'

import React from 'react'

import { brand } from '@/lib/brand'
import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

type Props = { payload: BasePayload; user?: TypedUser | null }

/** Dashboard welcome + quick actions for store owners (server component). */
export async function BeforeDashboard({ payload, user }: Props) {
  const [home, products] = await Promise.all([
    payload.find({
      collection: 'pages',
      depth: 0,
      draft: true,
      limit: 1,
      pagination: false,
      select: { slug: true },
      where: { slug: { equals: 'home' } },
    }),
    payload.count({ collection: 'products' }),
  ])
  const homeId = home.docs[0]?.id
  const firstName = (
    user && 'name' in user && typeof user.name === 'string' ? user.name : ''
  ).split(' ')[0]

  const actions = [
    {
      href: homeId ? `/admin/collections/pages/${homeId}` : '/admin/collections/pages/create',
      title: 'Edit home page',
      text: 'Add, reorder and style sections with live preview.',
    },
    {
      href: '/admin/globals/theme',
      title: 'Theme',
      text: 'Presets, colors, fonts, buttons, spacing and motion.',
    },
    {
      href: '/admin/collections/products',
      title: 'Products',
      text: `${products.totalDocs} product${products.totalDocs === 1 ? '' : 's'} — prices, variants, stock.`,
    },
    {
      href: '/',
      title: 'View store ↗',
      text: 'Open the storefront with the build-mode bar.',
      external: true,
    },
  ]

  return (
    <div className={baseClass}>
      <p className={`${baseClass}__eyebrow`}>{brand.name}</p>
      <h2 className={`${baseClass}__title`}>Welcome back{firstName ? `, ${firstName}` : ''}.</h2>
      <p className={`${baseClass}__lead`}>
        Your store is built from sections. Edit a page and its preview updates as you type; the
        theme controls the look of everything.
      </p>
      <div className={`${baseClass}__actions`}>
        {actions.map((a) => (
          <a
            className={`${baseClass}__action`}
            href={a.href}
            key={a.title}
            {...(a.external ? { rel: 'noopener', target: '_blank' } : {})}
          >
            <strong>{a.title}</strong>
            <span>{a.text}</span>
          </a>
        ))}
      </div>
      {!homeId && (
        <p className={`${baseClass}__seed`}>
          Empty store? <SeedButton /> with the Solana Studio demo content (replaces existing data).
        </p>
      )}
    </div>
  )
}

import type { CollectionSlug, File, Payload, PayloadRequest } from 'payload'

import type { Address, Media, Transaction, VariantOption } from '@/payload-types'

import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'
import { photos, render, type Finish } from './images'
import { richText } from './richText'

/**
 * Seeds a fresh "Solana Studio" store: one flagship product (Aura One, three
 * finishes) plus accessories, the sabi-style home page, header/footer menus,
 * a contact page and demo customer data (order, cart, address).
 *
 * Runs from the admin dashboard ("Seed your database" → POST /next/seed) or
 * from the CLI with `pnpm seed`. Existing store data is cleared first;
 * users (except the demo customer) and newsletter subscribers are kept.
 */

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
]

const baseAddressUSData: Transaction['billingAddress'] = {
  title: 'Ms.',
  firstName: 'Ada',
  lastName: 'Example',
  phone: '1234567890',
  addressLine1: '123 Main St',
  addressLine2: 'Suite 100',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'US',
}

const noRevalidate = { disableRevalidate: true }

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> => {
  payload.logger.info('Seeding database...')
  payload.logger.info('— Clearing collections and globals...')

  await Promise.all([
    payload.updateGlobal({ slug: 'header', data: { navItems: [] }, depth: 0, context: noRevalidate }),
    payload.updateGlobal({ slug: 'footer', data: { columns: [] }, depth: 0, context: noRevalidate }),
  ])

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  await payload.delete({ collection: 'users', depth: 0, where: { email: { equals: 'customer@example.com' } } })

  payload.logger.info('— Generating and downloading media...')

  const upload = (file: File, alt: string) =>
    payload.create({ collection: 'media', data: { alt }, file, context: noRevalidate })

  // Photography (picsum.photos, fixed seeds → stable); falls back to gradients offline.
  const heroSpecs = Array.from({ length: 16 }, (_, i) => ({ seed: `solana-hero-${i + 1}`, w: 640, h: 960 }))
  const slideSpecs = [
    { seed: 'solana-slide-morning', w: 2000, h: 1250 },
    { seed: 'solana-slide-work', w: 2000, h: 1250 },
    { seed: 'solana-slide-evening', w: 2000, h: 1250 },
  ]
  const pressSpecs = [
    { seed: 'solana-press-1', w: 1600, h: 1200 },
    { seed: 'solana-press-2', w: 1600, h: 1200 },
  ]
  const lifestyleSpecs = [{ seed: 'solana-lifestyle-1', w: 2000, h: 1300 }]
  const [heroFiles, slideFiles, pressFiles, lifestyleFiles] = await Promise.all([
    photos(heroSpecs),
    photos(slideSpecs),
    photos(pressSpecs),
    photos(lifestyleSpecs),
  ])

  const heroTiles: Media[] = []
  for (const [i, f] of heroFiles.entries()) heroTiles.push(await upload(f, `Collage photo ${i + 1}`))
  const slides: Media[] = []
  for (const [i, f] of slideFiles.entries())
    slides.push(await upload(f, ['Morning light', 'A quiet desk', 'Evening calm'][i]))
  const pressImages: Media[] = []
  for (const f of pressFiles) pressImages.push(await upload(f, 'Press photo'))
  const lifestyle = await upload(lifestyleFiles[0], 'Aura One in use')

  // Generated product renders.
  const finishesList: Finish[] = ['sand', 'graphite', 'moss']
  const auraFront: Record<string, Media> = {}
  const auraSide: Record<string, Media> = {}
  for (const finish of finishesList) {
    auraFront[finish] = await upload(await render('pebble', finish, `aura-one-${finish}`), `Aura One in ${finish}`)
    auraSide[finish] = await upload(
      await render('pebble-side', finish, `aura-one-${finish}-side`),
      `Aura One in ${finish}, side view`,
    )
  }
  const detail = await upload(await render('detail', 'graphite', 'aura-sensor', 800, 600), 'Breath sensor array')
  const dockImgs = [
    await upload(await render('dock', 'sand', 'aura-dock'), 'Aura Dock'),
    await upload(await render('dock', 'graphite', 'aura-dock-2'), 'Aura Dock, graphite'),
  ]
  const caseImgs = [
    await upload(await render('case', 'moss', 'aura-case'), 'Aura Travel Case'),
    await upload(await render('case', 'sand', 'aura-case-2'), 'Aura Travel Case, sand'),
  ]
  const bandImgs = [
    await upload(await render('band', 'graphite', 'aura-band'), 'Aura Band'),
    await upload(await render('band', 'moss', 'aura-band-2'), 'Aura Band, moss'),
  ]
  const productIntroImage = await upload(
    await render('pebble', 'graphite', 'aura-one-hero', 2000, 1300),
    'Aura One resting on a stone surface',
  )

  payload.logger.info('— Seeding categories, variant types and products...')

  const [devices, accessories] = await Promise.all(
    ['Devices', 'Accessories'].map((title) =>
      payload.create({ collection: 'categories', data: { title, slug: title.toLowerCase() } }),
    ),
  )

  const finishType = await payload.create({
    collection: 'variantTypes',
    data: { name: 'finish', label: 'Finish' },
  })
  const finishOptions: Record<string, VariantOption> = {}
  for (const finish of finishesList) {
    finishOptions[finish] = await payload.create({
      collection: 'variantOptions',
      data: { label: finish[0].toUpperCase() + finish.slice(1), value: finish, variantType: finishType.id },
    })
  }

  const aura = await payload.create({
    collection: 'products',
    depth: 0,
    context: noRevalidate,
    data: {
      title: 'Aura One',
      slug: 'aura-one',
      _status: 'published',
      enableVariants: true,
      variantTypes: [finishType.id],
      inventory: 0,
      priceInUSDEnabled: true,
      priceInUSD: 24900,
      categories: [devices.id],
      description: richText([
        'Aura One is a palm-sized companion that reads your breath and gently guides you back to focus.',
        'A breath sensor array listens to your rhythm; on-device models learn your baseline; soft haptics pace you back to calm. No screen, no app required, nothing leaves the device.',
      ]),
      gallery: finishesList.flatMap((finish) => [
        { image: auraFront[finish].id, variantOption: finishOptions[finish].id },
        { image: auraSide[finish].id, variantOption: finishOptions[finish].id },
      ]),
      layout: [
        { blockType: 'mediaBlock', media: lifestyle.id },
        {
          blockType: 'content',
          columns: [
            {
              size: 'half',
              richText: richText(['## Made to be held', 'Machined aluminium shell with a fabric-soft underside.']),
            },
            {
              size: 'half',
              richText: richText(['## Two weeks per charge', 'USB-C or the Aura Dock. Fully charged in 40 minutes.']),
            },
          ],
        },
      ],
      meta: {
        title: 'Aura One — Solana Studio',
        description: 'A palm-sized companion that reads your breath and gently guides you back to focus.',
        image: auraFront.graphite.id,
      },
    },
  })

  const stock: Record<Finish, number> = { sand: 80, graphite: 120, moss: 6 }
  const variants: Record<string, { id: number }> = {}
  for (const finish of finishesList) {
    variants[finish] = await payload.create({
      collection: 'variants',
      depth: 0,
      data: {
        product: aura.id,
        options: [finishOptions[finish].id],
        inventory: stock[finish],
        priceInUSDEnabled: true,
        priceInUSD: 24900,
        _status: 'published',
      },
    })
  }

  const accessory = async (title: string, slug: string, price: number, images: Media[], blurb: string) =>
    payload.create({
      collection: 'products',
      depth: 0,
      context: noRevalidate,
      data: {
        title,
        slug,
        _status: 'published',
        enableVariants: false,
        inventory: 200,
        priceInUSDEnabled: true,
        priceInUSD: price,
        categories: [accessories.id],
        description: richText([blurb]),
        gallery: images.map((image) => ({ image: image.id })),
        layout: [],
        relatedProducts: [aura.id],
        meta: { title: `${title} — Solana Studio`, description: blurb, image: images[0].id },
      },
    })

  const dock = await accessory('Aura Dock', 'aura-dock', 4900, dockImgs, 'A weighted wireless charging dock.')
  await accessory('Aura Travel Case', 'aura-travel-case', 3900, caseImgs, 'A felt-lined case for days away.')
  await accessory('Aura Band', 'aura-band', 2900, bandImgs, 'A soft silicone band to wear Aura on your wrist.')

  payload.logger.info('— Seeding pages...')

  const contactForm = await payload.create({ collection: 'forms', depth: 0, data: contactFormData() })

  await payload.create({
    collection: 'pages',
    depth: 0,
    context: noRevalidate,
    data: homePageData({
      heroTiles,
      productImage: productIntroImage,
      calloutImage: detail,
      slides,
      pressImages,
      aura,
      accessories,
      metaImage: auraFront.graphite,
    }),
  })
  await payload.create({
    collection: 'pages',
    depth: 0,
    context: noRevalidate,
    data: contactPageData({ contactForm }),
  })

  payload.logger.info('— Seeding demo customer data...')

  const customer = await payload.create({
    collection: 'users',
    data: { name: 'Customer', email: 'customer@example.com', password: 'password', roles: ['customer'] },
  })
  await payload.create({
    collection: 'addresses',
    depth: 0,
    data: { customer: customer.id, ...(baseAddressUSData as Address) },
  })
  const transaction = await payload.create({
    collection: 'transactions',
    data: {
      currency: 'USD',
      customer: customer.id,
      paymentMethod: 'stripe',
      stripe: { customerID: 'cus_123', paymentIntentID: 'pi_123' },
      status: 'succeeded',
      billingAddress: baseAddressUSData,
    },
  })
  await payload.create({
    collection: 'carts',
    data: {
      customer: customer.id,
      currency: 'USD',
      items: [{ product: dock.id, quantity: 1 }],
    },
  })
  await payload.create({
    collection: 'orders',
    data: {
      amount: 29800,
      currency: 'USD',
      customer: customer.id,
      shippingAddress: baseAddressUSData,
      items: [
        { product: aura.id, variant: variants.graphite.id, quantity: 1 },
        { product: dock.id, quantity: 1 },
      ],
      status: 'completed',
      transactions: [transaction.id],
    },
  })

  payload.logger.info('— Seeding globals...')

  const custom = (label: string, url: string, newTab = false) => ({
    type: 'custom' as const,
    label,
    url,
    newTab,
  })

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            kind: 'mega',
            link: custom('Shop', '/shop'),
            groups: [
              {
                title: 'Aura',
                links: [
                  { link: custom('Aura One', '/products/aura-one'), description: 'The flagship, in three finishes' },
                  { link: custom('Compare finishes', '/products/aura-one'), description: 'Sand, Graphite, Moss' },
                ],
              },
              {
                title: 'Accessories',
                links: [
                  { link: custom('Aura Dock', '/products/aura-dock'), description: 'Wireless charging' },
                  { link: custom('Travel Case', '/products/aura-travel-case'), description: 'Felt-lined, pocketable' },
                  { link: custom('Aura Band', '/products/aura-band'), description: 'Wear it on your wrist' },
                ],
              },
              {
                title: 'Help',
                links: [{ link: custom('Find my order', '/find-order') }, { link: custom('Contact', '/contact') }],
              },
            ],
            featured: [
              {
                image: auraFront.moss.id,
                eyebrow: 'New finish',
                title: 'Aura One — Moss',
                caption: 'Limited first batch',
                link: { type: 'custom', url: '/products/aura-one' },
              },
            ],
          },
          { kind: 'link', link: custom('Science', '/#science') },
          { kind: 'link', link: custom('Press', '/#press') },
          { kind: 'link', link: custom('Contact', '/contact') },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        tagline: 'Join the waitlist to be the first to try the next batch of Aura One.',
        legal: 'Solana Studio Inc.',
        showWordmark: true,
        columns: [
          {
            title: 'Company',
            links: [{ link: custom('Press', '/#press') }, { link: custom('Contact Us', '/contact') }],
          },
          {
            title: 'Shop',
            links: [{ link: custom('Aura One', '/products/aura-one') }, { link: custom('Accessories', '/shop') }],
          },
          {
            title: 'Follow',
            links: [
              { link: custom('Instagram', 'https://instagram.com', true) },
              { link: custom('X', 'https://x.com', true) },
            ],
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

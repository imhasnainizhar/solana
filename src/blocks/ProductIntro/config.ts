import type { Block } from 'payload'

import { anchorField, backgroundField } from '@/blocks/shared/fields'
import { link } from '@/fields/link'

/** Sabi "Sabi Cap" section: oversized faint name, big product image with a spec callout, glass text card. */
export const ProductIntro: Block = {
  slug: 'productIntro',
  interfaceName: 'ProductIntroBlock',
  labels: { singular: 'Product intro', plural: 'Product intros' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, defaultValue: 'Aura One', admin: { width: '50%' } },
        {
          name: 'watermark',
          type: 'text',
          admin: { width: '50%', description: 'Huge faint background word. Defaults to the name.' },
        },
      ],
    },
    {
      name: 'promise',
      type: 'textarea',
      required: true,
      defaultValue: 'A calm, considered object that helps you think clearly — anywhere.',
    },
    { name: 'secondary', type: 'textarea', admin: { description: 'Muted second paragraph.' } },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Small uppercase line in the image corner, e.g. "The last paradigm of computing".' },
    },
    {
      name: 'callouts',
      type: 'array',
      maxRows: 3,
      admin: { description: 'Small spec cards over the image, e.g. "Custom sensors (1mm footprint)".' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'detail', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Show a button',
    },
    link({
      appearances: ['default', 'outline'],
      overrides: { admin: { condition: (_: unknown, s: { enableLink?: boolean }) => Boolean(s?.enableLink) } },
    }),
    backgroundField('cream'),
    anchorField,
  ],
}

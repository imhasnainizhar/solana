import type { Block } from 'payload'

import { anchorField, backgroundField } from '@/blocks/shared/fields'

/** One product, ready to buy: gallery, price, variant picker and add-to-cart. */
export const FeaturedProduct: Block = {
  slug: 'featuredProduct',
  interfaceName: 'FeaturedProductBlock',
  labels: { singular: 'Featured product', plural: 'Featured products' },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      maxDepth: 0,
    },
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Now shipping', admin: { width: '50%' } },
        {
          name: 'heading',
          type: 'text',
          admin: { width: '50%', description: 'Defaults to the product title.' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Short pitch; defaults to the product meta description.' },
    },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Short bullet points under the price.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'left',
          admin: { width: '50%' },
          options: [
            { label: 'Gallery left', value: 'left' },
            { label: 'Gallery right', value: 'right' },
          ],
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Add to cart',
          admin: { width: '50%' },
        },
      ],
    },
    backgroundField('cream'),
    anchorField,
  ],
}

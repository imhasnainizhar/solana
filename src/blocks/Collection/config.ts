import type { Block } from 'payload'

import { anchorField, backgroundField } from '@/blocks/shared/fields'
import { link } from '@/fields/link'

/** Grid or carousel of minimal product cards from a category, a manual pick, or the latest products. */
export const Collection: Block = {
  slug: 'collection',
  interfaceName: 'CollectionBlock',
  labels: { singular: 'Collection', plural: 'Collections' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Complete the set', admin: { width: '50%' } },
        { name: 'intro', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'latest',
      admin: { layout: 'horizontal' },
      options: [
        { label: 'Latest products', value: 'latest' },
        { label: 'Category', value: 'category' },
        { label: 'Hand-picked', value: 'manual' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { condition: (_, s) => s?.source === 'category' },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxDepth: 0,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'display',
          type: 'select',
          defaultValue: 'grid',
          admin: { width: '33%' },
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'Carousel', value: 'carousel' },
          ],
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          admin: { width: '33%' },
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 6,
          min: 1,
          max: 24,
          admin: { width: '33%', condition: (_, s) => s?.source !== 'manual' },
        },
      ],
    },
    { name: 'enableLink', type: 'checkbox', label: 'Show a "view all" link' },
    link({
      appearances: false,
      overrides: { admin: { condition: (_: unknown, s: { enableLink?: boolean }) => Boolean(s?.enableLink) } },
    }),
    backgroundField('cream'),
    anchorField,
  ],
}

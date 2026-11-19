import type { Block } from 'payload'

import { anchorField, backgroundField } from '@/blocks/shared/fields'

/** "In the Press": large image quote cards or a row of quotes, each with publication + date. */
export const Press: Block = {
  slug: 'press',
  interfaceName: 'PressBlock',
  labels: { singular: 'Press', plural: 'Press' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'In the Press' },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Image cards (swipeable)', value: 'cards' },
        { label: 'Quote row', value: 'quotes' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'publication', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'date', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
          ],
        },
        { name: 'quote', label: 'Headline / quote', type: 'textarea', required: true },
        { name: 'url', type: 'text', admin: { description: 'Link to the article (opens in a new tab).' } },
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { width: '50%', description: 'Optional publication logo (quote row).' },
            },
          ],
        },
      ],
    },
    backgroundField('cream'),
    anchorField,
  ],
}

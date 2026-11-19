import type { Block } from 'payload'

import { anchorField, backgroundField } from '@/blocks/shared/fields'

/** Numbered 01 / 02 / 03 rows next to a sticky heading (sabi "The Science Behind…"). */
export const Steps: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Steps', plural: 'Steps' },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      defaultValue: 'The Science\nBehind Calm\nFocus',
      admin: { description: 'Each line break becomes its own line.' },
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      required: true,
      fields: [
        { name: 'title', type: 'text', admin: { description: 'Optional bold lead-in.' } },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'numberStyle',
      type: 'select',
      defaultValue: 'padded',
      options: [
        { label: '01 · 02 · 03', value: 'padded' },
        { label: '1 · 2 · 3', value: 'plain' },
      ],
    },
    backgroundField('sand'),
    anchorField,
  ],
}

import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

/**
 * Sabi-style hero: a dark collage of tall rounded image columns that drift
 * vertically (scroll parallax + slow idle drift), dimmed, with a huge headline.
 */
export const SabiHero: Block = {
  slug: 'sabiHero',
  interfaceName: 'SabiHeroBlock',
  labels: { singular: 'Hero — collage', plural: 'Heroes — collage' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
        {
          name: 'headline',
          type: 'text',
          required: true,
          defaultValue: 'Just Breathe.',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: { description: 'Optional line under the headline.' },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: { maxRows: 2, admin: { initCollapsed: true } },
    }),
    {
      name: 'tiles',
      type: 'array',
      minRows: 3,
      required: true,
      labels: { singular: 'Tile', plural: 'Tiles' },
      admin: {
        description:
          'Portrait images for the collage. They are distributed across the columns in order; 12–18 works best.',
        initCollapsed: true,
      },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      type: 'collapsible',
      label: 'Layout & motion',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'columnsDesktop',
              type: 'number',
              defaultValue: 6,
              min: 3,
              max: 8,
              admin: { width: '33%' },
            },
            {
              name: 'columnsMobile',
              type: 'number',
              defaultValue: 3,
              min: 2,
              max: 4,
              admin: { width: '33%' },
            },
            {
              name: 'height',
              type: 'select',
              defaultValue: 'tall',
              admin: { width: '33%' },
              options: [
                { label: 'One screen', value: 'screen' },
                { label: 'Tall (scroll through the collage)', value: 'tall' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'overlay',
              type: 'number',
              defaultValue: 55,
              min: 0,
              max: 90,
              admin: { width: '33%', description: 'Dimming over the images, in %.' },
            },
            {
              name: 'parallax',
              type: 'number',
              defaultValue: 35,
              min: 0,
              max: 100,
              admin: { width: '33%', description: 'Scroll parallax strength (0 = off).' },
            },
            {
              name: 'drift',
              type: 'checkbox',
              defaultValue: true,
              label: 'Slow idle drift',
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
  ],
}

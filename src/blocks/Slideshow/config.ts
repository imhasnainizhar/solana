import type { Block } from 'payload'

import { anchorField } from '@/blocks/shared/fields'
import { linkGroup } from '@/fields/linkGroup'

const positions = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'middle-center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

/**
 * Slideshow — a React port of the Elewind theme's `sections/slideshow.liquid`
 * (see Component.client.tsx for which behaviours were ported).
 */
export const Slideshow: Block = {
  slug: 'slideshow',
  interfaceName: 'SlideshowBlock',
  labels: { singular: 'Slideshow', plural: 'Slideshows' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      required: true,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { width: '50%' } },
            {
              name: 'imageMobile',
              type: 'upload',
              relationTo: 'media',
              admin: { width: '50%', description: 'Optional portrait crop for phones.' },
            },
          ],
        },
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
        {
          name: 'label',
          type: 'text',
          admin: { description: 'Short label for bar / thumbnail pagination (defaults to the heading).' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'scheme',
              label: 'Color scheme',
              type: 'select',
              defaultValue: 'light',
              admin: { width: '25%' },
              options: [
                { label: 'Light text', value: 'light' },
                { label: 'Dark text', value: 'dark' },
                { label: 'Cream panel', value: 'cream' },
                { label: 'Ink panel', value: 'ink' },
              ],
            },
            {
              name: 'position',
              label: 'Text position',
              type: 'select',
              defaultValue: 'bottom-left',
              admin: { width: '25%' },
              options: positions.map((p) => ({ label: p.replace('-', ' '), value: p })),
            },
            {
              name: 'positionMobile',
              label: 'Mobile position',
              type: 'select',
              defaultValue: 'bottom',
              admin: { width: '25%' },
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Middle', value: 'middle' },
                { label: 'Bottom', value: 'bottom' },
              ],
            },
            {
              name: 'alignment',
              label: 'Text alignment',
              type: 'select',
              defaultValue: 'left',
              admin: { width: '25%' },
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        {
          name: 'overlay',
          type: 'number',
          defaultValue: 25,
          min: 0,
          max: 80,
          admin: { description: 'Image dimming in % (helps light text).' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Playback & transition',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'transition',
              type: 'select',
              defaultValue: 'fade',
              admin: { width: '25%' },
              options: [
                { label: 'Fade', value: 'fade' },
                { label: 'Slide', value: 'slide' },
                { label: 'Rise', value: 'rise' },
                { label: 'Wipe', value: 'wipe' },
              ],
            },
            { name: 'autoplay', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            {
              name: 'interval',
              label: 'Change slides every (s)',
              type: 'number',
              defaultValue: 5,
              min: 2,
              max: 10,
              admin: { width: '25%' },
            },
            {
              name: 'pauseOnHover',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '25%' },
            },
          ],
        },
        { name: 'swipe', label: 'Swipe / drag to change slides', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Controls',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'controls',
              type: 'select',
              defaultValue: 'default',
              admin: { width: '25%' },
              options: [
                { label: 'Arrows + counter', value: 'default' },
                { label: 'Progress text', value: 'progress-text' },
                { label: 'Arrows + play', value: 'arrows-play' },
                { label: 'Dots', value: 'dots' },
                { label: 'Bars with labels', value: 'bars' },
              ],
            },
            {
              name: 'progressStyle',
              type: 'select',
              defaultValue: 'timer',
              admin: { width: '25%' },
              options: [
                { label: 'Slide position', value: 'position' },
                { label: 'Autoplay timer', value: 'timer' },
              ],
            },
            {
              name: 'counterStyle',
              type: 'select',
              defaultValue: 'divider',
              admin: { width: '25%' },
              options: [
                { label: '1 / 3', value: 'slash' },
                { label: '01 | 03', value: 'divider' },
              ],
            },
            {
              name: 'arrowStyle',
              type: 'select',
              defaultValue: 'chevron',
              admin: { width: '25%' },
              options: [
                { label: 'Chevron', value: 'chevron' },
                { label: 'Long arrow', value: 'long' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Size',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'container',
              type: 'select',
              defaultValue: 'inset',
              admin: { width: '33%' },
              options: [
                { label: 'Full bleed', value: 'full' },
                { label: 'Inset (rounded)', value: 'inset' },
              ],
            },
            {
              name: 'heightDesktop',
              label: 'Desktop height (vh)',
              type: 'number',
              defaultValue: 88,
              min: 50,
              max: 100,
              admin: { width: '33%' },
            },
            {
              name: 'heightMobile',
              label: 'Mobile height (vh)',
              type: 'number',
              defaultValue: 80,
              min: 60,
              max: 100,
              admin: { width: '33%' },
            },
          ],
        },
        { name: 'radius', label: 'Corner radius (px)', type: 'number', defaultValue: 24, min: 0, max: 40 },
      ],
    },
    anchorField,
  ],
}

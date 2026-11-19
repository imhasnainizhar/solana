import type { Field, GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import { DEFAULT_FONT_PAIRING, fontPairingOptions } from '@/theme/fontPairings'
import { isHexColor } from '@/theme/css'
import { DEFAULT_PRESET, presetOptions } from '@/theme/presets'
import { generateGlobalPreviewPath } from '@/utilities/generatePreviewPath'

const color = (name: string, label: string, description: string): Field => ({
  name,
  type: 'text',
  label,
  admin: {
    description,
    components: { Field: '@/components/admin/ColorField#ColorField' },
  },
  validate: (value: unknown) =>
    !value || isHexColor(value) || 'Use a hex colour like #faf7f1 (or leave empty for the preset).',
})

/**
 * Store-wide style settings. Rendered as CSS custom properties on :root by the
 * storefront layout (src/theme/css.ts) and previewed live while editing.
 */
export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Theme',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Settings',
    description: 'Colors, typography and style of the whole storefront. Changes preview live →',
    livePreview: {
      url: () => generateGlobalPreviewPath('/'),
    },
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Colors',
          fields: [
            {
              name: 'preset',
              type: 'select',
              label: 'Preset',
              defaultValue: DEFAULT_PRESET,
              required: true,
              options: presetOptions,
              admin: { components: { Field: '@/components/admin/PresetField#PresetField' } },
            },
            {
              name: 'colors',
              type: 'group',
              label: 'Color overrides',
              admin: {
                description:
                  'Optional. Override individual palette colors of the preset; leave empty to use the preset.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    color('background', 'Background', 'Page background.'),
                    color('surface', 'Surface', 'Cards, chips, image placeholders.'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    color('ink', 'Ink', 'Primary text and solid buttons.'),
                    color('muted', 'Muted', 'Secondary text.'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    color('accent', 'Accent', 'Accent sections, numbers, focus rings.'),
                    color('border', 'Border', 'Hairlines and inputs.'),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            {
              name: 'fontPairing',
              type: 'radio',
              label: 'Font pairing',
              defaultValue: DEFAULT_FONT_PAIRING,
              options: fontPairingOptions,
              admin: { layout: 'vertical' },
            },
          ],
        },
        {
          label: 'Style',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'radius',
                  type: 'select',
                  label: 'Corner radius',
                  defaultValue: 'lg',
                  options: [
                    { label: 'Square', value: 'none' },
                    { label: 'Small', value: 'sm' },
                    { label: 'Medium', value: 'md' },
                    { label: 'Large (default)', value: 'lg' },
                    { label: 'Extra round', value: 'full' },
                  ],
                },
                {
                  name: 'density',
                  type: 'select',
                  label: 'Spacing',
                  defaultValue: 'comfortable',
                  options: [
                    { label: 'Compact', value: 'compact' },
                    { label: 'Comfortable', value: 'comfortable' },
                    { label: 'Spacious', value: 'spacious' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'buttonShape',
                  type: 'select',
                  label: 'Button shape',
                  defaultValue: 'pill',
                  options: [
                    { label: 'Pill', value: 'pill' },
                    { label: 'Rounded', value: 'rounded' },
                    { label: 'Square', value: 'square' },
                  ],
                },
                {
                  name: 'buttonStyle',
                  type: 'select',
                  label: 'Button style',
                  defaultValue: 'solid',
                  options: [
                    { label: 'Solid', value: 'solid' },
                    { label: 'Outline', value: 'outline' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroOverlay',
                  type: 'select',
                  label: 'Hero overlay strength',
                  defaultValue: 'default',
                  admin: {
                    description: 'How much hero and slideshow images are dimmed behind text.',
                  },
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Light', value: 'light' },
                    { label: 'Default', value: 'default' },
                    { label: 'Strong', value: 'strong' },
                  ],
                },
                {
                  name: 'motion',
                  type: 'select',
                  label: 'Motion',
                  defaultValue: 'full',
                  admin: {
                    description: 'Visitors who prefer reduced motion always get reduced motion.',
                  },
                  options: [
                    { label: 'Full', value: 'full' },
                    { label: 'Reduced', value: 'reduced' },
                    { label: 'Off', value: 'off' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Theme / site settings — placeholder for the "build mode" theming system.
 * Values will be mapped to CSS variables store-wide in a later phase.
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
  },
  fields: [
    {
      name: 'preset',
      type: 'select',
      defaultValue: 'sabi-cream',
      required: true,
      options: [
        { label: 'Cream', value: 'sabi-cream' },
        { label: 'Midnight', value: 'midnight' },
        { label: 'Stone', value: 'stone' },
        { label: 'Sage', value: 'sage' },
      ],
    },
    {
      name: 'radius',
      type: 'select',
      defaultValue: 'lg',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Full', value: 'full' },
      ],
    },
  ],
}

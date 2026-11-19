import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import { generateGlobalPreviewPath } from '@/utilities/generatePreviewPath'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Settings',
    livePreview: {
      url: () => generateGlobalPreviewPath('/'),
    },
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Designed for focus. Made in small batches.',
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          maxRows: 8,
          fields: [link({ appearances: false })],
        },
      ],
    },
    {
      name: 'legal',
      type: 'text',
      admin: { description: 'Shown after the © year, e.g. "Solana Studio Inc."' },
    },
    {
      name: 'showWordmark',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show the oversized wordmark at the bottom',
    },
  ],
}

import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import { generateGlobalPreviewPath } from '@/utilities/generatePreviewPath'

/**
 * Storefront navigation. Drives the floating navbar, the desktop mega menu and
 * the mobile menu drawer (see src/components/site/*).
 *
 * - kind "link": a plain top-level link.
 * - kind "mega": the link label becomes a mega-menu trigger; the link itself is
 *   the "View all" target. Groups render as columns of links (with optional
 *   one-line descriptions) and featured cards render as image tiles.
 */
export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header & menu',
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
      name: 'navItems',
      label: 'Menu items',
      type: 'array',
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/globals/NavRowLabel#NavRowLabel',
        },
      },
      fields: [
        {
          name: 'kind',
          type: 'radio',
          defaultValue: 'link',
          admin: { layout: 'horizontal' },
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Mega menu', value: 'mega' },
          ],
        },
        link({
          appearances: false,
        }),
        {
          name: 'groups',
          label: 'Link groups',
          type: 'array',
          maxRows: 4,
          admin: {
            condition: (_, siblingData) => siblingData?.kind === 'mega',
            description:
              'Columns of links shown in the mega menu and as a submenu in the mobile drawer.',
            initCollapsed: true,
          },
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'links',
              type: 'array',
              maxRows: 8,
              fields: [
                link({ appearances: false }),
                {
                  name: 'description',
                  type: 'text',
                  admin: { description: 'Optional one-liner under the link.' },
                },
              ],
            },
          ],
        },
        {
          name: 'featured',
          label: 'Featured cards',
          type: 'array',
          maxRows: 2,
          admin: {
            condition: (_, siblingData) => siblingData?.kind === 'mega',
            description:
              'Image cards shown at the right of the mega menu (and in the mobile drawer).',
            initCollapsed: true,
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            {
              type: 'row',
              fields: [
                { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
                { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
            { name: 'caption', type: 'text' },
            link({ appearances: false, disableLabel: true }),
          ],
        },
      ],
    },
  ],
}

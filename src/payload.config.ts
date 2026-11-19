import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Subscribers } from '@/collections/Subscribers'
import { Users } from '@/collections/Users'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Theme } from '@/globals/Theme'
import { brand } from '@/lib/brand'
import { plugins } from './plugins'
import { adminGroupsPlugin } from './plugins/adminGroups'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // Welcome + quick actions ("Edit home page", "Theme", "Products", "View store").
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
      graphics: {
        Icon: '@/components/admin/Graphics#Icon',
        Logo: '@/components/admin/Graphics#Logo',
      },
      // Scrolls to a block when opened from the storefront's "Edit section" link.
      providers: ['@/components/admin/HashScroll#HashScroll'],
    },
    meta: {
      titleSuffix: ` — ${brand.name} admin`,
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    user: Users.slug,
  },
  collections: [Users, Pages, Categories, Media, Subscribers],
  db: postgresAdapter({
    pool: {
      // DATABASE_URI is canonical; POSTGRES_URL / DATABASE_URL are what the
      // Vercel Neon marketplace integration injects automatically.
      connectionString:
        process.env.DATABASE_URI || process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  //email: nodemailerAdapter(),
  endpoints: [],
  globals: [Header, Footer, Theme],
  plugins: [
    ...plugins,
    // Vercel Blob is only enabled when a token is present; otherwise uploads go to /public/media.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    // Last: sidebar groups (Store / Content / Settings) incl. plugin-added collections.
    adminGroupsPlugin,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})

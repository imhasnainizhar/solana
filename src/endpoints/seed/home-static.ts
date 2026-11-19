import type { Page } from '@/payload-types'

/** Shown at "/" until the database is seeded (Admin → "Seed your database", or `pnpm seed`). */
export const homeStaticData = (): Partial<Page> => ({
  slug: 'home',
  title: 'Home',
  _status: 'published',
  hero: { type: 'none' },
  meta: { title: 'Solana Studio', description: 'A premium one-product store template.' },
  layout: [
    {
      blockType: 'steps',
      heading: 'Welcome to\nSolana Studio',
      intro: 'Your store is running — it just has no content yet.',
      steps: [
        { body: 'Open /admin and create the first user (it becomes an admin).' },
        { body: 'Click "Seed your database" on the dashboard, or run `pnpm seed`.' },
        { body: 'Edit the Home page blocks with live preview.' },
      ],
      numberStyle: 'padded',
      background: 'cream',
    },
  ],
})

import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

type Global = keyof Config['globals']

/**
 * Reads a global once per request (React `cache`). Globals are deliberately not
 * kept in Next's persistent data cache: it survives rebuilds, so data written
 * outside a Next request (e.g. `pnpm seed`) would otherwise stay stale. Saving
 * a global revalidates the whole site (see hooks/revalidateGlobal.ts).
 */
const getGlobal = cache(async (slug: Global, depth: number) => {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ slug, depth })
})

/** Kept for template compatibility: returns a loader for the global. */
export const getCachedGlobal =
  <T extends Global>(slug: T, depth = 0) =>
  async (): Promise<Config['globals'][T]> =>
    (await getGlobal(slug, depth)) as Config['globals'][T]

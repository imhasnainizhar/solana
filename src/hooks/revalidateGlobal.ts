import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

/**
 * Busts the `getCachedGlobal` cache tag (`global_<slug>`) when a global is saved.
 * Safe to run outside a Next.js request (e.g. `pnpm seed`), where revalidation
 * is unavailable and simply skipped.
 */
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req: { context, payload } }) => {
  if (context.disableRevalidate) return doc
  try {
    revalidateTag(`global_${global.slug}`, { expire: 0 })
  } catch {
    payload.logger.debug(`Skipped revalidating global_${global.slug} (no Next.js context)`)
  }
  return doc
}

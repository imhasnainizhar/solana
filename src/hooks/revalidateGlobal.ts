import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

/**
 * Header / footer render on every page, so saving a global revalidates the whole site.
 * Safe to run outside a Next.js request (e.g. `pnpm seed`), where revalidation
 * is unavailable and simply skipped.
 */
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req: { context, payload } }) => {
  if (context.disableRevalidate) return doc
  try {
    revalidatePath('/', 'layout')
  } catch {
    payload.logger.debug(`Skipped revalidating after saving ${global.slug} (no Next.js context)`)
  }
  return doc
}

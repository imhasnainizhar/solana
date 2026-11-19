/**
 * `pnpm seed` — seed the database from the CLI (same data as the admin
 * dashboard's "Seed your database" button). Clears store content first.
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)

try {
  await seed({ payload, req })
  process.exit(0)
} catch (err) {
  payload.logger.error({ err, msg: 'Seeding failed' })
  process.exit(1)
}

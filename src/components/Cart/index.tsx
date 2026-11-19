import type { Cart as CartType } from '@/payload-types'

export type CartItem = NonNullable<CartType['items']>[number]

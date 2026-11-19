import { CartDrawer } from '@/components/site/CartDrawer'
import { MenuDrawer } from '@/components/site/MenuDrawer'
import { MobileDock } from '@/components/site/MobileDock'
import { Navbar } from '@/components/site/Navbar'
import { toNavItems } from '@/components/site/nav'
import { SearchSheet } from '@/components/site/SearchSheet'
import { brand } from '@/lib/brand'
import { getCachedGlobal } from '@/utilities/getGlobals'

/** Storefront chrome: floating navbar, mega menu, menu drawer, search, cart drawer, mobile dock. */
export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  const items = toNavItems(header)

  return (
    <>
      <Navbar items={items} wordmark={brand.wordmark} />
      <MenuDrawer items={items} wordmark={brand.wordmark} />
      <SearchSheet items={items} />
      <CartDrawer />
      <MobileDock />
    </>
  )
}

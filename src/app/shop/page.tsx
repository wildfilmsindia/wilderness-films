import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import ShopSelector from '@/components/shop/ShopSelector'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Shop — Olive Wood, Books & Merch',
  description:
    'Two small, curated stores from Wilderness Films India — handcrafted olive wood pieces, and mountain books and merchandise.',
  alternates: { canonical: `${SITE}/shop` },
  openGraph: {
    title: 'Shop — Wilderness Films India',
    description:
      'Two curated stores: handcrafted olive wood pieces, and mountain books and merchandise.',
    url: `${SITE}/shop`,
  },
}

// No <Footer /> here — the two-door selector takes the full viewport and would
// look odd with a footer poking underneath. Individual store views can stand
// alone visually; a footer is added inside StoreView if we want one later.
export default function ShopPage() {
  return (
    <>
      <Navigation />
      <ShopSelector />
    </>
  )
}

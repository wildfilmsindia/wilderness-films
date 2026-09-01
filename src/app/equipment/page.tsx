import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import EquipmentBrowser from '@/components/equipment/EquipmentBrowser'
import { normalize, type RawItem } from '@/components/equipment/data'
import { getEquipment } from '@/lib/equipment'
import { breadcrumbNode, SITE } from '@/lib/seo'

// Server component: the catalogue data is read at build time so the cards are
// in the HTML — crawlable by search engines and AI, not fetched after hydration.
export default async function EquipmentPage() {
  const raw = (await getEquipment()) as unknown as RawItem[]
  const items = normalize(raw).filter(i => !i.sold)

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE}/equipment/#itemlist`,
    name: 'Equipment for Sale & Rental — Wilderness Films India',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/equipment/${it.id}`,
      name: it.name,
    })),
  }

  const breadcrumb = breadcrumbNode([
    { name: 'Home', url: SITE },
    { name: 'Equipment', url: `${SITE}/equipment` },
  ])

  return (
    <>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <EquipmentBrowser items={items} />

      <Footer />
    </>
  )
}

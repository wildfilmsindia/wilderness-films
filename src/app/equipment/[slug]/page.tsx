import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import {
  getEquipment, getItemBySlug, slugify, enquiryHref, SITE,
  type EquipmentItem,
} from '@/lib/equipment'
import { breadcrumbNode } from '@/lib/seo'

export const dynamicParams = false

export async function generateStaticParams() {
  const items = await getEquipment()
  return items.map(i => ({ slug: slugify(i.name) }))
}

const CONDITION_WORD = (c: string) => (c === 'New' ? 'brand new' : 'used')

// Search-friendly description: leads with what it is, then condition, then the
// commercial intent people actually type ("for sale", "hire", "India").
function summary(item: EquipmentItem): string {
  const lead = item.description?.trim()
  const brand = item.brand ? `${item.brand} ` : ''
  const tail = `${brand}${item.name} for sale & rental in India — ${CONDITION_WORD(item.cond)} ${item.cat.toLowerCase()} from Wilderness Films India, New Delhi. Established 1987. Enquire for price and availability.`
  return lead ? `${lead} — ${tail}` : tail
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const item = await getItemBySlug(slug)
  if (!item) return { title: 'Equipment not found' }

  const desc = summary(item).slice(0, 300)
  const url = `${SITE}/equipment/${slug}`
  const img = item.images?.[0]
  // Title carries the buying intent, which is what people search for.
  const title = `${item.name} — For Sale & Rental`

  const keywords = [
    item.name,
    item.brand && `${item.brand} ${item.cat}`,
    item.brand && `${item.brand} for sale india`,
    `${item.cat.toLowerCase()} for sale india`,
    `used ${item.cat.toLowerCase()} india`,
    item.mount && `${item.mount} mount ${item.cat.toLowerCase()}`,
    'cine equipment india',
    'broadcast equipment india',
    'film equipment rental india',
  ].filter(Boolean) as string[]

  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${item.name} — Wilderness Films India`,
      description: desc,
      url,
      type: 'website',
      siteName: 'Wilderness Films India',
      locale: 'en_IN',
      images: img
        ? [{ url: `${SITE}${img}`, width: 1200, height: 800, alt: item.name }]
        : [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Wilderness Films India' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.name,
      description: desc,
      images: [img ? `${SITE}${img}` : `${SITE}/og-image.jpg`],
    },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  }
}

const LABEL = { fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666' } as const

export default async function EquipmentItemPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const item = await getItemBySlug(slug)
  if (!item) notFound()

  const sold = !!item.sold
  const img = item.images?.[0]

  const specRows: [string, string][] = []
  if (item.brand) specRows.push(['Brand', item.brand])
  if (item.model) specRows.push(['Model', item.model])
  if (item.mount) specRows.push(['Mount', item.mount])
  if (sold) specRows.push(['Status', 'Sold'])
  specRows.push(['Category', item.cat])
  if (item.quantity != null) specRows.push(['Quantity available', String(item.quantity)])
  if (item.specs) for (const [k, v] of Object.entries(item.specs)) specRows.push([k, v])

  const itemCondition = item.cond === 'New'
    ? 'https://schema.org/NewCondition'
    : 'https://schema.org/UsedCondition'

  // Product structured data for rich results. These items are enquiry-led
  // (no public price) — only emit an Offer when a real price exists, so Google
  // never shows a misleading "₹0". Images are all on our own origin.
  const allImgs = (item.images ?? []).map(i => `${SITE}${i}`)
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE}/equipment/${slug}/#product`,
    name: item.name,
    description: summary(item),
    category: item.cat,
    itemCondition,
    sku: slug,
    url: `${SITE}/equipment/${slug}`,
    ...(allImgs.length ? { image: allImgs } : {}),
    ...(item.brand ? { brand: { '@type': 'Brand', name: item.brand } } : {}),
    ...(item.model ? { model: item.model } : {}),
    ...(specRows.length
      ? {
          additionalProperty: specRows.map(([name, value]) => ({
            '@type': 'PropertyValue', name, value,
          })),
        }
      : {}),
  }
  if (item.salePrice != null) {
    jsonLd.offers = {
      '@type': 'Offer',
      url: `${SITE}/equipment/${slug}`,
      priceCurrency: 'INR',
      price: item.salePrice,
      availability: sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      itemCondition,
      seller: { '@type': 'Organization', name: 'Wilderness Films India Ltd.' },
    }
  }

  // Internal links: same category (prefer same brand) — gives crawlers paths
  // between deep pages and keeps visitors moving through the catalogue.
  const all = await getEquipment()
  const related = all
    .filter(i => !i.sold && i.cat === item.cat && slugify(i.name) !== slug)
    .sort((a, b) =>
      (b.brand === item.brand ? 1 : 0) - (a.brand === item.brand ? 1 : 0) ||
      ((b.images?.length ? 1 : 0) - (a.images?.length ? 1 : 0)))
    .slice(0, 6)

  const breadcrumb = breadcrumbNode([
    { name: 'Home', url: SITE },
    { name: 'Equipment', url: `${SITE}/equipment` },
    { name: item.name, url: `${SITE}/equipment/${slug}` },
  ])

  return (
    <>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main style={{ background: '#0a0a0a', minHeight: '100svh', fontFamily: "'Montserrat', sans-serif", paddingTop: '80px', color: '#f0ece3' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

          <nav aria-label="Breadcrumb" style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '1.6rem' }}>
            <Link href="/equipment" style={{ color: '#c8a84b', textDecoration: 'none' }}>Equipment</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>{item.cat}</span>
          </nav>

          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'minmax(0,1fr)' }} className="eqp-grid">
            {/* Image */}
            <div style={{ aspectRatio: '3 / 2', background: '#0f0f0f', border: '1px solid #222', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="Wild Films India" style={{ width: 72, opacity: 0.5 }} />
                  <div style={{ ...LABEL, color: '#c8a84b', marginTop: '0.9rem' }}>Image on request</div>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '2rem', lineHeight: 1.12, margin: '0 0 0.8rem' }}>
                {item.name}
              </h1>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                <span style={{ ...LABEL, color: '#888', padding: '0.22rem 0.6rem', border: '1px solid #2c2c2c', borderRadius: 4 }}>{item.cat}</span>
                {sold && (
                  <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.22rem 0.65rem', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: '#555', border: '1px solid #333' }}>
                    Sold
                  </span>
                )}
              </div>

              {item.description && (
                <p style={{ fontSize: '0.82rem', fontWeight: 300, color: '#999', lineHeight: 1.8, marginBottom: '1.4rem' }}>{item.description}</p>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.6rem' }}>
                <tbody>
                  {specRows.map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #1e1e1e' }}>
                      <td style={{ ...LABEL, padding: '0.5rem 0.9rem 0.5rem 0', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{k}</td>
                      <td style={{ padding: '0.5rem 0', fontSize: '0.78rem', color: '#ccc' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {!sold && (
                  <a href={enquiryHref(item.name)} target="_blank" rel="noopener noreferrer"
                     style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8a84b', border: '1px solid #8a6f2e', borderRadius: 5, padding: '0.6rem 1.5rem', textDecoration: 'none' }}>
                    Enquire
                  </a>
                )}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <Link href="/equipment" style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', textDecoration: 'none' }}>
                  ← Back to all equipment
                </Link>
              </div>
            </div>
          </div>

          {/* Related — internal links between deep pages */}
          {related.length > 0 && (
            <section style={{ marginTop: '3.5rem', borderTop: '1px solid #1e1e1e', paddingTop: '2rem' }}>
              <h2 style={{ ...LABEL, color: '#c8a84b', marginBottom: '1.1rem' }}>
                More {item.cat.toLowerCase()} for sale &amp; rental
              </h2>
              <ul style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', listStyle: 'none', padding: 0, margin: 0 }}>
                {related.map(r => (
                  <li key={slugify(r.name)}>
                    <Link
                      href={`/equipment/${slugify(r.name)}`}
                      style={{ display: 'block', fontSize: '0.78rem', color: '#9a9a9a', textDecoration: 'none', lineHeight: 1.5 }}
                    >
                      {r.name}
                      {r.brand ? <span style={{ color: '#555' }}> · {r.brand}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <style>{`@media (min-width: 800px) { .eqp-grid { grid-template-columns: 440px 1fr !important; align-items: start; } }`}</style>
      <Footer />
    </>
  )
}

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

function summary(item: EquipmentItem): string {
  if (item.description) return item.description
  const bits = [item.brand, item.cat, item.cond === 'New' ? 'brand new' : 'used']
    .filter(Boolean).join(', ')
  return `${item.name} — ${bits}. Available for sale & rental from Wilderness Films India.`
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
  return {
    title: item.name,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${item.name} — Wilderness Films India`,
      description: desc,
      url,
      type: 'website',
      images: img ? [{ url: `${SITE}${img}`, alt: item.name }] : undefined,
    },
    twitter: {
      card: img ? 'summary_large_image' : 'summary',
      title: item.name,
      description: desc,
      images: img ? [`${SITE}${img}`] : undefined,
    },
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
  specRows.push(['Condition', sold ? 'Sold' : item.cond])
  specRows.push(['Category', item.cat])
  if (item.quantity != null) specRows.push(['Quantity available', String(item.quantity)])
  if (item.location) specRows.push(['Location', item.location])
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
    name: item.name,
    description: summary(item),
    category: item.cat,
    itemCondition,
    ...(allImgs.length ? { image: allImgs } : {}),
    ...(item.brand ? { brand: { '@type': 'Brand', name: item.brand } } : {}),
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
                <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.22rem 0.65rem', borderRadius: 20, ...(sold ? { background: 'rgba(255,255,255,0.06)', color: '#555', border: '1px solid #333' } : item.cond === 'New' ? { background: 'rgba(78,158,58,0.13)', color: '#4e9e3a' } : { background: 'rgba(200,168,75,0.09)', color: '#c8a84b' }) }}>
                  {sold ? 'Sold' : item.cond}
                </span>
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
        </div>
      </main>

      <style>{`@media (min-width: 800px) { .eqp-grid { grid-template-columns: 440px 1fr !important; align-items: start; } }`}</style>
      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { FAQS, faqPageNode, breadcrumbNode, SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'FAQ — Stock Footage, Production & Equipment',
  description:
    'Answers to common questions about Wilderness Films India: stock footage licensing, production & location services in India, wildlife footage, and cine & broadcast equipment for sale and hire.',
  alternates: { canonical: `${SITE}/faq` },
  openGraph: {
    title: 'FAQ — Wilderness Films India',
    description:
      'Common questions about stock footage licensing, production & location services, and equipment hire across India.',
    url: `${SITE}/faq`,
  },
}

export default function FAQPage() {
  const breadcrumb = breadcrumbNode([
    { name: 'Home', url: SITE },
    { name: 'FAQ', url: `${SITE}/faq` },
  ])

  return (
    <>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageNode()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main style={{ background: '#0a0a0a', minHeight: '100svh', fontFamily: "'Montserrat', sans-serif", paddingTop: '80px', color: '#f0ece3' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

          <nav aria-label="Breadcrumb" style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', marginBottom: '1.8rem' }}>
            <Link href="/" style={{ color: '#c8a84b', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>FAQ</span>
          </nav>

          <div style={{ fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#c8a84b', marginBottom: '0.6rem' }}>
            Wilderness Films India — Est. 1987
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2.2rem, 5vw, 3rem)', lineHeight: 1.05, margin: '0 0 1rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '0.85rem', fontWeight: 300, color: '#999', lineHeight: 1.8, maxWidth: 620, marginBottom: '2.6rem' }}>
            Stock footage licensing, production &amp; location services, and cine &amp; broadcast equipment — the questions
            broadcasters, producers and buyers ask us most often.
          </p>

          <dl style={{ margin: 0 }}>
            {FAQS.map(({ q, a }, i) => (
              <div key={i} style={{ borderTop: '1px solid #1e1e1e', padding: '1.5rem 0' }}>
                <dt style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: '#f0ece3', marginBottom: '0.7rem', lineHeight: 1.25 }}>
                  {q}
                </dt>
                <dd style={{ margin: 0, fontSize: '0.82rem', fontWeight: 300, color: '#9a9a9a', lineHeight: 1.85 }}>
                  {a}
                </dd>
              </div>
            ))}
          </dl>

          <div style={{ borderTop: '1px solid #8a6f2e', marginTop: '2.5rem', paddingTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/offerings" style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8a84b', border: '1px solid #8a6f2e', borderRadius: 5, padding: '0.6rem 1.4rem', textDecoration: 'none' }}>
              Explore our offerings
            </Link>
            <Link href="/equipment" style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', border: '1px solid #2c2c2c', borderRadius: 5, padding: '0.6rem 1.4rem', textDecoration: 'none' }}>
              Browse equipment
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

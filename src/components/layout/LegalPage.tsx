import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

// Shared presentational shell for legal/policy pages (Privacy, Terms, Cookies).
// Server component — fully server-rendered and crawlable.
export default function LegalPage({
  title, updated, children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main style={{ background: '#0a0a0a', minHeight: '100svh', fontFamily: "'Montserrat', sans-serif", paddingTop: '80px', color: '#f0ece3' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', marginBottom: '1.8rem' }}>
            <Link href="/" style={{ color: '#c8a84b', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>{title}</span>
          </nav>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2.1rem, 5vw, 2.9rem)', lineHeight: 1.08, margin: '0 0 0.6rem' }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '2.4rem' }}>
            Last updated: {updated}
          </p>

          <div className="legal-body">{children}</div>

          <style>{`
            .legal-body h2 {
              font-family: 'Cormorant Garamond', serif;
              font-size: 1.4rem; color: #f0ece3; font-weight: 400;
              margin: 2.2rem 0 0.7rem;
            }
            .legal-body p, .legal-body li {
              font-size: 0.82rem; font-weight: 300; color: #9a9a9a; line-height: 1.85;
            }
            .legal-body p { margin: 0 0 0.9rem; }
            .legal-body ul { margin: 0 0 1rem; padding-left: 1.1rem; }
            .legal-body li { margin-bottom: 0.35rem; }
            .legal-body a { color: #c8a84b; text-decoration: none; border-bottom: 1px solid #2c2c2c; }
            .legal-body a:hover { border-color: #8a6f2e; }
            .legal-body strong { color: #ccc; font-weight: 500; }
          `}</style>
        </div>
      </main>
      <Footer />
    </>
  )
}

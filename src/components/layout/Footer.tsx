'use client'

import { LogoCompact } from '@/components/ui/Logo'

const SOCIAL_LINKS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/wildfilmsindia',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/wildfilmsindia',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/WildernessFilmsIndiaLimited',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/wildfilmsindia',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      className="relative py-20 px-6 md:px-12 lg:px-24"
      style={{
        background: '#030303',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Top row */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-12 lg:mb-16">

          {/* Contact & address block — left */}
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.62rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '2rem',
            }}>
              Wilderness Films India Ltd.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1.6rem 3rem' }}>
              {/* Address */}
              <div>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.55rem' }}>
                  Address
                </p>
                <p className="font-body" style={{ fontSize: '0.85rem', color: 'rgba(240,237,232,0.35)', lineHeight: 1.75 }}>
                  1 Factory Road, Ring Road South,<br />
                  New Delhi 110029, India
                </p>
              </div>

              {/* Phone */}
              <div>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.55rem' }}>
                  Phone
                </p>
                <div className="font-body" style={{ fontSize: '0.85rem', lineHeight: 1.75 }}>
                  <a
                    href="tel:+919810019704"
                    style={{ display: 'block', color: 'rgba(240,237,232,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A84C' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.35)' }}
                  >
                    +91 9810019704
                  </a>
                  <a
                    href="tel:+919810149425"
                    style={{ display: 'block', color: 'rgba(240,237,232,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A84C' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.35)' }}
                  >
                    +91 9810149425
                  </a>
                </div>
              </div>

              {/* Email */}
              <div>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.55rem' }}>
                  Email
                </p>
                <a
                  href="mailto:rupindang@gmail.com"
                  className="font-body"
                  style={{ fontSize: '0.85rem', color: 'rgba(240,237,232,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A84C' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.35)' }}
                >
                  rupindang@gmail.com
                </a>
              </div>

              {/* Sites */}
              <div>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.55rem' }}>
                  Sites
                </p>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.46rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem' }}>
                  Conservation Sites &amp; Botanical Arboreta
                </p>
                <div className="font-body" style={{ fontSize: '0.85rem', color: 'rgba(240,237,232,0.35)', lineHeight: 1.75 }}>
                  <p>The Haunted House, Jabbarkhet Estate, Uttarakhand</p>
                  <p>Mountain Quail Estate, Motidhar Valley, Uttarakhand</p>
                  <p>Wilderness Orchard, New Delhi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logo + socials — right */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="lg:items-end">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <LogoCompact size={26} />
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      border: '1px solid rgba(201,168,76,0.18)',
                      borderRadius: '2px',
                      color: 'rgba(240,237,232,0.30)',
                      transition: 'color 0.25s, border-color 0.25s, box-shadow 0.25s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = '#C9A84C'
                      el.style.borderColor = 'rgba(201,168,76,0.50)'
                      el.style.boxShadow = '0 0 10px rgba(201,168,76,0.12)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = 'rgba(240,237,232,0.30)'
                      el.style.borderColor = 'rgba(201,168,76,0.18)'
                      el.style.boxShadow = 'none'
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Gold divider */}
        <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div className="flex gap-6">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Cookies', href: '/cookies' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-mono transition-colors duration-300"
                style={{ fontSize: '0.6rem', color: 'rgba(240,237,232,0.2)', letterSpacing: '0.1em' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'rgba(201,168,76,0.5)' }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(240,237,232,0.2)' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wildfilmsindia.com'),

  title: {
    default: 'Wilderness Films India — South Asia\'s Largest Visual Archive',
    template: '%s — Wilderness Films India',
  },
  description:
    'Wilderness Films India is South Asia\'s largest factual visual archive and production house. 37+ years of cinematic storytelling, 150,000+ hours of footage, 5 million YouTube subscribers, and unmatched access across India\'s wildest landscapes.',

  keywords: [
    'wilderness films india',
    'wildfilmsindia',
    'wildlife documentary india',
    'stock footage india',
    'India wildlife footage',
    'south asia visual archive',
    'wildlife cinematography',
    'rupin dang filmmaker',
    'nature films india',
    'wildlife stock footage',
    'india documentary production',
    'production services india',
    'location services india',
    'wildlife photography india',
    'himalayas footage',
    'india archive footage',
    'factual television india',
    'BBC india production',
    'National Geographic india',
    'NHK india',
    'Discovery channel india',
    'broadcast services india',
    'equipment hire india',
    'betacam india',
    'wildlife cameraman india',
    '4K footage india',
  ],

  authors: [{ name: 'Wilderness Films India', url: 'https://www.wildfilmsindia.com' }],
  creator: 'Wilderness Films India',
  publisher: 'Wilderness Films India Ltd.',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.wildfilmsindia.com',
    siteName: 'Wilderness Films India',
    title: 'Wilderness Films India — South Asia\'s Largest Visual Archive',
    description:
      'South Asia\'s largest factual visual archive and production house. 37+ years of footage, wildlife documentaries, stock licensing, production & location services across India.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wilderness Films India — Cinematic stories from South Asia',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Wilderness Films India — South Asia\'s Largest Visual Archive',
    description:
      '37+ years of wildlife cinematography, 150,000+ hours of footage, 5M+ YouTube subscribers. Stock licensing, production & location services across India.',
    images: ['/og-image.jpg'],
    creator: '@WildFilmsIndia',
    site: '@WildFilmsIndia',
  },

  verification: {
    google: '',
  },

  alternates: {
    canonical: 'https://www.wildfilmsindia.com',
  },

  category: 'Film & Television Production',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#030303" />
        <meta name="color-scheme" content="dark" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="New Delhi, India" />
        <meta name="geo.position" content="28.5674;77.1921" />
        <meta name="ICBM" content="28.5674, 77.1921" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Wilderness Films India Ltd.',
              alternateName: 'WildFilmsIndia',
              url: 'https://www.wildfilmsindia.com',
              logo: 'https://www.wildfilmsindia.com/logo.png',
              description:
                "South Asia's largest factual visual archive and production house. Established in 1987 by filmmaker and naturalist Rupin Dang.",
              foundingDate: '1987',
              founder: {
                '@type': 'Person',
                name: 'Rupin Dang',
                jobTitle: 'Managing Director & Founder',
                description:
                  'Filmmaker, mountaineer, naturalist, and entrepreneur. Listed in the Limca Book of Records as the youngest filmmaker in India.',
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: '1 Factory Road, Ring Road South',
                addressLocality: 'New Delhi',
                postalCode: '110029',
                addressCountry: 'IN',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+91-9810019704',
                  contactType: 'customer service',
                  areaServed: 'IN',
                  availableLanguage: 'English',
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+91-9810149425',
                  contactType: 'sales',
                  areaServed: 'IN',
                  availableLanguage: 'English',
                },
              ],
              email: 'rupindang@gmail.com',
              sameAs: [
                'https://www.youtube.com/@WildFilmsIndia',
                'https://www.instagram.com/wildfilmsindia',
                'https://www.facebook.com/WildernessFilmsIndiaLimited',
              ],
              numberOfEmployees: { '@type': 'QuantitativeValue', value: 15 },
              areaServed: 'South Asia',
              knowsAbout: [
                'Wildlife cinematography',
                'Documentary filmmaking',
                'Stock footage licensing',
                'Production services India',
                'Nature photography',
                'Himalayan expeditions',
              ],
            }),
          }}
        />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
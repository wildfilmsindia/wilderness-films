// Shared SEO / structured-data helpers used across the whole site.
// Server-safe (plain data + functions). Import into server components only.

export const SITE = 'https://www.wildfilmsindia.com'
export const ORG_ID = `${SITE}/#organization`
export const WEBSITE_ID = `${SITE}/#website`

// Organization + LocalBusiness node — the canonical entity for the whole site.
// Typed as both so it is eligible for company knowledge panels AND local results.
export const organizationNode = {
  '@type': ['Organization', 'LocalBusiness'],
  '@id': ORG_ID,
  name: 'Wilderness Films India Ltd.',
  alternateName: 'WildFilmsIndia',
  url: SITE,
  logo: `${SITE}/logo.png`,
  image: `${SITE}/og-image.jpg`,
  slogan: "South Asia's largest factual visual archive",
  description:
    "South Asia's largest factual visual archive and production house. Established in 1987 by filmmaker and naturalist Rupin Dang. 150,000+ hours of wildlife, culture and landscape footage across India and the Himalayas.",
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
    addressRegion: 'Delhi',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 28.5674, longitude: 77.1921 },
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+91-9810019704', contactType: 'customer service', areaServed: 'IN', availableLanguage: 'English' },
    { '@type': 'ContactPoint', telephone: '+91-9810149425', contactType: 'sales', areaServed: 'IN', availableLanguage: 'English' },
  ],
  email: 'rupindang@gmail.com',
  sameAs: [
    'https://www.youtube.com/@WildFilmsIndia',
    'https://www.instagram.com/wildfilmsindia',
    'https://www.facebook.com/WildernessFilmsIndiaLimited',
  ],
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 15 },
  areaServed: ['India', 'South Asia'],
  knowsAbout: [
    'Wildlife cinematography',
    'Documentary filmmaking',
    'Stock footage licensing',
    'Production services India',
    'Location services India',
    'Nature photography',
    'Himalayan expeditions',
    'Broadcast equipment',
  ],
}

export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE,
  name: 'Wilderness Films India',
  description:
    "South Asia's largest factual visual archive and production house.",
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-IN',
}

// The sitewide graph rendered once in the root layout.
export const siteGraph = {
  '@context': 'https://schema.org',
  '@graph': [organizationNode, websiteNode],
}

// ── FAQ content — rendered on /faq AND emitted as FAQPage structured data.
// Answers common client questions; helps SEO rich results and AI answer engines.
export interface QA { q: string; a: string }

export const FAQS: QA[] = [
  {
    q: 'What is Wilderness Films India?',
    a: 'Wilderness Films India Ltd. (WildFilmsIndia) is South Asia\'s largest factual visual archive and independent production house, founded in New Delhi in 1987 by filmmaker and naturalist Rupin Dang. It holds over 150,000 hours of wildlife, cultural and landscape footage from across India and the Himalayas.',
  },
  {
    q: 'Can I license stock footage from your archive?',
    a: 'Yes. We license factual, wildlife and cultural footage from our 150,000+ hour archive for broadcast, film, streaming, advertising and educational use. Footage is available from standard definition through to 4K, including rare historic material. Contact us with your brief and we will suggest the best clips and licensing terms.',
  },
  {
    q: 'Do you provide production and location services in India?',
    a: 'Yes. With 37+ years of access across India — from Himalayan borders to protected wildlife habitats — we provide fixing, crewing, permits, equipment and logistics for visiting broadcasters and production companies. We have supported productions for clients including the BBC, National Geographic, NHK and Discovery.',
  },
  {
    q: 'What equipment do you sell and hire?',
    a: 'We sell and hire professional cine and broadcast equipment — cameras, lenses, matte boxes, monitors, recorders, tripods and accessories from makers such as ARRI, Sony, Canon, Fujinon and Zeiss. Our full catalogue of available items is listed on the Equipment page, each with photos and details, and you can enquire about any item directly.',
  },
  {
    q: 'Where are you based and what areas do you cover?',
    a: 'We are based in New Delhi, India, and operate across the whole of India and neighbouring South Asian countries including Nepal and Bhutan. Our archive and shoots span every Indian state and union territory.',
  },
  {
    q: 'How do I get in touch?',
    a: 'Email rupindang@gmail.com, or call +91-9810019704 (customer service) or +91-9810149425 (sales). You can also reach us via YouTube (@WildFilmsIndia), Instagram (@wildfilmsindia) or Facebook.',
  },
]

export function faqPageNode() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE}/faq/#faqpage`,
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

// Reusable breadcrumb builder → BreadcrumbList structured data.
export function breadcrumbNode(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

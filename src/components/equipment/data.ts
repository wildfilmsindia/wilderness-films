// Normalizes the raw equipment.json (name/cat/cond/…) into the display shape
// the redesigned grid uses (id/category/brand/condition), without touching the
// source file (the /equipment/[slug] SEO pages still read the raw shape).

export type Condition =
  | 'Brand New' | 'Excellent' | 'Like New' | 'Very Good' | 'Good' | 'Used'

export interface RawItem {
  name: string
  cat: string
  cond: 'New' | 'Used'
  url?: string
  sold?: boolean
  description?: string
  images?: string[]
  brand?: string
  mount?: string
}

export interface Item {
  id: string
  name: string
  description: string
  url?: string
  category: string
  brand: string
  condition: Condition
  images: string[]
  mount?: string
  sold: boolean
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// Raw categories → cleaner display categories (derived from the data at runtime)
const CATEGORY_MAP: Record<string, string> = {
  Lenses: 'Lenses',
  Cameras: 'Cameras',
  Tripods: 'Tripods & Supports',
  Monitors: 'Monitors',
  'Recorders & Playback': 'Recorders',
  'Matte Box': 'Matte Boxes & Filters',
  Accessories: 'Accessories',
  'Power & Charging': 'Accessories',
  Viewfinders: 'Accessories',
}

function deriveCondition(it: RawItem): Condition {
  const t = `${it.name} ${it.description ?? ''}`.toLowerCase()
  if (/brand[\s-]*new|never used|\bunused\b|new in box|\bsealed\b|\(new\)|\bnib\b/.test(t) || it.cond === 'New')
    return 'Brand New'
  if (/pristine|\bmint\b|showroom|excellent/.test(t)) return 'Excellent'
  if (/like[\s-]*new|as new/.test(t)) return 'Like New'
  if (/very good/.test(t)) return 'Very Good'
  if (/\bused\b|second[\s-]*hand/.test(t)) return 'Used'
  if (/\bgood\b/.test(t)) return 'Good'
  return 'Good'
}

export function normalize(raw: RawItem[]): Item[] {
  return raw
    .filter(it => it && it.name)
    .map(it => ({
      id: slugify(it.name),
      name: it.name,
      description: it.description ?? '',
      url: it.url,
      category: CATEGORY_MAP[it.cat] ?? it.cat,
      brand: it.brand ?? it.name.split(/\s+/).slice(0, 1).join(' '),
      condition: deriveCondition(it),
      images: Array.isArray(it.images) ? it.images : [],
      mount: it.mount,
      sold: !!it.sold,
    }))
}

// Color tokens per condition — used by ConditionBadge (and detail view).
export const CONDITION_STYLES: Record<Condition, { fg: string; bg: string; glow?: boolean }> = {
  'Brand New': { fg: '#0A0A0A', bg: '#D4A843', glow: true },
  Excellent: { fg: '#34D07A', bg: 'rgba(34,197,94,0.14)' },
  'Like New': { fg: '#12C58C', bg: 'rgba(16,185,129,0.14)' },
  'Very Good': { fg: '#5B9BF8', bg: 'rgba(59,130,246,0.14)' },
  Good: { fg: '#F5A623', bg: 'rgba(245,158,11,0.14)' },
  Used: { fg: '#A6ADBB', bg: 'rgba(107,114,128,0.18)' },
}

export const GOLD = '#D4A843'

export function enquiryHref(name: string): string {
  const su = encodeURIComponent('Enquiry: ' + name)
  const body = encodeURIComponent(
    'Hi,\n\nI am interested in the following item:\n' + name + '\n\nPlease share more details.\n\nRegards')
  return `https://mail.google.com/mail/?view=cm&fs=1&to=rupindang@gmail.com&cc=dharanshidang@gmail.com&su=${su}&body=${body}`
}

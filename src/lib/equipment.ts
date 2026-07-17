import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'

export interface EquipmentItem {
  name: string
  cat: string
  cond: 'New' | 'Used'
  desc?: string
  url?: string
  sold?: boolean
  brand?: string
  model?: string
  mount?: string
  quantity?: number
  location?: string
  description?: string
  specs?: Record<string, string>
  images?: string[]
  salePrice?: number | null
  rentalPerDay?: number | null
}

export const SITE = 'https://www.wildfilmsindia.com'

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

let cache: EquipmentItem[] | null = null

export async function getEquipment(): Promise<EquipmentItem[]> {
  if (cache) return cache
  const file = path.join(process.cwd(), 'public', 'equipment.json')
  const raw = await fs.readFile(file, 'utf-8')
  cache = JSON.parse(raw) as EquipmentItem[]
  return cache
}

export async function getItemBySlug(slug: string): Promise<EquipmentItem | null> {
  const items = await getEquipment()
  return items.find(i => slugify(i.name) === slug) ?? null
}

// Gmail compose link that pre-fills the enquiry — matches the catalogue's CTA.
export function enquiryHref(name: string): string {
  const su = encodeURIComponent('Enquiry: ' + name)
  const body = encodeURIComponent(
    'Hi,\n\nI am interested in the following item:\n' + name + '\n\nPlease share more details.\n\nRegards')
  return `https://mail.google.com/mail/?view=cm&fs=1&to=rupindang@gmail.com&cc=dharanshidang@gmail.com&su=${su}&body=${body}`
}

// ── Shop product data ────────────────────────────────────────────────
// The actual content lives in src/data/shop.json so it can be edited from
// the web admin (Pages CMS) without touching code. This file only defines
// the types and re-exports the JSON, so components import from here exactly
// as they did before.

import shop from '@/data/shop.json'

export interface ShopProduct {
  id: string
  name: string
  description: string
  price?: string           // freeform for now; e.g. "₹1,200"
  images: string[]
  tag?: string             // e.g. "New", "Limited", "Handmade"
}

export interface Store {
  slug: 'olive-wood' | 'himalayan-rapture'
  name: string
  intro?: string           // optional blurb under the store header
  hero: string             // storefront background image (first frame)
  heroSlideshow?: string[] // optional extra frames — the storefront panel
                           // cross-fades between these and the hero every few
                           // seconds. Include the hero itself in the list.
  accent: string           // hex — subtle per-store accent (dark theme still)
  // How product photos should sit in the card / lightbox frame.
  // 'cover' = fill (good for lifestyle shots), 'contain' = show whole item
  // (better for books, packaging, anything with important edges).
  fit?: 'cover' | 'contain'
  products: ShopProduct[]
}

const STORE_LIST = shop.stores as Store[]

export const OLIVE_WOOD: Store =
  STORE_LIST.find(s => s.slug === 'olive-wood') ?? STORE_LIST[0]
export const HIMALAYAN_RAPTURE: Store =
  STORE_LIST.find(s => s.slug === 'himalayan-rapture') ?? STORE_LIST[1]

// ShopSelector destructures this as a two-element tuple.
export const STORES: [Store, Store] = [OLIVE_WOOD, HIMALAYAN_RAPTURE]

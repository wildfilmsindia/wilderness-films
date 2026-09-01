'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, Tag } from 'lucide-react'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'
import EquipmentCard from './EquipmentCard'
import ProductDetail from './ProductDetail'
import ScrollToTop from './ScrollToTop'
import { type Item } from './data'

const PER_PAGE = 24
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })

// Items are supplied by the server component so the first screen of cards is
// present in the HTML (crawlable) rather than fetched after hydration.
export default function EquipmentBrowser({ items }: { items: Item[] }) {
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<'name-asc' | 'name-desc'>('name-asc')
  const [brand, setBrand] = useState('All')
  const [visible, setVisible] = useState(PER_PAGE)
  const [openItem, setOpenItem] = useState<Item | null>(null)
  const preloaded = useRef<Set<string>>(new Set())

  // Debounce search (200ms)
  useEffect(() => {
    const id = setTimeout(() => setQuery(queryInput), 200)
    return () => clearTimeout(id)
  }, [queryInput])

  const { categories, counts } = useMemo(() => {
    const available = items.filter(i => !i.sold)
    const c: Record<string, number> = { All: available.length }
    for (const i of available) c[i.category] = (c[i.category] || 0) + 1
    const categories = Object.keys(c).filter(k => k !== 'All').sort((a, b) => c[b] - c[a])
    return { categories, counts: c }
  }, [items])

  // Brands present in the current category (so the dropdown never offers dead ends)
  const brands = useMemo(() => {
    const b: Record<string, number> = {}
    for (const i of items) {
      if (i.sold) continue
      if (category !== 'All' && i.category !== category) continue
      if (!i.brand) continue
      b[i.brand] = (b[i.brand] || 0) + 1
    }
    return Object.entries(b).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
  }, [items, category])

  // Reset brand if it isn't available in the newly-picked category
  useEffect(() => {
    if (brand !== 'All' && !brands.some(([b]) => b === brand)) setBrand('All')
  }, [brands, brand])

  // Normalise so "10 mm", "10mm", "10-mm", "T 2.8" all match each other.
  // Lowercase, strip punctuation to space, collapse whitespace between a digit
  // and a following letter (units) or between adjacent digits.
  const normalize = (s: string) =>
    s.toLowerCase()
     .replace(/[-–—_/×x]/g, ' ')
     .replace(/(\d)\s+(?=[a-z])/g, '$1')
     .replace(/\s+/g, ' ')
     .trim()

  const filtered = useMemo(() => {
    const tokens = normalize(query).split(' ').filter(Boolean)
    const out = items.filter(i => {
      if (i.sold) return false
      if (category !== 'All' && i.category !== category) return false
      if (brand !== 'All' && i.brand !== brand) return false
      if (tokens.length) {
        const hay = normalize(`${i.name} ${i.description} ${i.brand} ${i.mount ?? ''}`)
        for (const t of tokens) if (!hay.includes(t)) return false
      }
      return true
    })
    // Items WITH a photo always land first — that's what the page should show
    // when it loads. Within each group we then sort by the user's selection.
    out.sort((a, b) => {
      const ai = a.images.length ? 0 : 1
      const bi = b.images.length ? 0 : 1
      if (ai !== bi) return ai - bi
      return sort === 'name-desc'
        ? collator.compare(b.name, a.name)
        : collator.compare(a.name, b.name)
    })
    return out
  }, [items, query, category, sort, brand])

  useEffect(() => { setVisible(PER_PAGE) }, [query, category, sort, brand])

  // Warm an item's first photos on hover so the drawer opens with them ready
  const preload = useCallback((item: Item) => {
    for (const src of item.images.slice(0, 2)) {
      if (preloaded.current.has(src)) continue
      preloaded.current.add(src)
      const img = new Image()
      img.decoding = 'async'
      img.src = src
    }
  }, [])

  const showItem = useCallback((item: Item) => {
    setOpenItem(item)
    history.replaceState(null, '', `#item=${item.id}`)
  }, [])
  const closeItem = useCallback(() => {
    setOpenItem(null)
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  useEffect(() => {
    const m = window.location.hash.match(/^#item=(.+)$/)
    if (!m) return
    const found = items.find(i => i.id === decodeURIComponent(m[1]))
    if (found) setOpenItem(found)
  }, [items])

  const pageItems = filtered.slice(0, visible)
    const total = items.filter(i => !i.sold).length

  // Step through the *current filtered list* from inside the drawer
  const openIndex = openItem ? filtered.findIndex(i => i.id === openItem.id) : -1
  const goTo = useCallback((idx: number) => {
    const next = filtered[idx]
    if (next) showItem(next)
  }, [filtered, showItem])

  // Related: same category, prefer the same brand, prefer items that have photos
  const related = useMemo(() => {
    if (!openItem) return []
    return items
      .filter(i => !i.sold && i.id !== openItem.id && i.category === openItem.category)
      .sort((a, b) =>
        (b.brand === openItem.brand ? 1 : 0) - (a.brand === openItem.brand ? 1 : 0) ||
        (b.images.length ? 1 : 0) - (a.images.length ? 1 : 0))
      .slice(0, 4)
  }, [openItem, items])

  return (
    <>
      <main
        className="min-h-[100svh] text-white"
        style={{
          paddingTop: 80,
          fontFamily: "'Outfit', sans-serif",
          // Smooth top-to-bottom dark wash — no blobs, no seam against the nav.
          background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 400px, #0a0a0a 100%)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">

          <motion.header
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="relative pt-10 sm:pt-14"
          >
            <h1 className="relative font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 6vw, 3.4rem)' }}>
              Equipment for <span className="text-[#D4A843]">Sale &amp; Rental</span>
            </h1>
            <p className="relative mt-3 max-w-xl text-sm text-white/45 sm:text-base">
              Professional broadcast &amp; cinema equipment from Wilderness Films India.
            </p>
          </motion.header>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 max-w-2xl"
          >
            <SearchBar value={queryInput} onChange={setQueryInput} placeholder={`Search ${total} items… cameras, lenses, monitors`} />
          </motion.div>

          {/* Sticky filters */}
          <motion.div
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-4"
          >
            <FilterBar categories={categories} active={category} onChange={setCategory} counts={counts} />
          </motion.div>

          {/* Stats + sort */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <motion.p key={`${filtered.length}-${category}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
              className="text-[0.72rem] uppercase tracking-[0.16em] text-white/40">
              Showing <span className="text-[#D4A843]">{filtered.length}</span>{' '}{category === 'All' ? 'items' : category}
            </motion.p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {/* Brand */}
              <div className="relative flex items-center">
                <Tag size={12} className="pointer-events-none absolute left-3 text-white/35" />
                <select
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  aria-label="Filter by brand"
                  className={`cursor-pointer rounded-full border bg-[#141414] py-2 pl-8 pr-7 text-[0.7rem] outline-none transition-colors hover:border-white/20 focus:border-[#D4A843]/50 ${
                    brand === 'All' ? 'border-white/10 text-white/60' : 'border-[#D4A843]/50 text-[#D4A843]'
                  }`}
                >
                  <option value="All">All brands</option>
                  {brands.map(([b, n]) => <option key={b} value={b}>{b} ({n})</option>)}
                </select>
              </div>

              {/* Sort */}
              <div className="relative flex items-center">
                <ArrowUpDown size={12} className="pointer-events-none absolute left-3 text-white/35" />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as 'name-asc' | 'name-desc')}
                  aria-label="Sort"
                  className="cursor-pointer rounded-full border border-white/10 bg-[#141414] py-2 pl-8 pr-7 text-[0.7rem] text-white/60 outline-none transition-colors hover:border-white/20 focus:border-[#D4A843]/50"
                >
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                </select>
              </div>

            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <p className="text-sm text-white/50">
                No equipment found{query ? <> for &ldquo;<span className="text-[#D4A843]">{query}</span>&rdquo;</> : ''}.
              </p>
              <button onClick={() => { setQueryInput(''); setCategory('All') }}
                className="text-[0.7rem] uppercase tracking-[0.14em] text-white/40 underline-offset-4 hover:text-[#D4A843] hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((item, i) => (
                  <EquipmentCard key={item.id} item={item} index={i} onOpen={showItem} onPreload={preload} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setVisible(v => v + PER_PAGE)}
                    className="rounded-full border border-[#D4A843]/50 px-8 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#D4A843] transition-all duration-200 hover:-translate-y-px hover:bg-[#D4A843] hover:text-[#0A0A0A]"
                  >
                    Load more ({filtered.length - visible})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ProductDetail
        item={openItem}
        onClose={closeItem}
        onPrev={openIndex > 0 ? () => goTo(openIndex - 1) : undefined}
        onNext={openIndex >= 0 && openIndex < filtered.length - 1 ? () => goTo(openIndex + 1) : undefined}
        position={openIndex >= 0 ? { index: openIndex, total: filtered.length } : undefined}
        related={related}
        onOpenRelated={showItem}
      />
      <ScrollToTop />
    </>
  )
}

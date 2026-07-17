'use client'

import React, { startTransition, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

// ── Types ─────────────────────────────────────────────────────

interface EquipmentItem {
  name: string
  cat: string
  cond: 'New' | 'Used'
  desc?: string   // price
  url?: string    // KitPlus listing URL
  sold?: boolean
  // optional detail fields — shown in the item modal when present
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

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const inr = (n: number) => n.toLocaleString('en-IN')

// One shared collator — dramatically faster than String.localeCompare,
// which re-resolves the locale on every comparison while sorting.
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })

// Warm the browser cache for an item's first photo (on row hover) so the
// modal image appears instantly when the row is clicked.
const preloaded = new Set<string>()
function preloadImage(src?: string) {
  if (!src || preloaded.has(src)) return
  preloaded.add(src)
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

function openEnquiry(name: string) {
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=rupindang@gmail.com&cc=dharanshidang@gmail.com&su=${encodeURIComponent('Enquiry: ' + name)}&body=${encodeURIComponent('Hi,\n\nI am interested in the following item:\n' + name + '\n\nPlease share more details.\n\nRegards')}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

type Cond = 'all' | 'New' | 'Used'
type SortKey = 'name-asc' | 'name-desc'

// ── Dropdown ──────────────────────────────────────────────────

function Dropdown({
  label, hasValue, children,
}: {
  label: string; hasValue?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#1a1a1a', border: `1px solid ${hasValue ? '#8a6f2e' : '#2c2c2c'}`,
          borderRadius: '6px', padding: '0.55rem 0.85rem',
          fontFamily: "'Montserrat', sans-serif", fontSize: '0.72rem',
          color: hasValue ? '#c8a84b' : '#888', cursor: 'pointer',
          whiteSpace: 'nowrap', transition: 'border-color 0.18s, color 0.18s',
        }}
      >
        <span>{label}</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          background: '#1a1a1a', border: '1px solid #2c2c2c',
          borderRadius: '8px', minWidth: '220px', maxHeight: '340px', overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 400,
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

function DDOption({
  selected, onClick, children,
}: {
  selected?: boolean; onClick: () => void; children: React.ReactNode
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.55rem 0.9rem', fontSize: '0.72rem',
        color: selected ? '#c8a84b' : hov ? '#f0ece3' : '#888',
        background: selected ? 'rgba(200,168,75,0.09)' : hov ? '#222' : 'transparent',
        cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
      }}
    >
      {children}
    </div>
  )
}

const DDDivider = () => <div style={{ height: '1px', background: '#222', margin: '0.2rem 0' }} />

// ── Table row (memoized) ──────────────────────────────────────
// Styles hoisted to module scope so they're allocated once, not per
// row per render. The row is wrapped in React.memo so unrelated state
// changes (opening/closing the modal, typing in search) don't re-render
// every row — only rows whose item actually changes.

const TD = { padding: '0.9rem 1rem', verticalAlign: 'middle' } as const
const TD_RIGHT = { padding: '0.9rem 1rem', verticalAlign: 'middle', textAlign: 'right' } as const
const NAME_STYLE = {
  fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 400,
  color: '#f0ece3', lineHeight: 1.25, transition: 'color 0.15s',
} as const
const CAT_PILL = {
  display: 'inline-block', fontSize: '0.58rem', fontWeight: 500,
  letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.22rem 0.6rem',
  border: '1px solid #2c2c2c', borderRadius: '4px', color: '#888', whiteSpace: 'nowrap',
} as const
const PILL_BASE = {
  display: 'inline-block', fontSize: '0.58rem', fontWeight: 600,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  padding: '0.22rem 0.65rem', borderRadius: '20px',
} as const
const PILL_NEW = { ...PILL_BASE, background: 'rgba(78,158,58,0.13)', color: '#4e9e3a' } as const
const PILL_USED = { ...PILL_BASE, background: 'rgba(200,168,75,0.09)', color: '#c8a84b' } as const
const PILL_SOLD = { ...PILL_BASE, background: 'rgba(255,255,255,0.06)', color: '#555', border: '1px solid #333' } as const
const ENQUIRE_STYLE = {
  display: 'inline-block', fontSize: '0.6rem', fontWeight: 600,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8a84b',
  textDecoration: 'none', border: '1px solid #8a6f2e', borderRadius: '5px',
  padding: '0.38rem 0.9rem', transition: 'background 0.18s, color 0.18s, border-color 0.18s',
  whiteSpace: 'nowrap', cursor: 'pointer', background: 'transparent',
} as const
const SOLD_BTN_STYLE = {
  display: 'inline-block', fontSize: '0.6rem', fontWeight: 600,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8a84b',
  border: '1px solid #8a6f2e', borderRadius: '5px', padding: '0.38rem 0.9rem',
  opacity: 0.3, cursor: 'not-allowed',
} as const
const ROW_STYLE = { borderBottom: '1px solid #222', cursor: 'pointer', transition: 'background 0.12s' } as const
const ROW_STYLE_SOLD = { ...ROW_STYLE, opacity: 0.45 } as const

const EquipmentRow = React.memo(function EquipmentRow({
  item, onOpen,
}: { item: EquipmentItem; onOpen: (item: EquipmentItem) => void }) {
  const sold = !!item.sold
  const condPill = sold ? PILL_SOLD : item.cond === 'New' ? PILL_NEW : PILL_USED
  return (
    <tr
      className="eq-row"
      tabIndex={0}
      aria-label={`View details: ${item.name}`}
      onClick={() => onOpen(item)}
      onMouseEnter={() => preloadImage(item.images?.[0])}
      onFocus={() => preloadImage(item.images?.[0])}
      onKeyDown={e => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(item) }
      }}
      style={sold ? ROW_STYLE_SOLD : ROW_STYLE}
    >
      <td style={TD}>
        {/* Real link for crawlers / cmd-click; normal click opens the modal */}
        <a
          href={`/equipment/${slugify(item.name)}`}
          className="eq-name"
          onClick={e => {
            e.stopPropagation()
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
            e.preventDefault()
            onOpen(item)
          }}
          style={sold
            ? { ...NAME_STYLE, textDecoration: 'line-through', display: 'inline-block' }
            : { ...NAME_STYLE, textDecoration: 'none', display: 'inline-block' }}
        >
          {item.name}
        </a>
        <span className="eq-cond-mobile" style={{ ...condPill, display: 'none', fontSize: '0.52rem', padding: '0.18rem 0.5rem', marginTop: '0.35rem' }}>
          {sold ? 'Sold' : item.cond}
        </span>
      </td>
      <td style={TD}><span style={CAT_PILL}>{item.cat}</span></td>
      <td style={TD}><span style={condPill}>{sold ? 'Sold' : item.cond}</span></td>
      <td style={TD_RIGHT}>
        {sold ? (
          <span style={SOLD_BTN_STYLE}>Sold</span>
        ) : (
          <button
            className="enquire-btn"
            onClick={e => { e.stopPropagation(); openEnquiry(item.name) }}
            style={ENQUIRE_STYLE}
          >
            Enquire
          </button>
        )}
      </td>
    </tr>
  )
})

// ── Item details modal ────────────────────────────────────────

function CondPill({ cond, sold }: { cond: 'New' | 'Used'; sold: boolean }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.58rem', fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '0.22rem 0.65rem', borderRadius: '20px',
      ...(sold
        ? { background: 'rgba(255,255,255,0.06)', color: '#555', border: '1px solid #333' }
        : cond === 'New'
        ? { background: 'rgba(78,158,58,0.13)', color: '#4e9e3a' }
        : { background: 'rgba(200,168,75,0.09)', color: '#c8a84b' }),
    }}>
      {sold ? 'Sold' : cond}
    </span>
  )
}

function ItemModal({ item, onClose }: { item: EquipmentItem; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const images = item.images ?? []
  const sold = !!item.sold

  // Esc to close, focus trap, scroll lock, focus restore
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const card = cardRef.current
    document.body.style.overflow = 'hidden'
    card?.querySelector<HTMLElement>('[data-eqm-close]')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !card) return
      const els = Array.from(
        card.querySelectorAll<HTMLElement>('button, a[href]')
      ).filter(el => el.offsetParent !== null)
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !card.contains(active))) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && (active === last || !card.contains(active))) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [onClose])

  const specRows: [string, string][] = []
  if (item.brand) specRows.push(['Brand', item.brand])
  if (item.model) specRows.push(['Model', item.model])
  if (item.mount) specRows.push(['Mount', item.mount])
  specRows.push(['Condition', sold ? 'Sold' : item.cond])
  if (item.quantity != null) specRows.push(['Quantity available', String(item.quantity)])
  if (item.location) specRows.push(['Location', item.location])
  if (item.specs) for (const [k, v] of Object.entries(item.specs)) specRows.push([k, v])

  const hasPrice = !sold && (item.salePrice != null || item.rentalPerDay != null)

  return (
    <div
      className="eqm-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(5,5,5,0.78)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.2rem', animation: 'eqmFade 0.16s ease-out',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="eqm-title"
        className="eqm-card"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: '880px', maxHeight: '88vh',
          overflowY: 'auto', background: '#111',
          border: '1px solid rgba(200,168,75,0.3)', borderRadius: '10px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          animation: 'eqmScale 0.18s ease-out',
        }}
      >
        {/* Close */}
        <button
          data-eqm-close
          className="eqm-close"
          onClick={onClose}
          aria-label="Close details"
          style={{
            position: 'absolute', top: '0.8rem', right: '0.8rem', zIndex: 5,
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(17,17,17,0.85)', border: '1px solid #2c2c2c', borderRadius: '6px',
            color: '#888', cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Gallery */}
        <div className="eqm-gallery" style={{
          padding: '1.3rem', background: '#0d0d0d',
          display: 'flex', flexDirection: 'column', gap: '0.6rem',
        }}>
          <div className="eqm-main" style={{
            aspectRatio: '3 / 2', background: '#0f0f0f',
            border: '1px solid #222', borderRadius: '6px', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {images.length > 0 ? (
              <img
                src={images[Math.min(imgIdx, images.length - 1)]}
                alt={`${item.name} — image ${imgIdx + 1} of ${images.length}`}
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.9rem', padding: '2rem', textAlign: 'center',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Wild Films India" style={{ width: 72, opacity: 0.55 }} />
                <span style={{
                  fontSize: '0.56rem', fontWeight: 600, letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: '#c8a84b', opacity: 0.8,
                }}>
                  Image on request
                </span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {images.map((src, i) => (
                <button
                  key={src}
                  className="eqm-thumb"
                  onClick={() => setImgIdx(i)}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                  aria-current={i === imgIdx}
                  style={{
                    width: 64, height: 44, padding: 0, borderRadius: '4px', overflow: 'hidden',
                    border: `1px solid ${i === imgIdx ? '#c8a84b' : '#2c2c2c'}`,
                    opacity: i === imgIdx ? 1 : 0.55, cursor: 'pointer',
                    background: '#0f0f0f', transition: 'opacity 0.15s, border-color 0.15s',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{
          padding: '1.5rem 1.5rem 1.7rem', minWidth: 0,
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <h2
            id="eqm-title"
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
              fontSize: '1.55rem', lineHeight: 1.15, color: '#f0ece3',
              margin: 0, paddingRight: '2.2rem',
            }}
          >
            {item.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-block', fontSize: '0.58rem', fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0.22rem 0.6rem', border: '1px solid #2c2c2c',
              borderRadius: '4px', color: '#888', whiteSpace: 'nowrap',
            }}>
              {item.cat}
            </span>
            <CondPill cond={item.cond} sold={sold} />
          </div>

          {item.description && (
            <p style={{ fontSize: '0.74rem', fontWeight: 300, color: '#999', lineHeight: 1.75, margin: 0 }}>
              {item.description}
            </p>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {specRows.map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid #1e1e1e' }}>
                  <td style={{
                    padding: '0.45rem 0.9rem 0.45rem 0', verticalAlign: 'top',
                    fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: '#666', whiteSpace: 'nowrap',
                  }}>{k}</td>
                  <td style={{ padding: '0.45rem 0', fontSize: '0.72rem', color: '#ccc' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasPrice && (
            <div style={{
              display: 'flex', gap: '2rem', flexWrap: 'wrap',
              border: '1px solid rgba(200,168,75,0.25)', borderRadius: '6px',
              padding: '0.8rem 1rem', background: 'rgba(200,168,75,0.04)',
            }}>
              {item.salePrice != null && (
                <div>
                  <div style={{
                    fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: '#666', marginBottom: '0.2rem',
                  }}>For Sale</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#c8a84b' }}>
                    ₹{inr(item.salePrice)}
                  </div>
                </div>
              )}
              {item.rentalPerDay != null && (
                <div>
                  <div style={{
                    fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: '#666', marginBottom: '0.2rem',
                  }}>Rental</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#c8a84b' }}>
                    ₹{inr(item.rentalPerDay)}<span style={{ fontSize: '0.8rem', color: '#888' }}> /day</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
            {sold ? (
              <span style={{
                display: 'inline-block', fontSize: '0.6rem', fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#c8a84b', border: '1px solid #8a6f2e',
                borderRadius: '5px', padding: '0.5rem 1.3rem',
                opacity: 0.3, cursor: 'not-allowed',
              }}>Sold</span>
            ) : (
              <button
                className="enquire-btn"
                onClick={() => openEnquiry(item.name)}
                style={{
                  display: 'inline-block', fontSize: '0.62rem', fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#c8a84b', border: '1px solid #8a6f2e', borderRadius: '5px',
                  padding: '0.5rem 1.3rem', background: 'transparent',
                  transition: 'background 0.18s, color 0.18s, border-color 0.18s',
                  whiteSpace: 'nowrap', cursor: 'pointer',
                }}
              >
                Enquire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function EquipmentPage() {
  const [items, setItems] = useState<EquipmentItem[]>([])
  const [loadError, setLoadError] = useState(false)
  const [activeCat, setActiveCatRaw] = useState('all')
  const [activeCond, setActiveCondRaw] = useState<Cond>('all')
  const [activeSort, setActiveSortRaw] = useState<SortKey>('name-asc')
  const [queryInput, setQueryInput] = useState('')  // bound to the field (instant)
  const [query, setQuery] = useState('')            // debounced value used for filtering
  const [perPage, setPerPageRaw] = useState(50)
  const [page, setPage] = useState(1)
  const [openItem, setOpenItem] = useState<EquipmentItem | null>(null)

  // Filter/sort/per-page changes re-render the whole list — mark them as
  // transitions so the click itself stays instant and React renders the
  // new list without blocking the UI thread's input handling.
  const setActiveCat  = (v: string)  => startTransition(() => setActiveCatRaw(v))
  const setActiveCond = (v: Cond)    => startTransition(() => setActiveCondRaw(v))
  const setActiveSort = (v: SortKey) => startTransition(() => setActiveSortRaw(v))
  const setPerPage    = (v: number)  => startTransition(() => setPerPageRaw(v))

  useEffect(() => {
    fetch('/equipment.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setItems)
      .catch(() => setLoadError(true))
  }, [])

  // Debounce search so we don't re-filter/re-render the whole list on every
  // keystroke; the debounced update itself is also a low-priority transition.
  useEffect(() => {
    const id = setTimeout(() => startTransition(() => setQuery(queryInput)), 140)
    return () => clearTimeout(id)
  }, [queryInput])

  const showItem = useCallback((item: EquipmentItem) => {
    setOpenItem(item)
    history.replaceState(null, '', `#item=${slugify(item.name)}`)
  }, [])

  const closeItem = useCallback(() => {
    setOpenItem(null)
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  // Precompute per-item lowercase search text and slug once per data load,
  // instead of re-lowercasing every field of every item on each filter run.
  const index = useMemo(() => items.map(item => ({
    item,
    search: `${item.name} ${item.description || item.desc || ''} ${item.cat}`.toLowerCase(),
    slug: slugify(item.name),
  })), [items])

  // Deep link: open #item=<slug> once data is loaded
  useEffect(() => {
    if (index.length === 0) return
    const m = window.location.hash.match(/^#item=(.+)$/)
    if (!m) return
    const slug = decodeURIComponent(m[1])
    const found = index.find(e => e.slug === slug)
    if (found) setOpenItem(found.item)
  }, [index])

  // Build category list from actual data
  const categories = useMemo(() =>
    Array.from(new Set(items.map(i => i.cat))).sort()
  , [items])

  // Precompute available-count per category once (not on every render)
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: 0 }
    for (const i of items) {
      if (i.sold) continue
      m.all++
      m[i.cat] = (m[i.cat] || 0) + 1
    }
    return m
  }, [items])
  const catCount = (cat: string) => counts[cat] || 0

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const out: EquipmentItem[] = []
    for (const e of index) {
      if (activeCat !== 'all' && e.item.cat !== activeCat) continue
      if (activeCond !== 'all' && e.item.cond !== activeCond) continue
      if (q && !e.search.includes(q)) continue
      out.push(e.item)
    }
    out.sort((a, b) => activeSort === 'name-desc'
      ? collator.compare(b.name, a.name)
      : collator.compare(a.name, b.name))
    return out
  }, [index, activeCat, activeCond, activeSort, query])

  // Reset to page 1 when filters or perPage change
  useEffect(() => { setPage(1) }, [activeCat, activeCond, activeSort, query, perPage])

  const totalPages = perPage === 0 ? 1 : Math.ceil(filtered.length / perPage)
  const pageItems  = perPage === 0 ? filtered : filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <>
      <Navigation />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .eq-row:hover { background: #131313 !important; }
        .eq-row:hover .eq-name { color: #deba60 !important; }
        .enquire-btn:hover { background: #c8a84b !important; color: #000 !important; border-color: #c8a84b !important; }
        .dd-scroll::-webkit-scrollbar { width: 4px; }
        .dd-scroll::-webkit-scrollbar-track { background: transparent; }
        .dd-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .eq-row:focus-visible { outline: 1px solid #8a6f2e; outline-offset: -1px; background: #131313; }
        @keyframes eqmFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes eqmScale { from { opacity: 0; transform: scale(0.965) } to { opacity: 1; transform: scale(1) } }
        @media (prefers-reduced-motion: reduce) {
          .eqm-backdrop, .eqm-card { animation: none !important; }
        }
        .eqm-close:hover { color: #c8a84b !important; border-color: #8a6f2e !important; }
        .eqm-thumb:hover { opacity: 1 !important; }
        @media (min-width: 861px) {
          .eqm-card { display: grid; grid-template-columns: 400px 1fr; align-items: start; }
          .eqm-gallery { border-right: 1px solid #222; }
        }
        @media (max-width: 560px) {
          .eqm-backdrop { padding: 0 !important; }
          .eqm-card {
            border-radius: 0 !important; border-left: none !important; border-right: none !important;
            max-height: 100dvh !important; height: 100%;
          }
          /* Keep the gallery compact on phones so the title & details stay in view */
          .eqm-gallery { padding: 0.9rem !important; gap: 0.5rem !important; }
          .eqm-main { aspect-ratio: auto !important; height: 32vh !important; }
          .eqm-thumb { width: 52px !important; height: 36px !important; }
        }
        /* Skip layout/paint for rows scrolled out of view — keeps long
           lists (e.g. "All" = 244 rows) smooth to scroll. */
        .eq-row { content-visibility: auto; contain-intrinsic-size: auto 52px; }
        @media (max-width: 860px) {
          .eq-table th:nth-child(2), .eq-table td:nth-child(2),
          .eq-table th:nth-child(3), .eq-table td:nth-child(3) { display: none; }
          .eq-cond-mobile { display: inline-block !important; }
        }
        @media (max-width: 560px) {
          .eq-hero { flex-direction: column !important; }
          .eq-hero-desc { border-left: none !important; padding-left: 0 !important; border-top: 1px solid #2c2c2c; padding-top: 0.8rem !important; }
        }
      `}</style>

      <main style={{ background: '#0a0a0a', minHeight: '100svh', fontFamily: "'Montserrat', sans-serif", paddingTop: '80px' }}>

        {/* ── Hero ── */}
        <section className="eq-hero" style={{
          borderBottom: '1px solid #222',
          padding: '2rem 2rem 1.8rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '2rem',
          background: 'linear-gradient(105deg, #0a0a0a 60%, rgba(200,168,75,0.04) 100%)',
        }}>
          <div>
            <div style={{
              fontSize: '0.54rem', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#c8a84b', marginBottom: '0.4rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}>
              <span style={{ width: 20, height: 1, background: '#c8a84b', display: 'inline-block' }} />
              Wilderness Films India — Est. 1987
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 2.6rem)', lineHeight: 1,
              color: '#f0ece3', margin: 0,
            }}>
              Equipment{' '}
              <em style={{ fontStyle: 'italic', color: '#c8a84b', display: 'block' }}>For Sale &amp; Rental</em>
            </h1>
          </div>
          <div className="eq-hero-desc" style={{
            maxWidth: '340px', flexShrink: 0,
            borderLeft: '1px solid #2c2c2c', paddingLeft: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 300, color: '#888', lineHeight: 1.75, margin: 0 }}>
              For specific equipment requirements not listed here, write to us directly. Our inventory runs deeper than what&apos;s on this page.
            </p>
            <a
              href="/#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.55rem', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#C9A84C', textDecoration: 'none',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: '2px', padding: '0.55rem 1rem',
                transition: 'background 0.2s, border-color 0.2s',
                alignSelf: 'flex-start',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(201,168,76,0.12)'
                el.style.borderColor = 'rgba(201,168,76,0.6)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.borderColor = 'rgba(201,168,76,0.35)'
              }}
            >
              Contact Us
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>

        {/* ── Toolbar ── */}
        <div style={{
          background: '#131313', borderBottom: '1px solid #222',
          padding: '0.75rem 2rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          flexWrap: 'wrap', position: 'sticky', top: 80, zIndex: 200,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="#666" strokeWidth="2"
              style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search equipment…"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #2c2c2c',
                borderRadius: '6px', padding: '0.55rem 0.8rem 0.55rem 2.2rem',
                fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem',
                color: '#f0ece3', outline: 'none',
              }}
            />
          </div>

          {/* Category */}
          <Dropdown
            label={activeCat === 'all' ? 'Category' : activeCat}
            hasValue={activeCat !== 'all'}
          >
            <DDOption selected={activeCat === 'all'} onClick={() => setActiveCat('all')}>
              <span>All Categories</span>
              <span style={{ fontSize: '0.62rem', color: '#666' }}>{catCount('all')}</span>
            </DDOption>
            <DDDivider />
            {categories.map(c => (
              <DDOption key={c} selected={activeCat === c} onClick={() => setActiveCat(c)}>
                <span>{c}</span>
                <span style={{ fontSize: '0.62rem', color: '#666' }}>{catCount(c)}</span>
              </DDOption>
            ))}
          </Dropdown>

          {/* Condition */}
          <Dropdown label={activeCond === 'all' ? 'Condition' : activeCond} hasValue={activeCond !== 'all'}>
            <DDOption selected={activeCond === 'all'} onClick={() => setActiveCond('all')}>All Conditions</DDOption>
            <DDDivider />
            <DDOption selected={activeCond === 'New'} onClick={() => setActiveCond('New')}>New</DDOption>
            <DDOption selected={activeCond === 'Used'} onClick={() => setActiveCond('Used')}>Used</DDOption>
          </Dropdown>

          {/* Sort */}
          <Dropdown label={activeSort === 'name-asc' ? 'Sort: A→Z' : 'Sort: Z→A'}>
            <DDOption selected={activeSort === 'name-asc'} onClick={() => setActiveSort('name-asc')}>Name A→Z</DDOption>
            <DDOption selected={activeSort === 'name-desc'} onClick={() => setActiveSort('name-desc')}>Name Z→A</DDOption>
          </Dropdown>

          {/* Per page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.62rem', color: '#666', whiteSpace: 'nowrap' }}>Per page:</span>
            {[10, 25, 50, 100, 0].map(n => (
              <button
                key={n}
                onClick={() => setPerPage(n)}
                style={{
                  background: perPage === n ? 'rgba(200,168,75,0.12)' : 'transparent',
                  border: `1px solid ${perPage === n ? '#8a6f2e' : '#2c2c2c'}`,
                  borderRadius: '4px', padding: '0.25rem 0.5rem',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '0.62rem',
                  color: perPage === n ? '#c8a84b' : '#666',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {n === 0 ? 'All' : n}
              </button>
            ))}
            <span style={{ fontSize: '0.62rem', color: '#555', marginLeft: '0.4rem', whiteSpace: 'nowrap' }}>
              <strong style={{ color: '#c8a84b', fontWeight: 500 }}>{filtered.length}</strong> of {items.length}
            </span>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ padding: '0 2rem 3rem' }}>
          {loadError ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
              <p style={{ fontSize: '0.75rem' }}>Could not load equipment data</p>
            </div>
          ) : filtered.length === 0 && items.length > 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.15, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.06em' }}>No items match your filters</p>
            </div>
          ) : items.length === 0 && !loadError ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.06em' }}>Equipment list coming soon</p>
            </div>
          ) : (
            <table className="eq-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.2rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #8a6f2e' }}>
                  {['Item', 'Category', 'Condition', 'Enquire'].map((h, i) => (
                    <th key={h} style={{
                      textAlign: i === 3 ? 'right' : 'left',
                      padding: '0.6rem 1rem',
                      fontSize: '0.54rem', fontWeight: 600,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#666', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map(item => (
                  <EquipmentRow key={item.url || item.name} item={item} onOpen={showItem} />
                ))}
              </tbody>
            </table>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.4rem', padding: '2rem 0 0.5rem',
            }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: 'transparent', border: '1px solid #2c2c2c',
                  borderRadius: '4px', padding: '0.38rem 0.75rem',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '0.62rem',
                  color: page === 1 ? '#333' : '#888', cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | '…')[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('…')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) =>
                  n === '…' ? (
                    <span key={`ellipsis-${i}`} style={{ fontSize: '0.62rem', color: '#444', padding: '0 0.2rem' }}>…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      style={{
                        background: page === n ? 'rgba(200,168,75,0.12)' : 'transparent',
                        border: `1px solid ${page === n ? '#8a6f2e' : '#2c2c2c'}`,
                        borderRadius: '4px', padding: '0.38rem 0.65rem',
                        fontFamily: "'Montserrat', sans-serif", fontSize: '0.62rem',
                        color: page === n ? '#c8a84b' : '#666',
                        cursor: 'pointer', minWidth: '32px',
                        transition: 'all 0.15s',
                      }}
                    >
                      {n}
                    </button>
                  )
                )
              }

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: 'transparent', border: '1px solid #2c2c2c',
                  borderRadius: '4px', padding: '0.38rem 0.75rem',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '0.62rem',
                  color: page === totalPages ? '#333' : '#888', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

      </main>

      {openItem && (
        <ItemModal key={slugify(openItem.name)} item={openItem} onClose={closeItem} />
      )}

      <Footer />
    </>
  )
}

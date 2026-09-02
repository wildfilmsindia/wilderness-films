'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Store, ShopProduct } from './data'

// Reusable "inside the store" view. Header with back-to-selector, a product
// grid, and a lightbox for a full look. Kept intentionally simple — the
// per-store copy/products live in data.ts.

export default function StoreView({
  store, onBack,
}: { store: Store; onBack: () => void }) {
  const [open, setOpen] = useState<ShopProduct | null>(null)
  const fit = store.fit ?? 'cover'
  // For 'contain' we tone down the bottom fade so it doesn't clip whitespace
  // above a book cover.
  const imgFitClass = fit === 'contain' ? 'object-contain p-3' : 'object-cover'
  const hoverScale = fit === 'contain' ? '' : 'group-hover:scale-[1.05]'

  return (
    <div className="min-h-[100svh] bg-[#0A0A0A] text-white" style={{ fontFamily: "'Outfit', sans-serif", paddingTop: 80 }}>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">

        {/* Header — back button + store name/intro, gold hairline underneath */}
        <motion.header
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="pt-10 sm:pt-14"
        >
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-[#D4A843]"
          >
            <ArrowLeft size={13} /> All stores
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div>
              <h1 className="font-light leading-none text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 6vw, 3.4rem)' }}>
                {store.name}
              </h1>
            </div>
            {store.intro && (
              <p className="max-w-md text-[0.82rem] leading-relaxed text-white/50">{store.intro}</p>
            )}
          </div>
        </motion.header>

        {/* Divider */}
        <div className="mt-8 h-px w-full" style={{ background: `linear-gradient(90deg, ${store.accent}55, transparent)` }} />

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {store.products.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setOpen(p)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161616] transition-[box-shadow,border-color] duration-300 hover:border-[#D4A843]/25 hover:shadow-[0_0_24px_rgba(212,168,67,0.15)]"
            >
              <div className={`relative w-full overflow-hidden bg-[#0f0f0f] ${fit === 'contain' ? 'aspect-square' : 'aspect-[4/5]'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${imgFitClass} ${hoverScale} ${p.images.length > 1 ? 'group-hover:opacity-0' : ''}`}
                />
                {/* Second photo swaps in on hover, so back-print tees etc.
                    are visible without opening the lightbox. */}
                {p.images.length > 1 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[1]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${imgFitClass}`}
                  />
                )}
                {p.images.length > 1 && (
                  <span className="absolute bottom-2 left-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
                    {p.images.length} photos
                  </span>
                )}
                {fit === 'cover' && (
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#161616] to-transparent" />
                )}
                {p.tag && (
                  <span className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.14em]"
                    style={{ background: 'rgba(0,0,0,0.55)', color: store.accent, border: `1px solid ${store.accent}55`, backdropFilter: 'blur(4px)' }}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 px-4 pb-4 pt-3">
                <h3 className="line-clamp-1 leading-snug text-white transition-colors group-hover:text-[#E4BE63]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem' }}>
                  {p.name}
                </h3>
                <p className="text-[0.72rem] font-medium tracking-wide" style={{ color: store.accent }}>
                  {p.price ?? 'Enquire for price'}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {store.products.length === 0 && (
          <p className="py-20 text-center text-sm text-white/40">More pieces coming soon.</p>
        )}
      </div>

      {/* Product lightbox */}
      {open && <ProductLightbox product={open} accent={store.accent} fit={fit} onClose={() => setOpen(null)} />}
    </div>
  )
}

function ProductLightbox({
  product, accent, fit, onClose,
}: { product: ShopProduct; accent: string; fit: 'cover' | 'contain'; onClose: () => void }) {
  const [idx, setIdx] = useState(0)
  return (
    <motion.div
      role="dialog" aria-modal="true" aria-label={product.name}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Close lives on the backdrop itself rather than the full-screen wrapper.
          With it on the wrapper, any click that missed a control by a pixel
          bubbled up and shut the modal — easy to do with the small arrows. */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] sm:grid-cols-2"
        style={{ maxHeight: '88dvh' }}
      >
        <button
          onClick={onClose} aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur transition-colors hover:text-white"
        >
          <X size={16} />
        </button>
        <div className={`relative w-full overflow-hidden bg-[#0f0f0f] ${fit === 'contain' ? 'aspect-square sm:aspect-auto sm:h-full' : 'aspect-[4/5]'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[idx]} alt={product.name} className={`h-full w-full ${fit === 'contain' ? 'object-contain p-4' : 'object-cover'}`} />
          {product.images.length > 1 && (
            <>
              {/* Arrows + counter are always visible (not hover-only): on a pale
                  product shot the old bare dots were effectively invisible, so
                  there was no sign a second photo existed. */}
              <button
                onClick={() => setIdx(i => (i - 1 + product.images.length) % product.images.length)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/85"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setIdx(i => (i + 1) % product.images.length)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/85"
              >
                <ChevronRight size={18} />
              </button>

              {/* Counter — states plainly how many photos there are */}
              <span className="absolute left-3 top-3 z-10 rounded-full bg-black/65 px-2.5 py-1 text-[0.62rem] font-semibold tabular-nums text-white/90 backdrop-blur-sm">
                {idx + 1} / {product.images.length}
              </span>

              {/* Dot rail on a dark pill so it reads on light images too */}
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/65 px-3 py-2 backdrop-blur-sm">
                {product.images.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`}
                    className={`h-2 w-7 rounded-full transition-all ${i === idx ? '' : 'bg-white/40 hover:bg-white/70'}`}
                    style={i === idx ? { background: accent } : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col justify-between gap-4 overflow-y-auto p-6 sm:p-8">
          <div>
            <h2 className="font-light leading-tight text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem' }}>
              {product.name}
            </h2>
            <p className="mt-2 text-[0.85rem] font-medium" style={{ color: accent }}>
              {product.price ?? 'Enquire for price'}
            </p>
            <p className="mt-4 text-[0.82rem] leading-relaxed text-white/60">{product.description}</p>
          </div>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=rupindang@gmail.com&su=${encodeURIComponent('Shop enquiry: ' + product.name)}&body=${encodeURIComponent('Hi,\n\nI am interested in:\n' + product.name + '\n\nPlease share availability and price.\n\nRegards')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#0A0A0A] transition-all duration-200 hover:-translate-y-px hover:brightness-110"
            style={{ background: `linear-gradient(90deg, ${accent}, #E4BE63)` }}
          >
            Enquire about this piece
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

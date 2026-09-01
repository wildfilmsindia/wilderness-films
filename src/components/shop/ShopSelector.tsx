'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { STORES } from './data'
import StoreView from './StoreView'

// Two-door shop selector.
// - Initial 50/50 split; each side hovers to ~55% (the other ~45%)
// - Click "expands toward its own side" — Store 01 flies open to the right,
//   Store 02 to the left — then the store view mounts.
// - Back button reverses the motion. On mobile, panels stack instead of split.

type Active = 'olive-wood' | 'himalayan-rapture' | null

const EASE = [0.22, 0.61, 0.36, 1] as const   // smooth cubic ease-in-out
const OPEN_MS = 0.85                            // ~850ms door open
const HOVER_MS = 0.5

export default function ShopSelector() {
  const [active, setActive] = useState<Active>(null)
  const [hover, setHover] = useState<Active>(null)
  // Track viewport dimensions so we can animate pixel widths reliably.
  // (CSS transitions on percentage width have known browser quirks.)
  const [size, setSize] = useState({ w: 0, h: 0, isDesktop: true })
  useEffect(() => {
    const sync = () => setSize({
      w: window.innerWidth,
      h: window.innerHeight - 80,  // minus nav
      isDesktop: window.matchMedia('(min-width: 768px)').matches,
    })
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])
  const isDesktop = size.isDesktop

  const openStore = (slug: Active) => setActive(slug)
  const backToSelector = () => setActive(null)

  // Compute the axis-appropriate size for each panel from the state.
  // On desktop we grow *width*, on mobile *height*.
  const sizeFor = (mine: Exclude<Active, null>) => {
    if (active === mine) return '100%'
    if (active) return '0%'
    if (hover === mine) return '55%'
    if (hover) return '45%'
    return '50%'
  }

  const p01Pct = parseInt(sizeFor('olive-wood'))
  const p02Pct = 100 - p01Pct
  const dur = active ? OPEN_MS : HOVER_MS

  // Framer animates pixel dimensions frame-by-frame — reliable across browsers.
  // (CSS transitions on % width and on width via var() both have bugs.)
  const p01w = size.w > 0 && isDesktop ? (size.w * p01Pct) / 100 : 0
  const p02w = size.w > 0 && isDesktop ? (size.w * p02Pct) / 100 : 0
  const p01h = size.h > 0 && !isDesktop ? (size.h * p01Pct) / 100 : size.h
  const p02h = size.h > 0 && !isDesktop ? (size.h * p02Pct) / 100 : size.h

  const [store01, store02] = STORES

  return (
    <>
      {/* ── Two-door selector (desktop: side-by-side, mobile: stacked) ── */}
      <div
        className="fixed inset-0 z-0 overflow-hidden bg-[#0A0A0A]"
        style={{
          paddingTop: 80,
          // Once a store is picked, the store view (below) fills the viewport
          // and this selector recedes so it doesn't block scrolling.
          visibility: active ? 'hidden' : 'visible',
          pointerEvents: active ? 'none' : 'auto',
        }}
        aria-hidden={active !== null}
      >
        <div className="shop-doors relative h-[calc(100svh-80px)] w-full">

          {/* Panel 01 — OLIVE WOOD */}
          <button
            type="button"
            onClick={() => openStore('olive-wood')}
            onMouseEnter={() => setHover('olive-wood')}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover('olive-wood')}
            onBlur={() => setHover(null)}
            className="group absolute left-0 top-0 overflow-hidden border-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] md:border-r md:border-white/5"
            style={{
              width:  isDesktop ? `${p01Pct}%` : '100%',
              height: isDesktop ? '100%' : `${p01Pct}%`,
            }}
            aria-label={`Enter ${STORES[0].name}`}
          >
            {/* Image — sits on a warm-brown base so light-background product
                photos blend into the dark storefront instead of showing as
                bright white slabs. Cycles through the store's heroSlideshow. */}
            <motion.div
              className="absolute inset-0"
              style={{ background: '#1a120a' }}
              animate={{ scale: hover === 'olive-wood' ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <HeroSlideshow
                frames={store01.heroSlideshow ?? [store01.hero]}
                className="opacity-70 mix-blend-luminosity"
              />
            </motion.div>
            {/* Gradient wash — heavier at the bottom where the text sits */}
            <div aria-hidden className="absolute inset-0" style={{
              background:
                'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.92) 100%)',
            }} />

            {/* Text */}
            <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-12">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.32em]" style={{ color: store01.accent }}>
                Store 01
              </p>
              <h2 className="mt-2 font-light leading-none text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5.5vw, 4.4rem)' }}>
                {store01.name}
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/75 sm:text-base">{store01.tagline}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-transform group-hover:translate-x-1"
                style={{ color: store01.accent }}>
                Enter store <ArrowRight size={14} />
              </span>
            </div>
          </button>

          {/* Panel 02 — HIMALAYAN RAPTURE */}
          <button
            type="button"
            onClick={() => openStore('himalayan-rapture')}
            onMouseEnter={() => setHover('himalayan-rapture')}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover('himalayan-rapture')}
            onBlur={() => setHover(null)}
            className="group absolute bottom-0 right-0 overflow-hidden border-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8FB4]"
            style={{
              width:  isDesktop ? `${p02Pct}%` : '100%',
              height: isDesktop ? '100%' : `${p02Pct}%`,
            }}
            aria-label={`Enter ${store02.name}`}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: '#0a1420' }}
              animate={{ scale: hover === 'himalayan-rapture' ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <HeroSlideshow
                frames={store02.heroSlideshow ?? [store02.hero]}
                className="opacity-75"
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0" style={{
              background:
                'linear-gradient(180deg, rgba(10,10,10,0.30) 0%, rgba(10,10,10,0.50) 45%, rgba(10,10,10,0.90) 100%)',
            }} />

            <div className="relative z-10 flex h-full flex-col items-start justify-end p-6 sm:items-end sm:p-12 sm:text-right">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.32em]" style={{ color: store02.accent }}>
                Store 02
              </p>
              <h2 className="mt-2 font-light leading-none text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5.5vw, 4.4rem)' }}>
                {store02.name}
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/75 sm:text-base">{store02.tagline}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-transform group-hover:-translate-x-1"
                style={{ color: store02.accent }}>
                Enter store <ArrowRight size={14} />
              </span>
            </div>
          </button>

          {/* Centre seam — sits exactly on the panel boundary so it moves
              in sync with the doors as they hover-shift or open. */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden -translate-x-1/2 md:block"
            style={{
              top: 0,
              bottom: 0,
              width: 1,
              left:  isDesktop ? `${p01Pct}%` : undefined,
              // Fade out when a store is fully open (seam meaningless then)
              opacity: active ? 0 : 1,
              background: 'linear-gradient(180deg, transparent, rgba(212,168,67,0.35), transparent)',
            }}
          />
          {/* Mobile seam (horizontal) — sits on the boundary between stacked panels */}
          <div
            aria-hidden
            className="pointer-events-none absolute -translate-y-1/2 md:hidden"
            style={{
              left: 0,
              right: 0,
              height: 1,
              top:  !isDesktop ? `${p01Pct}%` : undefined,
              opacity: active ? 0 : 1,
              background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.35), transparent)',
            }}
          />
        </div>
      </div>

      {/* ── Store views layered above once picked ── */}
      {/* end of selector */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.35, ease: EASE }}
            className="relative z-10"
          >
            <StoreView
              store={active === 'olive-wood' ? store01 : store02}
              onBack={backToSelector}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Cross-fades between a list of images every 4s so the storefront hero panel
// feels alive. Falls back to a single static image when only one frame exists.
function HeroSlideshow({ frames, className }: { frames: string[]; className?: string }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (frames.length <= 1) return
    const id = setInterval(() => setIdx(i => (i + 1) % frames.length), 4000)
    return () => clearInterval(id)
  }, [frames.length])
  return (
    <>
      {frames.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          fetchPriority={i === 0 ? 'high' : 'low'}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${className ?? ''}`}
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
    </>
  )
}

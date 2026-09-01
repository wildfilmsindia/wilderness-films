'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Share2, Check, Mail, BadgeCheck } from 'lucide-react'
import GearPlaceholder from './GearPlaceholder'
import { enquiryHref, type Item } from './data'

export default function ProductDetail({
  item, onClose, onPrev, onNext, position, related = [], onOpenRelated,
}: {
  item: Item | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  position?: { index: number; total: number }
  related?: Item[]
  onOpenRelated?: (item: Item) => void
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const [specsOpen, setSpecsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { setImgIdx(0); setSpecsOpen(false); setCopied(false) }, [item])

  useEffect(() => {
    if (!item) return
    const html = document.documentElement
    const prevH = html.style.overflow, prevB = document.body.style.overflow
    html.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'
    const imgCount = item.images.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      // ← / → step through this item's photos; ⌥/shift + ← → jumps between items
      if (e.key === 'ArrowLeft') {
        if ((e.shiftKey || e.altKey) && onPrev) onPrev()
        else if (imgCount > 1) setImgIdx(i => (i - 1 + imgCount) % imgCount)
      }
      if (e.key === 'ArrowRight') {
        if ((e.shiftKey || e.altKey) && onNext) onNext()
        else if (imgCount > 1) setImgIdx(i => (i + 1) % imgCount)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      html.style.overflow = prevH; document.body.style.overflow = prevB
    }
  }, [item, onClose, onPrev, onNext])

  const share = async () => {
    const url = `${window.location.origin}/equipment/${item!.id}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for browsers/contexts where the async clipboard is unavailable
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* give up silently */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const specRows = item
    ? ([
        ['Brand', item.brand],
        ['Category', item.category],
        item.mount ? ['Mount', item.mount] : null,
      ].filter(Boolean) as [string, string][])
    : []

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          {/* Center popup — scales in from item click, no longer slides from the side */}
          <motion.aside
            role="dialog" aria-modal="true" aria-label={item.name}
            className="relative flex max-h-[92svh] w-full max-w-[560px] flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'tween', duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header — back, position counter, and prev/next item stepper */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-[#0d0d0d]/90 px-5 py-4 backdrop-blur">
              <button onClick={onClose} className="inline-flex min-h-[44px] items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-[#D4A843]">
                <ArrowLeft size={16} /> <span className="hidden xs:inline sm:inline">Back to listings</span><span className="sm:hidden">Back</span>
              </button>

              <div className="flex items-center gap-1.5">
                {position && (
                  <span className="mr-1 hidden text-[0.62rem] tabular-nums text-white/35 sm:inline">
                    {position.index + 1} of {position.total}
                  </span>
                )}
                <button
                  onClick={onPrev} disabled={!onPrev} aria-label="Previous item"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors enabled:hover:border-[#D4A843]/40 enabled:hover:text-[#D4A843] disabled:opacity-25"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={onNext} disabled={!onNext} aria-label="Next item"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors enabled:hover:border-[#D4A843]/40 enabled:hover:text-[#D4A843] disabled:opacity-25"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-5 pb-10">
              {/* Gallery */}
              <div className="group/gal overflow-hidden rounded-xl bg-[#0f0f0f] ring-1 ring-white/10">
                <div className="relative aspect-[3/2] w-full">
                  {item.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[Math.min(imgIdx, item.images.length - 1)]} alt={item.name}
                      decoding="async" className="h-full w-full object-contain" />
                  ) : (
                    <GearPlaceholder brand={item.brand} large />
                  )}
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIdx(i => (i - 1 + item.images.length) % item.images.length)}
                        aria-label="Previous photo"
                        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover/gal:opacity-100"
                      >
                        <ChevronLeft size={17} />
                      </button>
                      <button
                        onClick={() => setImgIdx(i => (i + 1) % item.images.length)}
                        aria-label="Next photo"
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover/gal:opacity-100"
                      >
                        <ChevronRight size={17} />
                      </button>
                      <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[0.62rem] font-medium tabular-nums text-white backdrop-blur-sm">
                        {Math.min(imgIdx, item.images.length - 1) + 1} / {item.images.length}
                      </div>
                    </>
                  )}
                </div>
                {item.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {item.images.map((src, i) => (
                      <button key={src} onClick={() => setImgIdx(i)} aria-label={`Photo ${i + 1}`}
                        className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${i === imgIdx ? 'opacity-100 ring-2 ring-[#D4A843]' : 'opacity-50 ring-1 ring-white/10 hover:opacity-100'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title + condition + price */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-normal leading-tight text-white"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                    {item.name}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[0.85rem] font-medium text-[#D4A843]">Price on enquiry</span>
                </div>
              </div>

              {item.description && (
                <p className="text-[0.82rem] leading-7 text-white/60">{item.description}</p>
              )}

              {/* Specs */}
              <div className="rounded-xl border border-white/5">
                <button onClick={() => setSpecsOpen(v => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Specifications
                  <ChevronDown size={16} className={`text-white/40 transition-transform ${specsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {specsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }} className="overflow-hidden"
                    >
                      <div className="px-4 pb-3">
                        {specRows.map(([k, v], i) => (
                          <div key={k} className={`flex justify-between gap-4 rounded px-2 py-2.5 ${i % 2 ? 'bg-white/[0.02]' : ''}`}>
                            <span className="text-[0.66rem] uppercase tracking-wider text-white/40">{k}</span>
                            <span className="text-right text-[0.8rem] text-white/90">{v}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <a href={enquiryHref(item.name)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E4BE63] px-5 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#0A0A0A] transition-all duration-200 hover:-translate-y-px hover:brightness-110">
                  <Mail size={15} /> Enquire about this item
                </a>
                <button onClick={share} aria-label="Copy link to this item"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-white/[0.12] px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/70 transition-all duration-200 hover:-translate-y-px hover:border-[#D4A843]/40 hover:text-[#D4A843]">
                  {copied ? <><Check size={15} /> Link copied!</> : <><Share2 size={15} /> Share</>}
                </button>
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3">
                <BadgeCheck size={17} className="shrink-0 text-emerald-400" />
                <span className="text-[0.72rem] leading-snug text-white/70">
                  Wilderness Films India — established 1987 · verified professional dealer
                </span>
              </div>

              {/* Related items — keeps browsing going without closing the panel */}
              {related.length > 0 && (
                <div className="border-t border-white/5 pt-5">
                  <h3 className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/40">
                    More in {item.category}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {related.map(rel => (
                      <button
                        key={rel.id}
                        onClick={() => onOpenRelated?.(rel)}
                        className="group/rel flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#141414] p-2 text-left transition-colors hover:border-[#D4A843]/25 hover:bg-[#181818]"
                      >
                        <div className="h-11 w-16 shrink-0 overflow-hidden rounded bg-[#0f0f0f]">
                          {rel.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={rel.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <GearPlaceholder brand={rel.brand} />
                          )}
                        </div>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.8rem] text-white/85 transition-colors group-hover/rel:text-[#E4BE63]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {rel.name}
                          </span>
                          <span className="block truncate text-[0.64rem] text-white/35">{rel.brand}</span>
                        </span>
                        <ChevronRight size={14} className="shrink-0 text-white/25 transition-transform group-hover/rel:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

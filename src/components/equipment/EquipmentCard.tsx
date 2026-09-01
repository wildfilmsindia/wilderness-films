'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import GearPlaceholder from './GearPlaceholder'
import { type Item } from './data'

export default function EquipmentCard({
  item, index, onOpen, onPreload,
}: { item: Item; index: number; onOpen: (item: Item) => void; onPreload?: (item: Item) => void }) {
  const [quickView, setQuickView] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const img = item.images[0]

  const startHover = () => {
    onPreload?.(item)
    hoverTimer.current = setTimeout(() => setQuickView(true), 500)
  }
  const endHover = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setQuickView(false) }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161616] transition-[box-shadow,border-color] duration-300 hover:border-[#D4A843]/25 hover:shadow-[0_0_24px_rgba(212,168,67,0.16)]"
      onClick={() => onOpen(item)}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0f0f0f]">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <GearPlaceholder brand={item.brand} />
        )}
        {/* bottom gradient fade into card body */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#161616] to-transparent" />

        {/* Quick-view popover (desktop, after 500ms hover) */}
        {quickView && item.description && (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 hidden rounded-lg border border-[#D4A843]/25 bg-black/85 p-2.5 backdrop-blur-sm md:block">
            <p className="text-[0.68rem] leading-snug text-white/80">
              {item.description.slice(0, 100)}{item.description.length > 100 ? '…' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4 pt-3">
        {/* Real link so crawlers (and ⌘-click) reach the item page; a plain
            click is intercepted and opens the quick-view drawer instead. */}
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.14rem' }}
          className="line-clamp-2 font-semibold leading-snug">
          <a
            href={`/equipment/${item.id}`}
            onClick={e => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
              e.preventDefault()
            }}
            className="text-white no-underline transition-colors group-hover:text-[#E4BE63]"
          >
            {item.name}
          </a>
        </h3>
        {item.description && (
          <p className="line-clamp-1 text-[0.72rem] text-white/40">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[0.75rem] font-semibold tracking-wide text-[#D4A843]">
            Price on enquiry
          </span>
          <span className="inline-flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/45 opacity-0 transition-all duration-300 group-hover:text-[#D4A843] group-hover:opacity-100">
            View details <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

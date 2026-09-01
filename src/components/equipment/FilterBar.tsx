'use client'

import { motion } from 'framer-motion'

export default function FilterBar({
  categories, active, onChange, counts,
}: {
  categories: string[]
  active: string
  onChange: (c: string) => void
  counts: Record<string, number>
}) {
  const pills = ['All', ...categories]
  return (
    <div className="sticky top-[72px] z-30 -mx-4 border-b border-white/5 bg-[#0A0A0A]/85 px-4 py-3 backdrop-blur-md">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pills.map(cat => {
          const isActive = active === cat
          return (
            <motion.button
              key={cat}
              onClick={() => onChange(cat)}
              whileTap={{ scale: 0.93 }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[0.72rem] font-medium transition-colors ${
                isActive
                  ? 'border-transparent bg-[#D4A843] text-[#0A0A0A]'
                  : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/90'
              }`}
            >
              {cat}
              <span className={`text-[0.62rem] ${isActive ? 'text-[#0A0A0A]/60' : 'text-white/30'}`}>
                {counts[cat] ?? 0}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

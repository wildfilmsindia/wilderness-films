'use client'

import { Search, X } from 'lucide-react'

export default function SearchBar({
  value, onChange, placeholder = 'Search cameras, lenses, brands…',
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="group relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#D4A843]"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search equipment"
        className="w-full rounded-full border border-white/10 bg-[#141414] py-3.5 pl-12 pr-12 text-sm text-white/90 outline-none transition-all placeholder:text-white/30 focus:border-[#D4A843]/60 focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}

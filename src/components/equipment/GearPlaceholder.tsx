import { Aperture } from 'lucide-react'

// Styled dark placeholder for items without a photo: faint grid + brand wordmark
// behind a lens/aperture icon. Used on cards and in the detail drawer.
export default function GearPlaceholder({
  brand, large = false,
}: { brand: string; large?: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(120% 120% at 50% 30%, #1c1a15 0%, #0d0d0d 70%)' }}
    >
      {/* faint grid / film-strip texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#D4A843 1px, transparent 1px), linear-gradient(90deg, #D4A843 1px, transparent 1px)',
          backgroundSize: large ? '48px 48px' : '30px 30px',
        }}
      />
      {/* brand wordmark, faded */}
      <span
        aria-hidden
        className="absolute px-4 text-center font-semibold uppercase leading-none tracking-[0.14em]"
        style={{
          color: 'rgba(212,168,67,0.10)',
          fontSize: large ? 'clamp(2rem, 6vw, 4rem)' : '1.5rem',
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {brand}
      </span>
      <Aperture
        aria-hidden
        strokeWidth={1}
        className="relative"
        style={{ color: 'rgba(212,168,67,0.28)', width: large ? 88 : 44, height: large ? 88 : 44 }}
      />
      <span
        className="absolute bottom-2 text-[0.5rem] font-semibold uppercase tracking-[0.22em]"
        style={{ color: 'rgba(212,168,67,0.35)' }}
      >
        Image on request
      </span>
    </div>
  )
}

import type { Metadata } from 'next'
import { SITE } from '@/lib/seo'

// Metadata for the /equipment index. The client list page can't export
// metadata itself; individual /equipment/[slug] pages override this via
// their own generateMetadata.
export const metadata: Metadata = {
  title: 'Equipment for Sale & Rental — Cine & Broadcast Gear',
  description:
    'Browse 240+ professional cine and broadcast equipment items for sale and hire from Wilderness Films India — cameras, lenses, matte boxes, monitors, recorders and tripods from ARRI, Sony, Canon, Fujinon and Zeiss.',
  keywords: [
    'cine equipment for sale india', 'broadcast equipment india', 'used camera india',
    'ARRI lens india', 'Fujinon lens india', 'Sony camera india', 'PL mount lens india',
    'equipment hire india', 'used cine gear', 'camera rental india',
  ],
  alternates: { canonical: `${SITE}/equipment` },
  openGraph: {
    title: 'Equipment for Sale & Rental — Wilderness Films India',
    description:
      '240+ professional cine and broadcast equipment items for sale and hire — cameras, lenses, monitors and more from ARRI, Sony, Canon, Fujinon and Zeiss.',
    url: `${SITE}/equipment`,
  },
}

export default function EquipmentLayout({ children }: { children: React.ReactNode }) {
  return children
}

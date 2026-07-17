'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Navigation from '@/components/layout/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import WildlifeSection from '@/components/sections/WildlifeSection'
import FilmsSection from '@/components/sections/FilmsSection'
import ClientsSection from '@/components/sections/ClientsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to hash once loader is dismissed
  useEffect(() => {
    if (isLoading) return
    const hash = window.location.hash
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [isLoading])

  return (
    <>
      {/* Content is always rendered so it is server-side rendered and fully
          crawlable by search engines and AI answer engines. The loading
          screen is a fixed overlay (z-index 10000) on top, which fades out. */}
      <Navigation />
      <main>
        <HeroSection />
        <WildlifeSection />
        <FilmsSection />
        <ClientsSection />
        <ContactSection />
      </main>
      <Footer />

      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'


interface ParticleProps {
  delay: number
  duration: number
  left: string
  size: number
  color: string
  riseY: number
  driftX: number
}

function FloatingParticle({ delay, duration, left, size, color, riseY, driftX }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left, bottom: '-10px', width: size, height: size, background: color, opacity: 0 }}
      animate={{ y: [0, -riseY], opacity: [0, 0.5, 0], x: [0, driftX] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  )
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // React doesn't reliably set the muted attribute on video elements — set it directly
    v.muted = true
    v.play().catch(() => {
      // Autoplay blocked (e.g. low-power mode) — try again on first user interaction
      const resume = () => { v.play().catch(() => {}); document.removeEventListener('touchstart', resume) }
      document.addEventListener('touchstart', resume, { once: true })
    })
  }, [])

  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 0.8,
      duration: 6 + Math.random() * 6,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.8,
      color: Math.random() > 0.5 ? '#C9A84C' : '#6BAE4A',
      riseY: Math.random() * 380 + 180,
      driftX: (Math.random() - 0.5) * 80,
    }))
  )


  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '680px' }}
    >
      {/* ── Background video ── */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'brightness(0.68) saturate(0.75)',
            pointerEvents: 'none',
          }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Gradient overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(3,3,3,0.65) 0%, rgba(3,3,3,0.38) 35%, rgba(3,3,3,0.10) 65%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(3,3,3,0.75) 0%, rgba(3,3,3,0.2) 30%, transparent 55%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(3,3,3,0.55) 0%, transparent 22%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 60%, rgba(201,168,76,0.06) 0%, transparent 60%)',
        }}
      />

      {/* ── Fog layer ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 45%, rgba(200,210,220,0.04) 70%, rgba(180,195,210,0.07) 100%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Subtle grid ── */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {particles.map((p) => (
          <FloatingParticle key={p.id} delay={p.delay} duration={p.duration} left={p.left} size={p.size} color={p.color} riseY={p.riseY} driftX={p.driftX} />
        ))}
      </div>

      {/* ── Hero content ──
          No x/y transforms on this wrapper — content is absolutely stable.
          Mouse parallax removed: it caused visible text drift/shake.        */}
      <div
        className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24"
        style={{ maxWidth: '680px', width: '100%', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Overline */}
        <motion.p
          className="text-overline mb-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Wilderness Films India — Est. 1987
        </motion.p>

        {/* Title block — one semantic <h1> ("India: A Visual Mapping"), three
            animated lines inside it. Single h1 for SEO; animation unchanged. */}
        <h1 style={{ margin: 0, marginBottom: '35px', fontWeight: 300 }}>

          {/* Line 1: "India:" */}
          <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
            <motion.span
              className="font-display text-glow-gold"
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(3.2rem, 7.5vw, 6.6rem)',
                fontWeight: 300,
                letterSpacing: '0.02em',
                lineHeight: 1,
                color: '#F0EDE8',
                display: 'block',
              }}
            >
              India:
            </motion.span>
          </span>

          {/* Line 2: "A Visual" */}
          <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
            <motion.span
              className="font-display"
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(2rem, 4.6vw, 4.2rem)',
                fontWeight: 300,
                letterSpacing: '0.04em',
                lineHeight: 1,
                color: 'var(--color-gold)',
                fontStyle: 'italic',
                display: 'block',
              }}
            >
              A Visual
            </motion.span>
          </span>

          {/* Line 3: "Mapping" — paddingBottom catches italic 'g' descender */}
          <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.32em' }}>
            <motion.span
              className="font-display"
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.85, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(2rem, 4.6vw, 4.2rem)',
                fontWeight: 300,
                letterSpacing: '0.04em',
                lineHeight: 1,
                color: 'var(--color-gold)',
                fontStyle: 'italic',
                display: 'block',
              }}
            >
              Mapping
            </motion.span>
          </span>

        </h1>

        {/* Divider + tagline */}
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: 'left' }}
        >
          <div className="h-px w-12" style={{ background: 'var(--color-gold)' }} />
          <p
            className="font-body"
            style={{
              fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
              color: 'rgba(240,237,232,0.82)',
              maxWidth: '360px',
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            South Asia’s largest factual visual archive and production house.
          </p>
        </motion.div>

      </div>

    </section>
  )
}

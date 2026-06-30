'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import Link from 'next/link'

// ── Design tokens (Conservation palette) ────────────────────────
const BG     = '#030303'
const TEXT   = '#F0EDE8'
const GOLD   = 'rgba(201,168,76,1)'
const GOLD55 = 'rgba(201,168,76,0.55)'
const GOLD35 = 'rgba(201,168,76,0.35)'
const DIM    = 'rgba(240,237,232,0.42)'
const DIMLO  = 'rgba(240,237,232,0.22)'
const BORDER = '1px solid rgba(255,255,255,0.05)'
const SERIF  = '"Cormorant Garamond", Georgia, serif'
const SANS   = '"Outfit", -apple-system, sans-serif'
const MONO   = '"Space Mono", monospace'

// ── Fade reveal ──────────────────────────────────────────────────
function Fade({ children, delay = 0, y = 0 }: {
  children: React.ReactNode; delay?: number; y?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}


// ── Counter hook ─────────────────────────────────────────────────
function useCounter(target: number, inView: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: v => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, target])
  return n
}

// ────────────────────────────────────────────────────────────────
// 1 — HERO
// ────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      position: 'relative', background: BG, borderBottom: BORDER, textAlign: 'center', overflow: 'hidden',
      padding: 'clamp(100px, 22vw, 160px) clamp(20px, 6vw, 48px) clamp(60px, 10vw, 100px)',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.05) 0%, transparent 65%)',
      }} />
      {/* Top rule */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.20), transparent)',
      }} />

      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ fontFamily: MONO, fontSize: '0.50rem', letterSpacing: '0.32em',
          textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)',
          marginBottom: '24px', position: 'relative' }}
      >
        Wilderness Films India — Est. 1987
      </motion.p>

      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <motion.h1
          initial={{ y: '105%' }} animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 300,
            color: TEXT, lineHeight: 1, letterSpacing: '0.16em' }}
        >
          About Us
        </motion.h1>
      </div>

      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ height: '1px', width: '60px', background: 'rgba(201,168,76,0.45)',
          margin: '28px auto', transformOrigin: 'center', position: 'relative' }}
      />

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        style={{ fontFamily: SERIF, fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)', fontWeight: 300,
          fontStyle: 'italic', color: 'rgba(240,237,232,0.35)',
          letterSpacing: '0.04em', position: 'relative' }}
      >
        People, places, monuments, traditions, cultures, wildlife, festivals,
        dances, music — and many more rabbit holes.
      </motion.p>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// 2 — MISSION
// ────────────────────────────────────────────────────────────────
function MissionSection() {
  return (
    <section style={{ background: BG, borderBottom: BORDER,
      padding: 'clamp(1.75rem,3.5vw,2.75rem) clamp(1.5rem,6vw,4rem)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <Fade>
          <p style={{ fontFamily: SANS, fontSize: '1.125rem', fontWeight: 300,
            color: DIM, lineHeight: 1.85 }}>
            For over 37 years, we have been building South Asia's largest factual visual archive
            while producing films and visual stories that document India for posterity. From rare
            wildlife footage to cultural, environmental, and historical documentation, our work
            connects memory, storytelling, and moving images at scale — creating visual time
            capsules on just about everything South Asian.
          </p>
        </Fade>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// 3 — STATS
// ────────────────────────────────────────────────────────────────
const STATS = [
  { target: 37,  suffix: '+',     label: 'Years in the Field' },
  { target: 150, suffix: ',000+', label: 'Hours of Footage' },
  { target: 140, suffix: ',000+', label: 'Videos Published' },
  { target: 5,   suffix: 'M+',   label: 'YouTube Subscribers' },
]

function StatCard({ s, i }: { s: typeof STATS[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const n = useCounter(s.target, inView)
  return (
    <Fade delay={i * 0.08}>
      <div ref={ref} style={{
        padding: 'clamp(1.75rem,3.5vw,2.5rem) clamp(1.5rem,3vw,2rem)',
        borderRight: i < 3 ? BORDER : 'none',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300,
          color: GOLD, lineHeight: 1, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
          {n}{s.suffix}
        </p>
        <p style={{ fontFamily: MONO, fontSize: '0.46rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: DIMLO }}>
          {s.label}
        </p>
      </div>
    </Fade>
  )
}

function StatsSection() {
  return (
    <section style={{ background: BG, borderBottom: BORDER }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}
        className="grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} s={s} i={i} />
        ))}
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// 4 — VALUES GRID
// ────────────────────────────────────────────────────────────────
const VALUES = [
  {
    title: 'What We Hold',
    body: 'Our collection spans wildlife, landscapes, culture, communities, heritage, and current affairs — built over decades and continuously growing.',
  },
  {
    title: 'What We Create',
    body: 'Factual films and visual content for television, digital platforms, and institutions. Documentary production, footage licensing, and short-form storytelling.',
  },
  {
    title: 'Why It Matters',
    body: 'Many Indians did not know their own country. We document India honestly — its heritage, culture, landscapes, and living histories — for Indians and the world.',
  },
]

function ValuesSection() {
  return (
    <section style={{ background: BG, borderBottom: BORDER,
      padding: 'clamp(1.75rem,3.5vw,2.75rem) clamp(1.5rem,6vw,4rem)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Fade>
          <p style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', color: GOLD55, marginBottom: '1.25rem' }}>
            What We Do
          </p>
        </Fade>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderTop: BORDER }}>
          {VALUES.map((v, i) => (
            <Fade key={v.title} delay={i * 0.1}>
              <div style={{
                padding: 'clamp(1.25rem,3vw,1.75rem) 0',
                paddingRight: i < 2 ? 'clamp(1.5rem,3vw,2.5rem)' : '0',
                paddingLeft: i > 0 ? 'clamp(1.5rem,3vw,2.5rem)' : '0',
                borderRight: i < 2 ? BORDER : 'none',
              }}>
                <p style={{ fontFamily: SERIF, fontSize: '1.25rem', fontWeight: 300,
                  color: TEXT, marginBottom: '1rem', letterSpacing: '0.01em' }}>
                  {v.title}
                </p>
                <div style={{ width: '24px', height: '1px', background: GOLD35, marginBottom: '1rem' }} />
                <p style={{ fontFamily: SANS, fontSize: '0.875rem', fontWeight: 300,
                  color: DIM, lineHeight: 1.8 }}>
                  {v.body}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// 5b — MD SHOWCASE
// ────────────────────────────────────────────────────────────────
const MD_ROLES = ['Founder', 'Filmmaker', 'Mountaineer', 'Naturalist', 'Photographer', 'Entrepreneur']

function MDSection() {
  return (
    <section style={{
      background: BG, borderBottom: BORDER, position: 'relative', overflow: 'hidden',
      padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,6vw,4rem)',
    }}>
      {/* Richer ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 60%, rgba(201,168,76,0.07) 0%, transparent 50%)',
      }} />
      {/* Large decorative year — faint watermark */}
      <div style={{
        position: 'absolute', right: 'clamp(1rem,4vw,3rem)', top: '50%', transform: 'translateY(-50%)',
        fontFamily: SERIF, fontSize: 'clamp(6rem,18vw,18rem)', fontWeight: 300,
        color: 'transparent', WebkitTextStroke: '0.5px rgba(201,168,76,0.22)',
        lineHeight: 1, pointerEvents: 'none',
        userSelect: 'none', letterSpacing: '-0.04em',
      }}>
        1987
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* Top bar — label + roles as chips */}
        <Fade>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            borderBottom: `1px solid rgba(201,168,76,0.14)`, paddingBottom: '1.25rem', marginBottom: '1.5rem',
            flexWrap: 'wrap', gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3px', height: '2rem', background: GOLD, borderRadius: '2px', flexShrink: 0 }} />
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300,
                color: GOLD, letterSpacing: '0.02em' }}>Managing Director</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              {MD_ROLES.map(r => (
                <span key={r} style={{
                  fontFamily: MONO, fontSize: '0.48rem', letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: '#C9A84C',
                  border: '1px solid rgba(201,168,76,0.45)', borderRadius: '2px',
                  padding: '4px 10px',
                }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </Fade>

        {/* Giant name + portrait */}
        <div style={{ display: 'flex', alignItems: 'flex-start',
          gap: 'clamp(1rem,3vw,2.5rem)', marginBottom: '1.5rem' }}>

          {/* Line + photo — line stays in place, photo sits in front of it */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {/* Vertical gold line — original position, runs full height */}
            <motion.div
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
              viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '2px',
                background: `linear-gradient(180deg, ${GOLD}, rgba(201,168,76,0.1))`,
                transformOrigin: 'top',
              }}
            />
            {/* Portrait — in front of line */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginLeft: '14px',
                width: 'clamp(200px, 28vw, 380px)',
                borderRadius: '3px',
                overflow: 'hidden',
                border: `1px solid rgba(201,168,76,0.18)`,
                boxShadow: '-4px 0 24px rgba(0,0,0,0.6), 0 20px 60px rgba(0,0,0,0.5)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <img
                src="/rupinD.jpg"
                alt="Rupin Dang"
                style={{
                  width: '100%', height: 'auto',
                  filter: 'brightness(0.92) saturate(0.85)',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(3,3,3,0.45) 0%, transparent 45%)',
              }} />
            </motion.div>
          </div>

          {/* Name */}
          <div>
            <div style={{ overflow: 'hidden' }}>
              <motion.p
                initial={{ y: '105%' }} whileInView={{ y: 0 }}
                viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: SERIF, fontSize: 'clamp(4.5rem, 11vw, 10rem)', fontWeight: 300,
                  color: TEXT, lineHeight: 0.88, letterSpacing: '-0.01em' }}
              >
                Rupin
              </motion.p>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.p
                initial={{ y: '105%' }} whileInView={{ y: 0 }}
                viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: SERIF, fontSize: 'clamp(4.5rem, 11vw, 10rem)', fontWeight: 300,
                  fontStyle: 'italic', color: GOLD, lineHeight: 0.88, letterSpacing: '-0.01em' }}
              >
                Dang
              </motion.p>
            </div>
          </div>

        </div>

        {/* Pull quote */}
        <Fade delay={0.05}>
          <div style={{
            borderLeft: `2px solid ${GOLD35}`, paddingLeft: '1.25rem', marginBottom: '1.75rem',
          }}>
            <p style={{ fontFamily: SERIF, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', fontWeight: 300,
              fontStyle: 'italic', color: 'rgba(240,237,232,0.35)', lineHeight: 1.7, letterSpacing: '0.01em' }}>
              "Listed in the Limca Book of Records as the youngest filmmaker in India."
            </p>
          </div>
        </Fade>

        {/* Bio — two columns */}
        <div style={{ borderTop: BORDER, paddingTop: '1.75rem' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <Fade delay={0.1}>
            <p style={{ fontFamily: SANS, fontSize: '1rem', fontWeight: 300, color: DIM, lineHeight: 1.9 }}>
              Rupin Dang is a curious blend of filmmaker, writer, mountaineer, naturalist,
              photographer & entrepreneur. Listed in the Limca Book of Records at one time as
              the youngest filmmaker in India, Rupin subsequently studied and taught at
              Dartmouth College in New Hampshire.
            </p>
          </Fade>
          <Fade delay={0.18}>
            <p style={{ fontFamily: SANS, fontSize: '1rem', fontWeight: 300, color: DIM, lineHeight: 1.9 }}>
              He founded Wilderness Films India in 1987 and has successfully established it as
              a leading broadcast and television services company in north India. Its greatest
              assets lie in an extensive archive of television and stills content — a library
              of South Asian footage unparalleled in subject matter and technical quality.
            </p>
          </Fade>
        </div>

      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// 5c — PEOPLE ROSTER
// ────────────────────────────────────────────────────────────────
const PEOPLE: { name: string; photo?: string }[] = [
  { name: 'Randhir Singh', photo: '/randhir-singh.jpg' },
  { name: 'Anirudha Samal',    photo: '/anirudha-samal.jpg' },
  { name: 'Prashant Samal',    photo: '/prashant-samal.jpg' },
  { name: 'Pravat Samal',      photo: '/pravat-samal.jpg' },
  { name: 'Sashikanta Samal',  photo: '/sashikanta-samal.jpg' },
  { name: 'Amit Patnaik',      photo: '/amit-patnaik.jpg' },
  { name: 'Dharin Leisan',     photo: '/dharin-leisan.jpg' },
  { name: 'Vikash Kumar',      photo: '/vikash-kumar.jpg' },
  { name: 'Sanya Saha',        photo: '/sanya-saha.jpg' },
  { name: 'Amrit Srivastava', photo: '/amrit-srivastava.jpg' },
  { name: 'Avi Sharma',        photo: '/avipfp.jpg' },
  { name: 'Bagini Dang', photo: '/bagini-dang.jpg' },
  { name: 'Vibha Dang',        photo: '/vibha-dang.jpg' },
  { name: 'Dharanshi Dang',    photo: '/dharanshi-dang.jpg' },
]

function PeopleSection() {
  return (
    <section style={{ background: BG, borderBottom: BORDER,
      padding: 'clamp(1.75rem,3.5vw,2.75rem) clamp(1.5rem,6vw,4rem)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <Fade>
          <p style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', color: GOLD55, marginBottom: '0.75rem' }}>
            Our People
          </p>
        </Fade>
        <Fade delay={0.05}>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300,
            color: TEXT, letterSpacing: '0.01em', marginBottom: '1.75rem', lineHeight: 1.1 }}>
            The Faces Behind{' '}
            <em style={{ color: GOLD }}>Every Frame</em>
          </h2>
        </Fade>

        {(() => {
          const withPhoto = [
            { name: 'John Robert', photo: '/john-robert.jpg' },
            ...PEOPLE.filter(p => p.photo).map(p => ({ name: p.name, photo: p.photo })),
            ...DOGS.map(d => ({ name: d.name, photo: d.photo })),
          ]
          const withoutPhoto = PEOPLE.filter(p => !p.photo)
          let nameIdx = withPhoto.length

          return (
            <>
              {/* Photo grid */}
              <div className="grid grid-cols-4 md:grid-cols-9" style={{
                gap: '6px',
                marginBottom: '24px',
              }}>
                {withPhoto.map(person => (
                  <div key={person.name} style={{
                    border: BORDER,
                    borderRadius: '2px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={person.photo}
                        alt={person.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <p style={{
                      fontFamily: SERIF,
                      fontSize: '0.82rem',
                      fontWeight: 300,
                      color: 'rgba(240,237,232,0.75)',
                      textAlign: 'center',
                      padding: '0.5rem 0.5rem 0.6rem',
                      lineHeight: 1.2,
                    }}>
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Name-only list */}
              {withoutPhoto.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                  borderTop: BORDER, borderLeft: BORDER,
                }}>
                  {withoutPhoto.map(person => (
                    <Fade key={person.name} delay={0.05}>
                      <div style={{
                        borderBottom: BORDER, borderRight: BORDER,
                        padding: 'clamp(1rem,2.5vw,1.4rem) clamp(1rem,2vw,1.5rem)',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                      }}>
                        <span style={{ fontFamily: MONO, fontSize: '0.38rem', color: GOLD35,
                          letterSpacing: '0.1em', flexShrink: 0 }}>
                          {String(++nameIdx).padStart(2, '0')}
                        </span>
                        <p style={{ fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 300,
                          color: 'rgba(240,237,232,0.75)', letterSpacing: '0.01em', lineHeight: 1 }}>
                          {person.name}
                        </p>
                      </div>
                    </Fade>
                  ))}
                </div>
              )}
            </>
          )
        })()}

      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
const DOGS = [
  { name: 'Niffler',  title: 'CHIEF CHAOS\nCOORDINATOR',       photo: '/niffler.jpg' },
  { name: 'Griffin',  title: 'HEAD OF OFFICE\nSECURITY',        photo: '/griffin.jpg' },
  { name: 'Raven',    title: 'DIRECTOR OF FIRST\nIMPRESSIONS',  photo: '/raven.jpg' },
  { name: 'Baghera',  title: 'CHIEF MOOD\nOFFICER',             photo: '/baghera.jpg' },
]


// ────────────────────────────────────────────────────────────────
// 7 — CTA
// ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{ background: BG, borderBottom: BORDER,
      padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,6vw,4rem)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.05) 0%, transparent 60%)',
      }} />
      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <Fade>
          <p style={{ fontFamily: MONO, fontSize: '0.50rem', letterSpacing: '0.32em',
            textTransform: 'uppercase', color: GOLD55, marginBottom: '1.5rem' }}>
            Get In Touch
          </p>
        </Fade>

        <Fade delay={0.1} y={16}>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 300,
            color: TEXT, lineHeight: 1.15, letterSpacing: '0.01em', marginBottom: '1.25rem' }}>
            Looking for footage, a production partner,{' '}
            <em style={{ color: GOLD }}>or access to our archive?</em>
          </h2>
        </Fade>

        <Fade delay={0.15}>
          <p style={{ fontFamily: SANS, fontSize: '1rem', fontWeight: 300,
            color: DIM, lineHeight: 1.8, marginBottom: '2rem' }}>
            Explore our work, discover our collection, or get in touch to discuss
            licensing, collaborations, and commissions.
          </p>
        </Fade>

        <Fade delay={0.2}>
          <motion.div style={{ display: 'inline-block' }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/#contact" style={{
              display: 'inline-block',
              fontFamily: MONO, fontSize: '0.55rem', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: BG,
              background: GOLD,
              padding: '14px 36px',
              borderRadius: '2px',
              textDecoration: 'none',
            }}>
              Reach Out
            </Link>
          </motion.div>
        </Fade>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// 8 — CONSERVATION (unchanged)
// ────────────────────────────────────────────────────────────────
const SITES = [
  {
    location: 'Jabbarkhet Estate, Uttarakhand',
    name: 'The Haunted House',
    desc: 'A heritage woodland estate in the foothills of the Himalayas — home to leopards, Himalayan black bears, and over 200 species of birds.',
  },
  {
    location: 'Motidhar Valley, Uttarakhand',
    name: 'Mountain Quail Estate',
    desc: 'Named for the tragically extinct Mountain Quail last recorded here in 1876 — a sanctuary dedicated to oak forest restoration.',
  },
  {
    location: 'New Delhi',
    name: 'Wilderness Orchard',
    desc: 'An urban biodiversity island in the heart of the capital — demonstrating that wilderness can exist anywhere if you choose to let it.',
  },
]

function ConservationSection() {
  return (
    <section
      className="relative px-6 md:px-12 lg:px-24 pt-10 md:pt-16 pb-8 md:pb-12"
      style={{ background: '#030303', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          <div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 1 }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.62rem',
                letterSpacing: '0.30em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.85)', marginBottom: '1.25rem' }}>
                Beyond The Lens
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 300,
                color: '#F0EDE8', lineHeight: 1.1, marginBottom: '1.75rem', letterSpacing: '0.01em' }}>
                Conservation Sites &{' '}
                <span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>Botanical Arboreta</span>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}>
              <p style={{ fontFamily: '"Outfit", sans-serif', fontSize: '1rem',
                color: 'rgba(240,237,232,0.4)', lineHeight: 1.85, fontWeight: 300, maxWidth: '440px' }}>
                True to our brief, we now live and work out of our trio of botanical arboreta — in a sylvan orchard in Delhi, a trout valley surrounded by peony gardens in the western Himalaya and a high ridge in the oldest estate in the Himalaya, with views of the Ganga and snow peaks of Garhwal.
              </p>
            </motion.div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.05)' }}>
            {SITES.map((site, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: '#030303', padding: '2rem' }}>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.62rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.85)', marginBottom: '0.6rem' }}>
                  {site.location}
                </p>
                <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.15rem',
                  fontWeight: 300, fontStyle: 'italic', color: 'rgba(240,237,232,0.65)',
                  letterSpacing: '0.02em', marginBottom: '0.6rem', lineHeight: 1 }}>
                  {site.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
export default function AboutContent() {
  return (
    <main style={{ background: BG }}>
      <HeroSection />
      <MissionSection />
      <StatsSection />
      <ValuesSection />
      <MDSection />
      <PeopleSection />
      <CTASection />
      <ConservationSection />
    </main>
  )
}

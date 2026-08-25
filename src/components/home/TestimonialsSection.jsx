// Homepage testimonials — auto-advancing carousel with crossfade.
// Renders static 3-column grid under reduced motion.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, User, Users } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollReveal } from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'

const testimonials = [
  {
    name: 'Chioma Ibrahim',
    role: 'Parent, Primary student',
    quote: 'KBS has transformed how my child sees learning. The warmth and individual attention is remarkable — she genuinely looks forward to school.',
    avatar: Users,
  },
  {
    name: 'Mr. Adeyemi',
    role: 'Parent, JSS student',
    quote: 'Discipline, character, and academics in perfect balance. My son has become more confident and independent in the past year at KBS.',
    avatar: User,
  },
  {
    name: 'Blessing Okafor',
    role: 'Parent, Nursery & Primary',
    quote: 'Two children in school, two different experiences shaped with care. KBS is not just a school — it\'s a family that nurtures potential.',
    avatar: Users,
  },
]

const AUTO_ADVANCE_MS = 6_000

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-brand-gray/30 bg-white px-8 py-10 shadow-card sm:px-12">
      <p className="font-calligraphy text-xl italic leading-relaxed text-text-primary sm:text-2xl">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4 border-t border-brand-gray/30 pt-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gray/10 text-brand-primary">
          {testimonial.avatar ? <testimonial.avatar className="h-6 w-6" /> : null}
        </div>
        <div>
          <p className="font-body font-semibold text-text-primary">{testimonial.name}</p>
          <p className="font-body text-xs text-text-secondary">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Static 3-column grid (reduced motion) ──────────────────────────── */
function StaticGrid() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <ScrollReveal key={t.name} direction="up" delay={i * 0.15}>
          <div className="space-y-5 rounded-3xl border border-brand-gray/30 bg-white p-6 shadow-card sm:p-8">
            <p className="font-calligraphy text-lg italic text-text-primary">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3 border-t border-brand-gray/30 pt-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gray/10 text-brand-primary">
                {t.avatar ? <t.avatar className="h-6 w-6" /> : null}
              </div>
              <div>
                <p className="font-body font-semibold text-text-primary">{t.name}</p>
                <p className="font-body text-xs text-text-secondary">{t.role}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}

/* ── Auto-advancing carousel ─────────────────────────────────────────── */
function Carousel() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const go = useCallback((next) => {
    setIdx(next)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (paused) {
      clearInterval(timerRef.current)
      return undefined
    }
    timerRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % testimonials.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timerRef.current)
  }, [paused])

  const pause = () => setPaused(true)
  const resume = () => setPaused(false)

  return (
    <div
      className="relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div className="overflow-hidden rounded-3xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={idx} {...fade} transition={{ duration: 0.35, ease: 'easeOut' }}>
            <TestimonialCard testimonial={testimonials[idx]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous testimonial"
        className="absolute top-1/2 -left-5 -translate-y-1/2 rounded-full bg-white p-2 shadow-md text-text-secondary transition-colors hover:text-brand-primary hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20 hidden sm:inline-flex"
        onClick={() => go(idx === 0 ? testimonials.length - 1 : idx - 1)}
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Next testimonial"
        className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-full bg-white p-2 shadow-md text-text-secondary transition-colors hover:text-brand-primary hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20 hidden sm:inline-flex"
        onClick={() => go(idx === testimonials.length - 1 ? 0 : idx + 1)}
        type="button"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonials">
        {testimonials.map((t, i) => (
          <button
            aria-label={`Show testimonial from ${t.name}`}
            aria-selected={i === idx}
            className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20 ${
              i === idx
                ? 'w-7 bg-brand-primary'
                : 'w-2 bg-brand-gray/40 hover:bg-brand-gray'
            }`}
            key={t.name}
            onClick={() => go(i)}
            role="tab"
            type="button"
          />
        ))}
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-24 sm:py-32 bg-bg-light">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <ScrollReveal direction="up" className="mb-12">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              align="center"
              heading="What KBS Families Say"
              overline="Testimonials"
              subtext="Hear from parents and guardians whose children are thriving at Knowledgebased Basic Science Schools."
            />
          </div>
        </ScrollReveal>

        {prefersReducedMotion ? <StaticGrid /> : <Carousel />}
      </div>
    </section>
  )
}

export default TestimonialsSection

// Homepage hero — word-by-word staggered heading, floating blobs, CTA pair.

import { Suspense, lazy } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import WaveDivider from '../ui/WaveDivider'
import { scrollToElement } from '../../lib/smoothScroll'
import PlaceholderIllustration from './PlaceholderIllustration'

const HeroScene3D = lazy(() => import('./HeroScene3D'))

const heroWords = ['Where', 'Every', 'Child', 'Discovers', 'Their', 'Potential']

function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  const headingContainerVariants = prefersReducedMotion ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
  }
  const wordVariants = prefersReducedMotion ? {} : {
    hidden:   { opacity: 0, y: 40 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const scrollToStats = () => {
    scrollToElement('#stats')
  }

  return (
    <section className="relative overflow-hidden text-white">
      {/* Background gradient fade-in */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-accent via-brand-secondary to-brand-primary"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 sm:px-8 sm:pb-28 lg:grid-cols-2 lg:items-center lg:px-10 lg:pt-24">

        {/* Left: text stack */}
        <div className="space-y-8">
          {/* Overline — delay 0.2s */}
          <motion.p
            className="font-calligraphy text-lg italic text-brand-gray sm:text-xl"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            Nurturing great minds since 1999
          </motion.p>

          {/* Heading — word by word, stagger from delay 0.4s */}
          <motion.h1
            className="font-display text-h1 text-white sm:text-display"
            variants={headingContainerVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
          >
            {heroWords.map((word) => (
              <motion.span
                key={word}
                className="mr-3 inline-block"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Body — delay 0.9s */}
          <motion.p
            className="max-w-lg font-body text-body-lg text-white/80"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
          >
            At KBS Nigeria, every child is guided with warmth, structure, and curiosity through a school experience that feels joyful, modern, and deeply grounded.
          </motion.p>

          {/* Buttons — spring pop, stagger from delay 1.1s */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <motion.div
              className="w-full sm:w-auto"
              initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.1 }}
            >
              <Button as="link" fullWidth className="sm:w-auto" size="lg" to="/admissions" variant="primary">
                Enquire Now
              </Button>
            </motion.div>
            <motion.div
              className="w-full sm:w-auto"
              initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.2 }}
            >
              <Button
                as="link"
                className="border-2 border-white text-white hover:bg-white hover:text-brand-primary sm:w-auto"
                fullWidth
                size="lg"
                to="/about"
                variant="secondary"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right: illustration + decorative blobs */}
        <div className="relative flex items-center justify-center">
          {/* Floating blobs — pointer-events-none */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                aria-hidden="true"
                className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute bottom-4 -left-6 h-20 w-20 rounded-full bg-brand-primary/20 blur-lg pointer-events-none"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute top-1/3 -right-4 h-24 w-24 rounded-full bg-brand-gray/20 blur-xl pointer-events-none"
                animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </>
          )}

          {/* Illustration: slides in from right, then floats */}
          <motion.div
            className="w-full"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Suspense
                fallback={
                  <PlaceholderIllustration
                    className="h-80 sm:h-[420px]"
                    label="hero-scene.svg"
                  />
                }
              >
                <HeroScene3D className="h-80 sm:h-[420px] flex items-center justify-center" />
              </Suspense>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.button
          onClick={scrollToStats}
          className="flex flex-col items-center gap-1 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Scroll to stats"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </div>

      <WaveDivider className="text-brand-primary" />
    </section>
  )
}

export default HeroSection

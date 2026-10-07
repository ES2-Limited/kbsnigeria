// Homepage admissions CTA banner with decorative motion.

import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import { ScrollReveal } from '../ui/ScrollReveal'
import WaveDivider from '../ui/WaveDivider'
import PlaceholderIllustration from './PlaceholderIllustration'

function AdmissionsCta() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-accent py-24 text-white">
      {/* Decorative animated circles */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute -top-16 -right-16 h-64 w-64 rounded-full border-2 border-white/10 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 pointer-events-none"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute top-8 left-8 h-16 w-16 rounded-full bg-brand-primary/30 pointer-events-none"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-12 right-1/4 h-10 w-10 rounded-full bg-white/10 pointer-events-none"
            animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <ScrollReveal direction="scale">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-2 font-calligraphy text-xl italic text-white/80">Admissions Open</p>
              <h2 className="mb-4 font-display text-h1 text-white">Ready to Join the KBS Family?</h2>
              <p className="mb-8 max-w-2xl font-body text-body-lg text-white/80">
                Spaces are limited. Enquire today to begin your child&apos;s journey at Knowledgebased Basic Science Schools.
              </p>
              {/* CTA with glow on hover */}
              <motion.div
                className="inline-block"
                whileHover={prefersReducedMotion ? {} : { boxShadow: '0 0 30px rgba(41,171,226,0.6)', scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button as="link" size="lg" to="/admissions" variant="primary">
                  Enquire Now
                </Button>
              </motion.div>
            </div>
            <PlaceholderIllustration
              className="flex h-72 items-center justify-center rounded-2xl border-2 border-dashed border-white/30 bg-white/10 text-sm text-white/50"
              icon={Sparkles}
              label="Admissions illustration"
            />
          </div>
        </ScrollReveal>
      </div>
      <WaveDivider className="text-white" />
    </section>
  )
}

export default AdmissionsCta

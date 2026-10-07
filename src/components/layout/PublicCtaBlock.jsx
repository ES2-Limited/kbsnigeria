// Persistent conversion CTA block above the footer on public routes.

import { motion, useReducedMotion } from 'framer-motion'
import Button from '../ui/Button'
import { trackApplyClick, trackScheduleVisitClick } from '../../lib/analytics'
import { cta, ctaLinks, positioningStatement } from '../../lib/messaging'

function PublicCtaBlock() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-accent py-16 text-white sm:py-20">
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-2 border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-calligraphy text-lg italic text-white/80 sm:text-xl">Ready to take the next step?</p>
          <h2 className="mt-3 font-display text-h2 text-white sm:text-h1">
            Experience KBS for Yourself
          </h2>
          <p className="mt-4 font-body text-base leading-8 text-white/85 sm:text-lg">
            {positioningStatement}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              as="link"
              onClick={() => trackScheduleVisitClick('footer_cta')}
              size="lg"
              to={ctaLinks.scheduleVisit}
              variant="primary"
            >
              {cta.scheduleVisit}
            </Button>
            <Button
              as="link"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-primary"
              onClick={() => trackApplyClick('footer_cta')}
              size="lg"
              to={ctaLinks.applyNow}
              variant="secondary"
            >
              {cta.applyNow}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PublicCtaBlock

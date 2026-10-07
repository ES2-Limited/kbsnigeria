// Homepage stats bar — staggered count-up cards on brand background.

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Counter from './Counter'

const stats = [
  { label: 'Years Operating',  value: 25  },
  { label: 'Students Enrolled', value: 400 },
  { label: 'Staff Members',    value: 40  },
  { label: 'Classes',          value: 12  },
]

function StatsSection() {
  const prefersReducedMotion = useReducedMotion()
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })

  // Stat card stagger variants
  const statContainerVariants = prefersReducedMotion ? {} : {
    hidden:   {},
    visible:  { transition: { staggerChildren: 0.15 } },
  }
  const statCardVariants = prefersReducedMotion ? {} : {
    hidden:   { opacity: 0, scale: 0.8 },
    visible:  { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
  }

  return (
    <section id="stats" className="relative overflow-hidden bg-brand-primary py-16 sm:py-20" ref={statsRef}>
      {/* Shimmer sweep — plays once when section enters view */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          animate={statsInView ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
        />
      )}

      <motion.div
        className="relative mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10"
        variants={statContainerVariants}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate={statsInView ? 'visible' : 'hidden'}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={statCardVariants}>
            <Counter label={stat.label} value={stat.value} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default StatsSection

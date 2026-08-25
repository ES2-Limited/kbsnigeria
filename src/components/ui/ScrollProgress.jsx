import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // Skip spring animation entirely for users who prefer reduced motion —
  // the bar still tracks scroll position, just without the springy lag.
  const animatedScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX: prefersReducedMotion ? scrollYProgress : animatedScaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary via-brand-accent to-brand-purple z-[100] pointer-events-none"
      aria-hidden="true"
    />
  )
}

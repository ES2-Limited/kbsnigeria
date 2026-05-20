import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const directions = {
  up:    { initial: { opacity: 0, y: 40 },      animate: { opacity: 1, y: 0 } },
  left:  { initial: { opacity: 0, x: -40 },     animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: 40 },      animate: { opacity: 1, x: 0 } },
  scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
}

export function ScrollReveal({ children, delay = 0, direction = 'up', className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()
  const { initial, animate } = directions[direction]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReduced ? {} : initial}
      animate={isInView ? animate : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

// Card component with KBS hover treatment.

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/cn'

function Card({ children, className, ...props }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      className={cn(
        'rounded-2xl border border-surface-grey bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md',
        className,
      )}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      {...props}
    >
      {children}
    </motion.article>
  )
}

export default Card

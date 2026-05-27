// Card component with KBS hover treatment.

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/cn'

function Card({ children, className, ...props }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      className={cn(
        'group rounded-2xl border border-brand-gray/30 bg-white p-6 shadow-card cursor-pointer',
        className,
      )}
      whileHover={prefersReducedMotion ? undefined : { y: -8, boxShadow: '0 20px 40px rgba(31,46,122,0.15)' }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.article>
  )
}

export default Card

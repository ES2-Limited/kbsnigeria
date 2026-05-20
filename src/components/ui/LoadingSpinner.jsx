// Loading spinner component.

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/cn'

function LoadingSpinner({ className = 'h-5 w-5', label = 'Loading' }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.span
      aria-hidden="true"
      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
      className={cn(
        'inline-block rounded-full border-2 border-current border-r-transparent',
        className,
      )}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 0.8, ease: 'linear', repeat: Number.POSITIVE_INFINITY }
      }
    >
      <span className="sr-only">{label}</span>
    </motion.span>
  )
}

export default LoadingSpinner

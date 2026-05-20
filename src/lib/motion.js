// Shared motion helpers for page sections.

export function fadeUpMotion(prefersReducedMotion) {
  return prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.6, ease: 'easeOut' },
      }
}

export function staggerContainerMotion(prefersReducedMotion, staggerChildren = 0.1) {
  return prefersReducedMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-50px' },
        transition: { staggerChildren },
      }
}

export function fadeUpItemVariants(prefersReducedMotion) {
  return prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }
}

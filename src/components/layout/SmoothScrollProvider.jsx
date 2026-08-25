// Lenis smooth scrolling — mounted once in MainLayout.
// Disabled entirely for reduced-motion users; native scrolling is untouched.

import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { registerLenis } from '../../lib/smoothScroll'

function SmoothScrollProvider({ children }) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    registerLenis(lenis)

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      registerLenis(null)
    }
  }, [prefersReducedMotion])

  return children
}

export default SmoothScrollProvider

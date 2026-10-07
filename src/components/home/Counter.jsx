// Animated count-up stat card. Skips animation for reduced-motion users.

import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function Counter({ label, value }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return undefined
    if (prefersReducedMotion) { setCount(value); return undefined }

    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => setCount(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value])

  return (
    <div className="rounded-2xl bg-white/10 px-4 py-6 text-center text-white" ref={ref}>
      <div className="font-display font-bold text-4xl leading-none sm:text-5xl">{count}+</div>
      <p className="mt-3 font-body text-sm font-semibold uppercase tracking-wide text-white/90">{label}</p>
    </div>
  )
}

export default Counter

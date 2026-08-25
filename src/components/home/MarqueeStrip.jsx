// Infinite CSS marquee strip of school values/affiliations.
// Pauses on hover; renders statically for reduced-motion users.

import { cn } from '../../lib/cn'

const values = [
  'NERDC Aligned Curriculum',
  'Safe School Practices',
  'WAEC Preparation Track',
  'Parent Partnership Focus',
  'Nursery to JSS',
  'Loving & Structured Learning',
]

function MarqueeStrip({ className }) {
  const content = values.map((v) => (
    <span key={v} className="mx-6 whitespace-nowrap font-body text-sm font-medium tracking-wide text-white/70 sm:text-base">
      {v}
    </span>
  ))

  return (
    <div
      aria-label="School values and affiliations"
      className={cn('overflow-hidden bg-brand-primary/95 py-3 sm:py-3.5', className)}
      role="region"
    >
      {/* Pause on hover via CSS in index.css (peer group not needed — use :hover on container). */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <div className="flex items-center">{content}</div>
        <div className="flex items-center" aria-hidden="true">{content}</div>
      </div>
    </div>
  )
}

export default MarqueeStrip

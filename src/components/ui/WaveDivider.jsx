// SVG wave divider for section transitions.

import { cn } from '../../lib/cn'

const colorClasses = {
  white: 'text-white',
  grey: 'text-surface-grey',
  'surface-grey': 'text-surface-grey',
  cyan: 'text-kbs-cyan',
  navy: 'text-kbs-navy',
  purple: 'text-kbs-purple',
  lavender: 'text-kbs-lavender',
}

function WaveDivider({ className, color = 'grey', direction = 'bottom' }) {
  return (
    <div className={cn('w-full overflow-hidden leading-none', colorClasses[color], className)}>
      <svg
        className={cn('block h-16 w-full', direction === 'top' ? 'rotate-180' : '')}
        fill="currentColor"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 96L60 85.3C120 75 240 53 360 42.7C480 32 600 32 720 42.7C840 53 960 75 1080 74.7C1200 75 1320 53 1380 42.7L1440 32V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V96Z" />
      </svg>
    </div>
  )
}

export default WaveDivider

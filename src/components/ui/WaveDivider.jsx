// SVG wave divider for section transitions.
// Props: color (hex or css var; `colour` accepted for backwards compatibility), flipX (boolean), className

import { cn } from '../../lib/cn'

function WaveDivider({ className, color, colour, flipX = false }) {
  return (
    <div className={cn('w-full overflow-hidden leading-none', className)}>
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('block w-full', flipX ? 'rotate-180' : '')}
        style={{ marginBottom: -2 }}
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill={color ?? colour ?? 'currentColor'} />
      </svg>
    </div>
  )
}

export default WaveDivider

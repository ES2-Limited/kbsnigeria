// Styled placeholder block for Phase 7 illustrations.

import { cn } from '../../lib/cn'

function IllustrationPlaceholder({ className, label, tone = 'light' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center font-body text-sm',
        tone === 'dark'
          ? 'border-white/20 bg-white/10 text-white/80'
          : 'border-kbs-lavender bg-white/70 text-text-medium',
        className,
      )}
    >
      {label}
    </div>
  )
}

export default IllustrationPlaceholder

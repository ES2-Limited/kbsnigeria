// Badge component for resource and category labels.

import { cn } from '../../lib/cn'

const variantClasses = {
  cyan: 'bg-kbs-cyan/10 text-kbs-cyan',
  purple: 'bg-kbs-purple/10 text-kbs-purple',
  navy: 'bg-kbs-navy/10 text-kbs-navy',
}

function Badge({ children, className, variant = 'cyan' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge

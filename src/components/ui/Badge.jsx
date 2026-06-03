// Badge component for resource and category labels.

import { cn } from '../../lib/cn'

const variantClasses = {
  cyan: 'bg-brand-primary/10 text-brand-primary',
  purple: 'bg-brand-purple/10 text-brand-purple',
  navy: 'bg-brand-primary/10 text-text-primary',
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

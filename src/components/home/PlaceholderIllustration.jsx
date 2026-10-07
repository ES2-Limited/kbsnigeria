// Dashed-border placeholder used while final illustrations are produced.

import { cn } from '../../lib/cn'

function PlaceholderIllustration({ className, icon: Icon, label }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-3xl border-2 border-dashed border-white/30 bg-white/10 px-6 py-10 text-center font-body text-sm text-white/50',
        className,
      )}
    >
      {Icon ? (
        <>
          <Icon aria-hidden="true" className="h-16 w-16 text-white/60" />
          <span className="sr-only">{label}</span>
        </>
      ) : (
        label
      )}
    </div>
  )
}

export default PlaceholderIllustration

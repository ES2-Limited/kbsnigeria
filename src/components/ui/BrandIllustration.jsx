// Renders KBS brand illustrations from /public/assets/illustrations.

import { cn } from '../../lib/cn'
import { ILLUSTRATIONS } from '../../lib/illustrations'

function BrandIllustration({ name, alt, className, ...props }) {
  const src = ILLUSTRATIONS[name]

  if (!src) {
    return null
  }

  return (
    <img
      alt={alt}
      className={cn('h-full w-full object-contain', className)}
      loading="lazy"
      src={src}
      {...props}
    />
  )
}

export default BrandIllustration

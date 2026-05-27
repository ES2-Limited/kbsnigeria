// Section header with prescribed KBS typography.

import { cn } from '../../lib/cn'

function SectionHeader({ align = 'center', className, heading, overline, subtext }) {
  const alignmentClass = align === 'left' ? 'items-start text-left' : 'items-center text-center'

  return (
    <div className={cn('flex max-w-3xl flex-col', alignmentClass, className)}>
      {overline ? (
        <p className="mb-2 font-calligraphy italic text-brand-purple text-xl sm:text-xl">{overline}</p>
      ) : null}
      <h2 className="mb-4 font-display text-h2 text-text-primary">{heading}</h2>
      {subtext ? (
        <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto sm:mx-0">{subtext}</p>
      ) : null}
    </div>
  )
}

export default SectionHeader

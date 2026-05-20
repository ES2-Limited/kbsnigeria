// Section header with KBS type pairing.

import { cn } from '../../lib/cn'

function SectionHeader({ align = 'center', className, heading, overline, subtext }) {
  const alignmentClass = align === 'left' ? 'items-start text-left' : 'items-center text-center'

  return (
    <div className={cn('flex max-w-3xl flex-col gap-3', alignmentClass, className)}>
      {overline ? <p className="font-calligraphy text-xl italic text-kbs-purple">{overline}</p> : null}
      <h2 className="font-display text-4xl leading-tight text-kbs-navy sm:text-5xl">{heading}</h2>
      {subtext ? <p className="font-body text-base leading-7 text-text-medium sm:text-lg">{subtext}</p> : null}
    </div>
  )
}

export default SectionHeader

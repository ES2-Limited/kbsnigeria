// Mobile-first persistent CTA bar — visible below xl breakpoint.

import { Calendar, FileText, Phone } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { trackApplyClick, trackCallClick, trackScheduleVisitClick } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { cta, ctaLinks } from '../../lib/messaging'
import { PHONES, WHATSAPP_URL } from '../../lib/site'

function WhatsAppIcon({ className }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.8C6.9 2.8 2.8 6.9 2.8 12C2.8 13.8 3.3 15.4 4.3 16.9L3 21.2L7.5 20C8.9 20.8 10.4 21.2 12 21.2C17.1 21.2 21.2 17.1 21.2 12C21.2 6.9 17.1 2.8 12 2.8ZM12 19.3C10.6 19.3 9.3 18.9 8.1 18.2L7.8 18L5.2 18.7L6 16.2L5.8 15.8C5 14.6 4.6 13.3 4.6 12C4.6 7.9 7.9 4.6 12 4.6C16.1 4.6 19.4 7.9 19.4 12C19.4 16.1 16.1 19.3 12 19.3ZM16.2 13.8C16 13.7 14.8 13.1 14.6 13.1C14.4 13 14.2 13 14.1 13.2C13.9 13.5 13.5 14 13.4 14.1C13.3 14.2 13.2 14.3 13 14.2C11.8 13.6 10.9 12.9 10 11.4C9.9 11.2 10 11.1 10.1 11C10.2 10.9 10.4 10.7 10.5 10.6C10.6 10.5 10.7 10.3 10.8 10.2C10.9 10 10.8 9.9 10.8 9.7C10.7 9.6 10.2 8.4 10 7.9C9.8 7.5 9.6 7.5 9.5 7.5H9C8.8 7.5 8.6 7.6 8.5 7.7C8.3 7.9 7.8 8.4 7.8 9.4C7.8 10.4 8.5 11.3 8.6 11.4C8.7 11.6 10.1 13.7 12.2 14.6C14.3 15.5 14.3 15.2 14.7 15.2C15.1 15.1 16 14.6 16.2 14.1C16.4 13.7 16.4 13.9 16.2 13.8Z" />
    </svg>
  )
}

const actions = [
  {
    key: 'tour',
    label: cta.scheduleVisit,
    href: ctaLinks.scheduleVisit,
    icon: Calendar,
    isExternal: false,
    onTrack: () => trackScheduleVisitClick('sticky_bar'),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    icon: WhatsAppIcon,
    isExternal: true,
    onTrack: null,
  },
  {
    key: 'call',
    label: cta.callNow,
    href: PHONES[0].href,
    icon: Phone,
    isExternal: true,
    onTrack: () => trackCallClick('sticky_bar'),
  },
  {
    key: 'apply',
    label: cta.applyNow,
    href: ctaLinks.applyNow,
    icon: FileText,
    isExternal: false,
    onTrack: () => trackApplyClick('sticky_bar'),
  },
]

function StickyActionItem({ action }) {
  const Icon = action.icon
  const className = cn(
    'flex min-h-11 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 font-body text-[10px] font-semibold leading-tight text-text-primary transition-colors hover:text-brand-primary sm:text-xs',
    action.key === 'apply' && 'text-brand-primary',
  )

  const content = (
    <>
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span className="text-center">{action.label}</span>
    </>
  )

  const handleClick = () => {
    action.onTrack?.()
  }

  if (action.isExternal) {
    return (
      <a
        className={className}
        href={action.href}
        onClick={handleClick}
        rel={action.key === 'whatsapp' ? 'noreferrer' : undefined}
        target={action.key === 'whatsapp' ? '_blank' : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <Link className={className} onClick={handleClick} to={action.href}>
      {content}
    </Link>
  )
}

function StickyActionBar() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-gray/30 bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] xl:hidden"
      initial={prefersReducedMotion ? {} : { y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.8, duration: 0.4, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch divide-x divide-brand-gray/20">
        {actions.map((action) => (
          <StickyActionItem action={action} key={action.key} />
        ))}
      </div>
    </motion.nav>
  )
}

export default StickyActionBar

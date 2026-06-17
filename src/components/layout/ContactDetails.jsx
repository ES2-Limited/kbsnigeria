// Reusable school contact block — phones, email, address, hours.

import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import {
  ADDRESS,
  ADDRESS_FULL,
  EMAIL,
  MAPS_URL,
  OPENING_HOURS,
  PHONES,
} from '../../lib/site'

function ContactDetails({ className = '' }) {
  return (
    <div className={`space-y-4 font-body text-base text-text-secondary ${className}`}>
      {PHONES.map((phone) => (
        <a
          className="flex min-h-11 items-start gap-3 transition-colors hover:text-brand-accent"
          href={phone.href}
          key={phone.href}
        >
          <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-primary" />
          <span>{phone.display}</span>
        </a>
      ))}
      <a className="flex min-h-11 items-start gap-3 transition-colors hover:text-brand-accent" href={`mailto:${EMAIL}`}>
        <Mail className="mt-1 h-5 w-5 shrink-0 text-brand-primary" />
        <span>{EMAIL}</span>
      </a>
      <a
        className="flex min-h-11 items-start gap-3 transition-colors hover:text-brand-accent"
        href={MAPS_URL}
        rel="noreferrer"
        target="_blank"
      >
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-primary" />
        <span>
          {ADDRESS.line1}
          <br />
          {ADDRESS.line2}
          <br />
          {ADDRESS.city}, {ADDRESS.country}
        </span>
      </a>
      <p className="flex min-h-11 items-start gap-3">
        <Clock className="mt-1 h-5 w-5 shrink-0 text-brand-primary" />
        <span>{OPENING_HOURS}</span>
      </p>
      <span className="sr-only">{ADDRESS_FULL}</span>
    </div>
  )
}

export default ContactDetails

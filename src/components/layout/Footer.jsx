// Public site footer with newsletter signup and contact links.

import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import FallbackImage from '../ui/FallbackImage'
import Input from '../ui/Input'
import { useNewsletterSubscription } from '../../hooks/useNewsletterSubscription'
import {
  ADDRESS,
  EMAIL,
  EXTERNAL_QUICK_LINKS,
  MAPS_URL,
  OPENING_HOURS,
  PHONES,
  SCHOOL_NAME,
  SOCIAL_LINKS,
  TAGLINE_SINCE,
  WHATSAPP_URL,
} from '../../lib/site'

function FacebookIcon(props) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M13.5 21V12.8H16.3L16.7 9.6H13.5V7.6C13.5 6.7 13.8 6 15.1 6H16.8V3.1C16 3 15.3 2.9 14.5 2.9C11.9 2.9 10.2 4.5 10.2 7.5V9.6H7.5V12.8H10.2V21H13.5Z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  )
}

function WhatsAppIcon(props) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.8C6.9 2.8 2.8 6.9 2.8 12C2.8 13.8 3.3 15.4 4.3 16.9L3 21.2L7.5 20C8.9 20.8 10.4 21.2 12 21.2C17.1 21.2 21.2 17.1 21.2 12C21.2 6.9 17.1 2.8 12 2.8ZM12 19.3C10.6 19.3 9.3 18.9 8.1 18.2L7.8 18L5.2 18.7L6 16.2L5.8 15.8C5 14.6 4.6 13.3 4.6 12C4.6 7.9 7.9 4.6 12 4.6C16.1 4.6 19.4 7.9 19.4 12C19.4 16.1 16.1 19.3 12 19.3ZM16.2 13.8C16 13.7 14.8 13.1 14.6 13.1C14.4 13 14.2 13 14.1 13.2C13.9 13.5 13.5 14 13.4 14.1C13.3 14.2 13.2 14.3 13 14.2C11.8 13.6 10.9 12.9 10 11.4C9.9 11.2 10 11.1 10.1 11C10.2 10.9 10.4 10.7 10.5 10.6C10.6 10.5 10.7 10.3 10.8 10.2C10.9 10 10.8 9.9 10.8 9.7C10.7 9.6 10.2 8.4 10 7.9C9.8 7.5 9.6 7.5 9.5 7.5H9C8.8 7.5 8.6 7.6 8.5 7.7C8.3 7.9 7.8 8.4 7.8 9.4C7.8 10.4 8.5 11.3 8.6 11.4C8.7 11.6 10.1 13.7 12.2 14.6C14.3 15.5 14.3 15.2 14.7 15.2C15.1 15.1 16 14.6 16.2 14.1C16.4 13.7 16.4 13.9 16.2 13.8Z" />
    </svg>
  )
}

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Academics', to: '/academics' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'News', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
]

const socialLinks = SOCIAL_LINKS.map((link) => {
  if (link.label === 'Facebook') {
    return { ...link, icon: FacebookIcon, className: 'text-white' }
  }

  if (link.label === 'Instagram') {
    return { ...link, icon: InstagramIcon, className: 'text-white' }
  }

  return { ...link, icon: FacebookIcon, className: 'text-white' }
})

socialLinks.push({
  href: WHATSAPP_URL,
  icon: WhatsAppIcon,
  label: 'WhatsApp',
  className: 'text-white',
})

function Footer() {
  const newsletter = useNewsletterSubscription()
  const [formData, setFormData] = useState({ email: '', name: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const didSubscribe = await newsletter.subscribe(formData)

    if (didSubscribe) {
      setFormData({ email: '', name: '' })
    }
  }

  return (
    <footer className="bg-bg-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mb-12 rounded-3xl bg-white/10 p-6 backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="font-calligraphy text-xl italic text-white/70">Join KBS families receiving school updates</p>
              <h2 className="font-display text-h1 text-white">Subscribe to Our Newsletter</h2>
            </div>
            <form className="grid gap-4 sm:grid-cols-2 lg:flex lg:min-w-[34rem] lg:items-end" onSubmit={handleSubmit}>
              <Input
                className="bg-white/10 text-white placeholder:text-white/40 border border-white/20 rounded-xl px-4 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
                label="Name"
                labelClassName="text-white"
                name="name"
                onChange={handleChange}
                required
                value={formData.name}
              />
              <Input
                className="bg-white/10 text-white placeholder:text-white/40 border border-white/20 rounded-xl px-4 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
                label="Email"
                labelClassName="text-white"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={formData.email}
              />
              <div className="mt-5 space-y-3">
                <Button loading={newsletter.loading} loadingText="Subscribing..." size="lg" type="submit" variant="primary">
                  Subscribe
                </Button>
                {/* {newsletter.success ? <p className="font-body text-sm text-success">{newsletter.success}</p> : null}
                {newsletter.error ? <p className="font-body text-sm text-error">{newsletter.error}</p> : null} */}
              </div>
            </form>
            {newsletter.success ? <p className="font-body text-sm text-white/85">{newsletter.success}</p> : null}
            {newsletter.error ? <p className="font-body text-sm text-red-400">{newsletter.error}</p> : null}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-5">
          <section className="space-y-4">
            <Link className="inline-flex items-center gap-2 h-20 transition-opacity hover:opacity-80" to="/">
              <FallbackImage
                alt="KBS Nigeria - Knowledgebased Basic Science Schools"
                className="h-full w-auto object-contain"
                fallbackSrc="/kbs-logo.png"
                src="/kbs-logo.png"
              />
            </Link>
            <p className="font-calligraphy text-lg italic text-white/70">{TAGLINE_SINCE}</p>
            <p className="max-w-sm font-body text-sm leading-7 text-white/80">
              {SCHOOL_NAME}, {ADDRESS.city}, serving families from nursery through JSS.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="font-body font-semibold text-white text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 font-body text-sm text-white/70">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link className="relative inline-flex min-h-11 items-center transition-colors duration-200 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-brand-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="font-body font-semibold text-white text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4 font-body text-sm text-white/80">
              {PHONES.map((phone) => (
                <li key={phone.href}>
                  <a className="flex min-h-11 items-start gap-3 transition-colors duration-200 hover:text-white" href={phone.href}>
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    <span>{phone.display}</span>
                  </a>
                </li>
              ))}
              <li>
                <a className="flex min-h-11 items-start gap-3 transition-colors duration-200 hover:text-white" href={`mailto:${EMAIL}`}>
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                  <span>{EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  className="flex min-h-11 items-start gap-3 transition-colors duration-200 hover:text-white"
                  href={MAPS_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                  <span>
                    {ADDRESS.line1}, {ADDRESS.line2}, {ADDRESS.city}, {ADDRESS.country}
                  </span>
                </a>
              </li>
              <li className="font-body text-sm text-white/70">{OPENING_HOURS}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="font-body font-semibold text-white text-sm uppercase tracking-wider">Useful Links</h3>
            <ul className="space-y-3 font-body text-sm text-white/70">
              {EXTERNAL_QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    className="relative inline-flex min-h-11 items-center transition-colors duration-200 hover:text-white"
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="font-body font-semibold text-white text-sm uppercase tracking-wider">Follow Us</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
                  href={href}
                  key={label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon height="20" width="20" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
            <p className="font-body text-sm leading-7 text-white/80">
              Stay connected for school news, admissions updates, and family highlights.
            </p>
          </section>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p>© 2026 Knowledgebased Basic Science Schools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

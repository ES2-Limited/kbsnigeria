// Shared site-level constants — single source of truth for contact and brand data.

export const SITE_URL = 'https://kbsnigeria.com'

export const SCHOOL_NAME = 'Knowledgebased Basic Science Schools'

export const SCHOOL_SHORT_NAME = 'KBS Nigeria'

export const TAGLINE = 'Nurturing great minds'

export const TAGLINE_SINCE = 'Nurturing great minds since 1999'

export const DEFAULT_OG_IMAGE = `${SITE_URL}/kbs-logo.png`

export const EMAIL = 'info@kbsnigeria.com'

export const PHONES = [
  { display: '+234 703 468 7998', href: 'tel:+2347034687998' },
  { display: '+234 803 786 1770', href: 'tel:+2348037861770' },
]

/** WhatsApp click-to-chat — primary admissions line */
export const WHATSAPP_NUMBER = '2347034687998'

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export const OPENING_HOURS = 'Monday to Friday, 8:00 AM – 2:00 PM'

export const ADDRESS = {
  line1: 'No 1(Q) 13 Road',
  line2: 'Adjacent L.E.A Primary School',
  city: 'FHA Lugbe, Abuja',
  country: 'Nigeria',
}

export const ADDRESS_FULL = `${ADDRESS.line1}, ${ADDRESS.line2}, ${ADDRESS.city}, ${ADDRESS.country}`

export const MAPS_QUERY = encodeURIComponent(ADDRESS_FULL)

export const MAPS_URL = `https://maps.google.com/?q=${MAPS_QUERY}`

export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAPS_QUERY}&z=15&output=embed`

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://web.facebook.com/kbs.abuja' },
  { label: 'Instagram', href: 'https://www.instagram.com/kbs_abuja/' },
]

export const EXTERNAL_QUICK_LINKS = [
  { label: 'Federal Ministry of Education', href: 'https://education.gov.ng/' },
  { label: 'AMIS – National', href: 'https://amis.nemis.gov.ng/' },
  { label: 'AMIS – FCT', href: 'https://amis.nemis.gov.ng/' },
  { label: 'FCT UBEB', href: 'https://ubeb.fct.gov.ng/' },
]

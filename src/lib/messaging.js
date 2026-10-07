// Single source of truth for KBS positioning, tier copy, CTAs, and funnel labels.

export const positioningStatement =
  "KBS is Abuja's leading Islamic technology-driven school, nurturing academically excellent, morally upright and future-ready leaders."

export const tagline = 'Islamic values. Technology-driven learning. Future-ready leaders.'

export const taglineSince = 'Nurturing future-ready leaders since 1999'

export const hero = {
  overline: taglineSince,
  headlineWords: ['Islamic', 'Values.', 'Tech-Driven', 'Learning.', 'Future-Ready', 'Leaders.'],
  subhead:
    'At KBS Nigeria, faith, academic rigour, and technology come together to shape confident, morally upright learners prepared for tomorrow.',
}

export const pillars = [
  {
    title: 'Academic Excellence',
    description:
      'Strong NERDC-aligned foundations across nursery, primary, and JSS — delivered with high expectations and caring support.',
  },
  {
    title: 'Islamic Character',
    description:
      'Daily guidance in adab, integrity, and spiritual growth so children lead with purpose and noble character.',
  },
  {
    title: 'Technology & Leadership',
    description:
      'Hands-on ICT, critical thinking, and leadership opportunities that prepare pupils for an AI-driven world.',
  },
]

export const tiers = {
  nursery: {
    name: 'Nursery',
    tagline: 'Where great minds begin',
    ages: 'Ages 3–5',
  },
  primary: {
    name: 'Primary',
    tagline: 'Academic excellence with noble character',
    ages: 'Ages 6–11',
  },
  jss: {
    name: 'JSS',
    tagline: 'Preparing children for AI, technology and leadership',
    ages: 'Ages 12–15',
  },
}

export const cta = {
  scheduleVisit: 'Schedule a Visit',
  callNow: 'Call Now',
  applyNow: 'Apply Now',
  enquireNow: 'Enquire Now',
}

export const ctaLinks = {
  scheduleVisit: '/admissions?intent=tour',
  applyNow: '/admissions?intent=apply',
  enquire: '/admissions',
}

export const funnelSteps = [
  {
    title: 'Book school tour',
    description:
      'Schedule a campus visit to experience our classrooms, meet our team, and see how KBS nurtures every child.',
  },
  {
    title: 'Attend open day',
    description:
      'Join an open day to explore our programmes, ask questions, and connect with other KBS families.',
  },
  {
    title: 'Entrance assessment',
    description:
      'Your child completes a friendly assessment so we can understand their strengths and recommend the right placement.',
  },
  {
    title: 'Admission offer',
    description:
      'Receive your admission decision and complete enrolment with clear guidance from our admissions team.',
  },
]

export const ENQUIRY_INTENT_OPTIONS = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'tour', label: 'Schedule Tour' },
  { value: 'open_day', label: 'Open Day' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'apply', label: 'Apply' },
]

const QUERY_INTENT_MAP = {
  tour: 'tour',
  apply: 'apply',
  'open-day': 'open_day',
  assessment: 'assessment',
  general: 'general',
}

export function intentFromQueryParam(query) {
  if (!query) return 'general'
  return QUERY_INTENT_MAP[query] ?? 'general'
}

export function intentLabel(value) {
  return ENQUIRY_INTENT_OPTIONS.find((option) => option.value === value)?.label ?? 'General Enquiry'
}

export const stats = [
  { label: 'Years of Excellence', value: 25 },
  { label: 'Learners Enrolled', value: 400 },
  { label: 'Dedicated Staff', value: 40 },
  { label: 'Learning Pathways', value: 3 },
]

export const homeHighlights = {
  about: {
    overline: 'Welcome to KBS',
    heading: 'Where Islamic Character Meets Technology-Driven Learning',
    subtext:
      'From nursery through JSS, we combine academic excellence, Islamic values, and future-ready skills so every child grows in confidence and purpose.',
  },
  academics: {
    overline: 'Academics',
    heading: 'Three Pathways, One Vision for Excellence',
    subtext:
      'Each tier builds on the last — with age-appropriate rigour, character formation, and technology woven into everyday learning.',
  },
  admissionsBanner: {
    overline: 'Admissions Open',
    heading: 'Give Your Child a Future-Ready KBS Education',
    subtext:
      'Spaces are limited. Schedule a visit or apply today to begin your family\'s journey at Abuja\'s leading Islamic technology-driven school.',
  },
  testimonials: {
    overline: 'Testimonials',
    heading: 'What KBS Families Say',
    subtext:
      'Hear from parents and guardians whose children are thriving in an environment of faith, excellence, and innovation.',
  },
}

export const aboutCopy = {
  hero: {
    overline: 'About KBS',
    heading: 'Abuja\'s Leading Islamic Technology-Driven School',
    subtext: positioningStatement,
  },
  mission: {
    title: 'Our Mission',
    body: 'To nurture academically excellent, morally upright, and technology-confident learners through an Islamic school experience that builds character, curiosity, and leadership.',
  },
  vision: {
    title: 'Our Vision',
    body: 'To be recognised as Abuja\'s leading Islamic technology-driven school where children discover their strengths, grow in faith and integrity, and are equipped to lead in a changing world.',
  },
  pillars: {
    overline: 'Our Pillars',
    heading: 'What Sets KBS Apart',
    subtext:
      'Three foundations shape every classroom, conversation, and community moment at KBS.',
  },
  affiliations: [
    'NERDC Aligned Curriculum',
    'Islamic Character Development',
    'Technology-Integrated Learning',
    'WAEC Preparation Track',
    'Safe School Practices',
    'Parent Partnership Focus',
  ],
}

export const academicsCopy = {
  hero: {
    overline: 'Academics',
    heading: 'Programmes Built for Every Stage of Growth',
    subtext:
      'From first steps in nursery to JSS leadership pathways, each tier delivers strong academics, Islamic character, and technology readiness.',
  },
}

export const admissionsCopy = {
  hero: {
    overline: 'Admissions',
    heading: 'Secure a Place at KBS — Where Leaders Are Made',
    subtext:
      'Join families who chose a school that delivers academic excellence, Islamic values, and technology-driven preparation for the future.',
  },
  process: {
    overline: 'Your Journey',
    heading: 'From First Visit to Enrolment',
    subtext:
      'Our admissions funnel is designed to help you explore KBS with confidence and clarity at every step.',
  },
  events: {
    overline: 'Upcoming Events',
    heading: 'Open Days, Assessments & Discovery Programmes',
    subtext:
      'Join a high-converting school event to experience KBS firsthand — from open classroom days to STEM discovery and assessment weeks.',
  },
}

export const seo = {
  home: {
    title: 'KBS Nigeria | Islamic Technology-Driven School in Abuja',
    description:
      'KBS is Abuja\'s leading Islamic technology-driven school — nurturing academically excellent, morally upright, and future-ready leaders from nursery to JSS.',
  },
  about: {
    title: 'About KBS | Islamic Technology-Driven School, Abuja',
    description:
      'Discover KBS Nigeria\'s mission, Islamic character pillars, and technology-driven approach to nurturing future-ready leaders in FHA Lugbe, Abuja.',
  },
  academics: {
    title: 'Academics | Nursery, Primary & JSS | KBS Nigeria',
    description:
      'Explore KBS academic tiers — nursery, primary, and JSS — combining academic excellence, Islamic character, and technology leadership.',
  },
  admissions: {
    title: 'Admissions | Schedule a Visit | KBS Nigeria',
    description:
      'Book a school tour, attend open day, or apply for admission at KBS Nigeria — Abuja\'s Islamic technology-driven school for nursery through JSS.',
  },
}

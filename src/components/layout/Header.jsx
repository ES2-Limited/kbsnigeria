// Public site header with responsive navigation.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import FallbackImage from '../ui/FallbackImage'
import { cn } from '../../lib/cn'

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

function Logo() {
  return (
    <Link className="inline-flex items-center gap-2 h-14 transition-opacity hover:opacity-80" to="/">
      <FallbackImage
        alt="KBS Nigeria - Knowledgebased Basic Science Schools"
        className="h-full w-auto object-contain"
        fallbackSrc="/kbs-logo.png"
        src="/kbs-logo.png"
      />
    </Link>
  )
}

function HamburgerButton({ isOpen, onClick }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <button
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors duration-200 hover:bg-bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20 lg:hidden"
      onClick={onClick}
      type="button"
    >
      <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
        <motion.path
          animate={isOpen ? { d: 'M6 18L18 6' } : { d: 'M4 7H20' }}
          initial={false}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
        />
        <motion.path
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          initial={false}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
          d="M4 12H20"
        />
        <motion.path
          animate={isOpen ? { d: 'M6 6L18 18' } : { d: 'M4 17H20' }}
          initial={false}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
        />
      </svg>
      <span className="sr-only">Toggle navigation menu</span>
    </button>
  )
}

function Header() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const sentinelRef = useRef(null)

  useEffect(() => {
    setIsDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  const desktopNavLinkClass = useMemo(
    () =>
      ({ isActive }) =>
        cn(
          'relative inline-flex min-h-11 items-center font-body text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20',
          'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-brand-primary after:transition-all after:duration-200',
          isActive
            ? 'font-semibold text-brand-primary after:w-full'
            : 'text-text-primary hover:text-brand-accent after:w-0 hover:after:w-full',
        ),
    [],
  )

  const mobileNavLinkClass = useMemo(
    () =>
      ({ isActive }) =>
        cn(
          'flex min-h-[56px] items-center border-b border-brand-gray/30 font-body text-lg transition-colors duration-200 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20',
          isActive ? 'font-semibold text-brand-primary' : 'text-text-primary',
        ),
    [],
  )

  return (
    <>
      <div className="h-px" ref={sentinelRef} />
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-brand-gray/30'
            : 'bg-white',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          <div className="lg:justify-self-start">
            <Logo />
          </div>

          <nav aria-label="Primary navigation" className="hidden lg:block lg:justify-self-center">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink className={desktopNavLinkClass} end={item.to === '/'} to={item.to}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:flex lg:justify-self-end">
            <Button as="link" size="sm" to="/admissions" variant="primary">
              Enquire Now
            </Button>
          </div>

          <HamburgerButton isOpen={isDrawerOpen} onClick={() => setIsDrawerOpen((open) => !open)} />
        </div>
      </header>

      <AnimatePresence>
        {isDrawerOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ x: 0 }}
              className="ml-auto flex h-full w-full max-w-md flex-col bg-white px-6 pb-8 pt-6"
              exit={{ x: '100%' }}
              initial={{ x: prefersReducedMotion ? 0 : '100%' }}
              onClick={(event) => event.stopPropagation()}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <Logo />
                <HamburgerButton isOpen={isDrawerOpen} onClick={() => setIsDrawerOpen(false)} />
              </div>
              <motion.nav
                aria-label="Mobile navigation"
                className="flex flex-1 flex-col"
                variants={prefersReducedMotion ? {} : {
                  open:   { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                  closed: {},
                }}
                initial="closed"
                animate="open"
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.to}
                    variants={prefersReducedMotion ? {} : {
                      open:   { x: 0, opacity: 1 },
                      closed: { x: 20, opacity: 0 },
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <NavLink
                      className={mobileNavLinkClass}
                      end={item.to === '/'}
                      to={item.to}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
              <div className="pt-6">
                <Button as="link" className="w-full" to="/admissions" variant="primary">
                  Enquire Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Header

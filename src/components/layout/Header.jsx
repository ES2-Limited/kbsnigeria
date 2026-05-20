// Public site header with responsive navigation.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
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
    <Link className="inline-flex items-center gap-3" to="/">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-kbs-cyan font-display text-lg text-white">
        KBS
      </span>
      <span className="flex flex-col">
        <span className="font-display text-lg leading-none text-kbs-navy">KBS Nigeria</span>
        <span className="font-calligraphy text-sm italic leading-none text-kbs-purple">
          Nurturing great minds
        </span>
      </span>
    </Link>
  )
}

function HamburgerButton({ isOpen, onClick }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <button
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-kbs-navy transition-colors duration-200 hover:bg-surface-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kbs-cyan/20 lg:hidden"
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
          'font-body text-sm transition-colors duration-200 hover:text-kbs-cyan',
          isActive ? 'font-semibold text-kbs-cyan' : 'text-text-dark',
        ),
    [],
  )

  const mobileNavLinkClass = useMemo(
    () =>
      ({ isActive }) =>
        cn(
          'flex min-h-14 items-center border-b border-surface-grey/30 font-display text-2xl transition-colors duration-200 hover:text-kbs-cyan',
          isActive ? 'font-semibold text-kbs-cyan' : 'text-kbs-navy',
        ),
    [],
  )

  return (
    <>
      <div className="h-px" ref={sentinelRef} />
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          isScrolled ? 'bg-white shadow-sm' : 'bg-white/95',
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
            <Button as="link" to="/admissions" variant="primary">
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
            className="fixed inset-0 z-50 bg-kbs-navy/50 lg:hidden"
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
              <nav aria-label="Mobile navigation" className="flex flex-1 flex-col">
                {navItems.map((item) => (
                  <NavLink
                    className={mobileNavLinkClass}
                    end={item.to === '/'}
                    key={item.to}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
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

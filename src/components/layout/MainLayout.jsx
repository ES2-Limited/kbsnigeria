// Public site layout wrapper.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { trackPageView } from '../../lib/analytics'
import Footer from './Footer'
import Header from './Header'
import { ScrollProgress } from '../ui/ScrollProgress'
import { WhatsAppButton } from '../ui/WhatsAppButton'

function MainLayout() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    trackPageView(`${location.pathname}${location.search}`)
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen bg-bg-light text-text-primary">
      <ScrollProgress />
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default MainLayout

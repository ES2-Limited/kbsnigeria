// Public site layout wrapper.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import { ScrollProgress } from '../ui/ScrollProgress'
import { WhatsAppButton } from '../ui/WhatsAppButton'

function MainLayout() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-surface-white text-text-dark">
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

// Public site layout wrapper.

import { motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function MainLayout() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-surface-white text-text-dark">
      <Header />
      <motion.main
        animate={{ opacity: 1 }}
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        key={location.pathname}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

export default MainLayout

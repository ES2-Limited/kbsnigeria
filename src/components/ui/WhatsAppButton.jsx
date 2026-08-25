import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { WHATSAPP_URL } from '../../lib/site'

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" className="h-7 w-7">
      <path d="M12 2.8C6.9 2.8 2.8 6.9 2.8 12C2.8 13.8 3.3 15.4 4.3 16.9L3 21.2L7.5 20C8.9 20.8 10.4 21.2 12 21.2C17.1 21.2 21.2 17.1 21.2 12C21.2 6.9 17.1 2.8 12 2.8ZM12 19.3C10.6 19.3 9.3 18.9 8.1 18.2L7.8 18L5.2 18.7L6 16.2L5.8 15.8C5 14.6 4.6 13.3 4.6 12C4.6 7.9 7.9 4.6 12 4.6C16.1 4.6 19.4 7.9 19.4 12C19.4 16.1 16.1 19.3 12 19.3ZM16.2 13.8C16 13.7 14.8 13.1 14.6 13.1C14.4 13 14.2 13 14.1 13.2C13.9 13.5 13.5 14 13.4 14.1C13.3 14.2 13.2 14.3 13 14.2C11.8 13.6 10.9 12.9 10 11.4C9.9 11.2 10 11.1 10.1 11C10.2 10.9 10.4 10.7 10.5 10.6C10.6 10.5 10.7 10.3 10.8 10.2C10.9 10 10.8 9.9 10.8 9.7C10.7 9.6 10.2 8.4 10 7.9C9.8 7.5 9.6 7.5 9.5 7.5H9C8.8 7.5 8.6 7.6 8.5 7.7C8.3 7.9 7.8 8.4 7.8 9.4C7.8 10.4 8.5 11.3 8.6 11.4C8.7 11.6 10.1 13.7 12.2 14.6C14.3 15.5 14.3 15.2 14.7 15.2C15.1 15.1 16 14.6 16.2 14.1C16.4 13.7 16.4 13.9 16.2 13.8Z" />
    </svg>
  )
}

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReduced = useReducedMotion()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="rounded-lg bg-text-dark px-3 py-1.5 font-body text-sm text-white shadow-lg whitespace-nowrap"
          >
            Chat with us
          </motion.span>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Pulse ring */}
        {!prefersReduced && (
          <motion.div
            className="absolute inset-0 rounded-full bg-brand-accent/40 pointer-events-none"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            aria-hidden="true"
          />
        )}

        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with KBS Nigeria on WhatsApp"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-white shadow-lg"
          initial={prefersReduced ? {} : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={prefersReduced ? { duration: 0 } : { delay: 1.5, duration: 0.5, ease: 'easeOut' }}
          whileHover={prefersReduced ? {} : { scale: 1.1 }}
          whileTap={prefersReduced ? {} : { scale: 0.95 }}
          onBlur={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <WhatsAppIcon />
        </motion.a>
      </div>
    </div>
  )
}

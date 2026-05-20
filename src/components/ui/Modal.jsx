// Modal component with focus trap and motion transitions.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

const focusableSelector =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [contenteditable], [tabindex]:not([tabindex="-1"])'

function Modal({ children, className, closeButtonClassName, onClose, open, title, titleClassName }) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !containerRef.current) {
        return
      }

      const focusable = Array.from(containerRef.current.querySelectorAll(focusableSelector))
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    const firstFocusable = containerRef.current?.querySelector(focusableSelector)
    firstFocusable?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, open])

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-kbs-navy/60 px-4 py-8"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            aria-modal="true"
            className={cn(
              'relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-md focus:outline-none',
              className,
            )}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
            onClick={(event) => event.stopPropagation()}
            ref={containerRef}
            role="dialog"
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className={cn('font-display text-2xl leading-tight text-kbs-navy', titleClassName)}>{title}</h2>
              <button
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-full text-kbs-navy transition-colors duration-200 hover:bg-surface-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kbs-cyan/20',
                  closeButtonClassName,
                )}
                onClick={onClose}
                type="button"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default Modal

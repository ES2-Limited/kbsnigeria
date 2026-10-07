// Lenis-aware smooth scroll helper — importable anywhere.

let lenisInstance = null

/** Called by SmoothScrollProvider to register/unregister the active Lenis instance. */
export function registerLenis(lenis) {
  lenisInstance = lenis
}

/** Scroll to a CSS selector, element ref, or pixel offset, using Lenis when available. */
export function scrollToElement(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -96, ...options })
    return
  }

  const element = typeof target === 'string'
    ? document.querySelector(target)
    : target

  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Google Analytics 4 — initialised once when a measurement ID is configured.

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

let initialised = false

export function initAnalytics() {
  if (initialised || !measurementId || measurementId === 'G-XXXXXXXXXX') {
    return
  }

  initialised = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []

  function gtag(...args) {
    window.dataLayer.push(args)
  }

  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId, { send_page_view: false })
}

export function trackPageView(path) {
  if (!initialised || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  })
}

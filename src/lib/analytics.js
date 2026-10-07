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

function trackEvent(eventName, params = {}) {
  if (!initialised || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', eventName, params)
}

export function trackScheduleVisitClick(location = 'unknown') {
  trackEvent('schedule_visit_click', { cta_location: location })
}

export function trackCallClick(location = 'unknown') {
  trackEvent('call_click', { cta_location: location })
}

export function trackApplyClick(location = 'unknown') {
  trackEvent('apply_click', { cta_location: location })
}

export function trackVideoPlay(location = 'unknown') {
  trackEvent('video_play', { video_location: location })
}

export function trackEventCtaClick(eventName, location = 'unknown') {
  trackEvent('event_cta_click', { event_name: eventName, cta_location: location })
}

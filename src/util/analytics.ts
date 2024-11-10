import ReactGA from 'react-ga4'
import { GA4_MEASUREMENT_ID } from './constant'

export const init = () => {
  if (window.location.hostname === 'localhost') {
    return null
  }
  if (GA4_MEASUREMENT_ID) {
    // init if the GA4 Measurement Id is available.
    ReactGA.initialize(GA4_MEASUREMENT_ID?.toString())
  }
}

export const sendPageView = (path: string) => {
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: path,
  })
}

export const trackClick = (category: string, action: string, label: string) => {
  ReactGA.event({
    category,
    action,
    label,
  })
}

export default {
  init,
  sendPageView,
  trackClick,
}

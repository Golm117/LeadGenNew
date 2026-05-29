'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface LandingAnalyticsProps {
  variant: string
}

/**
 * Fires `landing_view` once on mount with the assigned A/B/C variant.
 * The analytics-agent (T-161) will wire the GA4 installation and dimension.
 * Renders nothing visible.
 */
export function LandingAnalytics({ variant }: LandingAnalyticsProps) {
  useEffect(() => {
    window.gtag?.('event', 'landing_view', { variant })
  }, [variant])

  return null
}

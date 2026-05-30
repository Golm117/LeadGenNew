'use client'

import { useEffect } from 'react'
import { storeUtm } from '@/lib/utm'

interface LandingAnalyticsProps {
  variant: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

/**
 * Fires `landing_view` once on mount with the assigned A/B/C variant,
 * and persists UTM params to sessionStorage for reliable attribution even
 * if the user navigates away and returns via a different URL.
 * Renders nothing visible.
 */
export function LandingAnalytics({
  variant,
  utm_source,
  utm_medium,
  utm_campaign,
}: LandingAnalyticsProps) {
  useEffect(() => {
    // Persist UTMs to sessionStorage so the stepper can read them even
    // if the URL params are gone by the time the user reaches the quiz.
    storeUtm({
      utm_source,
      utm_medium,
      utm_campaign,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    })

    // Fire GA4 + Clarity landing_view event
    window.gtag?.('event', 'landing_view', { variant })
    window.clarity?.('event', 'landing_view')
  }, [variant, utm_source, utm_medium, utm_campaign])

  return null
}

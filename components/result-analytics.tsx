'use client'

import { useEffect } from 'react'

/**
 * Fires `result_view` once on mount with the lead's intent band.
 * The analytics-agent (T-161) will wire the GA4 installation.
 * Renders nothing visible.
 */
export function ResultAnalytics({ band }: { band: string }) {
  useEffect(() => {
    window.gtag?.('event', 'result_view', { band })
  }, [band])

  return null
}

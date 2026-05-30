'use client'

import { useEffect } from 'react'

/**
 * Fires `result_view` once on mount with the lead's intent band.
 * Mirrors to Clarity so session replays can be tagged by funnel stage.
 * Renders nothing visible.
 */
export function ResultAnalytics({ band }: { band: string }) {
  useEffect(() => {
    window.gtag?.('event', 'result_view', { band })
    window.clarity?.('event', 'result_view')
  }, [band])

  return null
}

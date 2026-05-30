// Client-side only — UTM helpers. Import only in 'use client' components.
// Provides sessionStorage-backed UTM persistence so attribution survives
// navigation away from the landing page before the user starts the quiz.

export type UtmParams = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referrer?: string
}

const UTM_KEY = 'golm_utm'

/**
 * Persist UTM params to sessionStorage on landing.
 * Only writes if at least one UTM param is present — avoids overwriting
 * a good attribution with an empty one when the user navigates internally.
 */
export function storeUtm(params: UtmParams): void {
  if (typeof sessionStorage === 'undefined') return
  // Only store if at least one utm param is present
  if (params.utm_source || params.utm_medium || params.utm_campaign) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(params))
  }
}

/**
 * Read UTM params from sessionStorage.
 * Returns an empty object if nothing was stored or storage is unavailable.
 */
export function loadUtm(): UtmParams {
  if (typeof sessionStorage === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(UTM_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : {}
  } catch {
    return {}
  }
}

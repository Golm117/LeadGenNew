// Minimal type shim for window.gtag (GA4) and window.clarity (Microsoft Clarity).
// Full GA4 types are available via @types/gtag.js if granular types are ever needed.
// This eliminates TypeScript errors on the existing window.gtag?.() and
// window.clarity?.() calls in the 'use client' components.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export {}

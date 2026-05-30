'use client'

/**
 * CTA button and secondary link for the results page.
 * Both fire analytics events on click before navigating.
 * analytics-agent (T-161) wires the GA4 installation; these are the event hooks.
 */

interface CtaButtonProps {
  href: string
  label: string
  eventName: string
  className?: string
}

export function CtaButton({ href, label, eventName, className }: CtaButtonProps) {
  function handleClick() {
    window.gtag?.('event', eventName, {})
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {label}
    </a>
  )
}

interface SecondaryLinkProps {
  href: string
  label: string
  isPrimary: boolean
  eventName: string
}

export function SecondaryLink({ href, label, isPrimary, eventName }: SecondaryLinkProps) {
  function handleClick() {
    window.gtag?.('event', eventName, {})
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={
        isPrimary
          ? 'text-sm font-semibold text-indigo-600 hover:text-indigo-800'
          : 'text-sm text-slate-500 hover:text-slate-700'
      }
    >
      {label}
    </a>
  )
}

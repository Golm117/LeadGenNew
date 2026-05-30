'use client'

/**
 * CTA button that fires the `quiz_start` analytics event before navigating.
 * Used on the landing page bottom CTA. The Hero component's CTA uses the same
 * pattern via an inline onClick.
 */
interface QuizStartButtonProps {
  assessmentHref: string
  variant: string
}

export function QuizStartButton({ assessmentHref, variant }: QuizStartButtonProps) {
  function handleClick() {
    window.gtag?.('event', 'quiz_start', { variant })
    window.clarity?.('event', 'quiz_start')
  }

  return (
    <a
      href={assessmentHref}
      onClick={handleClick}
      className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30"
    >
      Get your Custom Software Readiness Score — 2 min
    </a>
  )
}

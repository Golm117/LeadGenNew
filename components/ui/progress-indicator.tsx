'use client'

import { CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

// Dot geometry (px) — used to size the growing progress pill across N dots.
const DOT = 10 // h-2.5 / w-2.5
const GAP = 12 // gap-3
const PAD = 4 // pill overhang past the dot edges

interface QuizProgressNavProps {
  /** 1-based current step */
  step: number
  /** total number of steps */
  total: number
  /** gate Continue until the current question is answered */
  canContinue?: boolean
  onBack: () => void
  onContinue: () => void
  backLabel?: string
  continueLabel?: string
  finishLabel?: string
  /** override the "Question N of M" count text (e.g. "Your results →" on the email step) */
  label?: string
  /** override finish-button detection (default: step >= total) */
  isLast?: boolean
  className?: string
}

export function QuizProgressNav({
  step,
  total,
  canContinue = true,
  onBack,
  onContinue,
  backLabel = 'Back',
  continueLabel = 'Continue',
  finishLabel = 'See my score',
  label,
  isLast: isLastProp,
  className,
}: QuizProgressNavProps) {
  const isLast = isLastProp ?? step >= total

  // Pill spans from before dot 1 to the right edge of the current dot. Width is
  // set DECLARATIVELY (style) so it is always correct for the current step; the
  // CSS transition just smooths the change — no rAF/JS animation that could
  // freeze the pill at a stale width if the tab is throttled.
  const pillStep = Math.min(Math.max(step, 1), total)
  const pillWidth = (pillStep - 1) * (DOT + GAP) + DOT + PAD * 2

  return (
    <div className={cn('flex w-full flex-col items-center gap-6', className)}>
      {/* Progress: "Question N of M" + dots with a growing indigo pill */}
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="mb-4 text-xs font-medium text-slate-500">
          {label ?? `Question ${Math.min(step, total)} of ${total}`}
        </div>
        <div className="relative flex items-center gap-3">
          <div
            aria-hidden
            className="absolute top-1/2 h-3.5 -translate-y-1/2 rounded-full bg-indigo-600 transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ left: -PAD, width: pillWidth }}
          />
          {Array.from({ length: total }).map((_, i) => {
            const idx = i + 1
            const covered = idx <= step
            return (
              <span
                key={idx}
                className={cn(
                  'relative z-10 h-2.5 w-2.5 rounded-full transition-colors duration-300',
                  covered ? 'bg-white' : 'bg-slate-300'
                )}
              />
            )
          })}
        </div>
      </div>

      {/* Buttons — always-on Back (D-018); Continue fills the remaining width */}
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
          >
            {backLabel}
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all',
              canContinue ? 'hover:-translate-y-0.5 hover:bg-indigo-700' : 'cursor-not-allowed opacity-50'
            )}
          >
            {isLast && <CircleCheck size={16} />}
            {isLast ? finishLabel : continueLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizProgressNav

'use client'

import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 24, mass: 0.8 }

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
  className,
}: QuizProgressNavProps) {
  const isFirst = step <= 1
  const isLast = step >= total

  return (
    <div className={cn('flex w-full flex-col items-center gap-6', className)}>
      {/* Progress dots — scale to any step count */}
      <div className="w-full max-w-sm">
        <div className="mb-3 flex items-center justify-center text-xs font-medium text-slate-500">
          <span>
            Question {Math.min(step, total)} of {total}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2.5">
          {Array.from({ length: total }).map((_, i) => {
            const idx = i + 1
            const filled = idx <= step
            const current = idx === step
            return (
              <motion.span
                key={idx}
                initial={false}
                animate={{ scale: current ? 1.3 : 1 }}
                transition={SPRING}
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition-colors duration-300',
                  filled ? 'bg-indigo-600' : 'bg-slate-200',
                  current && 'ring-2 ring-indigo-600/30 ring-offset-2 ring-offset-white'
                )}
              />
            )
          })}
        </div>
      </div>

      {/* Buttons — Back fades/expands in from step 2+; Continue collapses to make room */}
      <div className="w-full max-w-sm">
        <motion.div className="flex items-center gap-2" layout>
          {!isFirst && (
            <motion.button
              type="button"
              initial={{ opacity: 0, width: 0, scale: 0.8 }}
              animate={{ opacity: 1, width: 'auto', scale: 1 }}
              transition={{ ...SPRING, opacity: { duration: 0.2 } }}
              onClick={onBack}
              className="flex items-center justify-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
            >
              {backLabel}
            </motion.button>
          )}
          <motion.button
            type="button"
            layout
            onClick={onContinue}
            disabled={!canContinue}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all',
              canContinue ? 'hover:-translate-y-0.5 hover:bg-indigo-700' : 'cursor-not-allowed opacity-50'
            )}
          >
            {isLast && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15, mass: 0.5 }}
              >
                <CircleCheck size={16} />
              </motion.span>
            )}
            {isLast ? finishLabel : continueLabel}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default QuizProgressNav

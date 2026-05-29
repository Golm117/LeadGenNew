// scoring.ts — Pure scoring functions for the GOLM lead-gen funnel.
// All functions are side-effect-free and unit-testable.
// Single source of truth for band thresholds alongside quiz-config.ts.

import {
  QUIZ_QUESTIONS,
  READINESS_MAX,
  INTENT_MAX,
} from './quiz-config'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Answer map: question id → selected option id (choice questions) or free-text string value. */
export type Answers = Record<string, string>

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Resolve the points for a single answered question.
 *  Returns 0 if the answer is missing, the question is free-text, or the
 *  selected option id is not recognised.
 */
function resolvePoints(questionId: string, answerId: string | undefined): number {
  if (!answerId) return 0

  const question = QUIZ_QUESTIONS.find(q => q.id === questionId)
  if (!question || question.type === 'free-text' || !question.options) return 0

  const option = question.options.find(o => o.id === answerId)
  return option ? option.points : 0
}

/** Clamp a number to [0, 100]. */
function clamp(value: number): number {
  return Math.max(0, Math.min(100, value))
}

// ---------------------------------------------------------------------------
// Public scoring functions
// ---------------------------------------------------------------------------

/**
 * Compute the public Readiness Score (0–100).
 *
 * Sums the points from all `readiness`-category questions, then normalises
 * against READINESS_MAX.  Free-text questions (Q6 industry) contribute 0 pts.
 * Missing or unrecognised answers are treated as 0 pts.
 */
export function computeReadiness(answers: Answers): number {
  const readinessQuestions = QUIZ_QUESTIONS.filter(q => q.category === 'readiness')

  const raw = readinessQuestions.reduce((sum, q) => {
    return sum + resolvePoints(q.id, answers[q.id])
  }, 0)

  return clamp(Math.round((raw / READINESS_MAX) * 100))
}

/**
 * Compute the hidden Intent Score (0–100).
 *
 * Sums the points from all `qualifier`-category questions, then normalises
 * against INTENT_MAX (which is exactly 100, so normalisation is a no-op at
 * max score).  Missing or unrecognised answers are treated as 0 pts.
 */
export function computeIntent(answers: Answers): number {
  const qualifierQuestions = QUIZ_QUESTIONS.filter(q => q.category === 'qualifier')

  const raw = qualifierQuestions.reduce((sum, q) => {
    return sum + resolvePoints(q.id, answers[q.id])
  }, 0)

  return clamp(Math.round((raw / INTENT_MAX) * 100))
}

/**
 * Map an Intent Score to a routing band.
 *
 * hot  → intentScore >= 65  (immediate GOLM alert, book-a-call CTA)
 * warm → intentScore >= 35  (quote request flow)
 * cold → intentScore <  35  (nurture / newsletter path)
 *
 * Thresholds are calibration knobs — tune post-launch once real submissions
 * arrive.  Do not hard-code these values anywhere else; always call bandFor().
 */
export function bandFor(intentScore: number): 'hot' | 'warm' | 'cold' {
  if (intentScore >= 65) return 'hot'
  if (intentScore >= 35) return 'warm'
  return 'cold'
}

// quiz-config.ts — Typed quiz configuration (Appendix A, shipped verbatim per D-006)
// Single source of truth for question definitions, point values, and scoring maxes.
// Weights and thresholds are calibration knobs; do not redesign without a new decision entry.

export type QuestionType = 'single-choice' | 'free-text'
export type QuestionCategory = 'readiness' | 'qualifier'

export interface QuizOption {
  id: string      // e.g. 'q1_a', 'q1_b'
  label: string
  points: number
}

export interface QuizQuestion {
  id: string              // e.g. 'q1', 'q2', ..., 'q10'
  category: QuestionCategory
  type: QuestionType
  text: string
  options?: QuizOption[]  // present for single-choice; absent for free-text
  maxPoints: number       // max points available on this question (0 for free-text)
}

// ---------------------------------------------------------------------------
// Questions — Appendix A verbatim
// ---------------------------------------------------------------------------

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- Readiness / fit questions (Q1–Q6) -----------------------------------

  {
    id: 'q1',
    category: 'readiness',
    type: 'single-choice',
    text: 'How much of your daily operations still run on spreadsheets or manual steps?',
    options: [
      { id: 'q1_a', label: 'None',              points: 0  },
      { id: 'q1_b', label: 'Some',              points: 8  },
      { id: 'q1_c', label: 'A lot',             points: 16 },
      { id: 'q1_d', label: 'Almost everything', points: 24 },
    ],
    maxPoints: 24,
  },

  {
    id: 'q2',
    category: 'readiness',
    type: 'single-choice',
    text: 'How well does your current software fit how your business actually works?',
    options: [
      { id: 'q2_a', label: 'Perfectly',    points: 0  },
      { id: 'q2_b', label: 'Mostly',       points: 6  },
      { id: 'q2_c', label: 'Poorly',       points: 14 },
      { id: 'q2_d', label: 'We force it',  points: 20 },
    ],
    maxPoints: 20,
  },

  {
    id: 'q3',
    category: 'readiness',
    type: 'single-choice',
    text: "What's the cost of errors or rework from your current setup?",
    options: [
      { id: 'q3_a', label: 'Negligible', points: 0  },
      { id: 'q3_b', label: 'Noticeable', points: 8  },
      { id: 'q3_c', label: 'Significant', points: 16 },
      { id: 'q3_d', label: 'Constant',   points: 22 },
    ],
    maxPoints: 22,
  },

  {
    id: 'q4',
    category: 'readiness',
    type: 'single-choice',
    text: 'Is your current process holding back growth?',
    options: [
      { id: 'q4_a', label: 'No',                  points: 0  },
      { id: 'q4_b', label: 'Somewhat',             points: 6  },
      { id: 'q4_c', label: 'Yes',                  points: 12 },
      { id: 'q4_d', label: "It's the bottleneck",  points: 18 },
    ],
    maxPoints: 18,
  },

  {
    id: 'q5',
    category: 'readiness',
    type: 'single-choice',
    text: 'Company size',
    options: [
      { id: 'q5_a', label: 'Solo',  points: 4  },
      { id: 'q5_b', label: '2–10',  points: 8  },
      { id: 'q5_c', label: '11–50', points: 12 },
      { id: 'q5_d', label: '50+',   points: 16 },
    ],
    maxPoints: 16,
  },

  {
    // Free-text: stored as `industry` on the lead row; no points contribution.
    // Used for fit analysis and copy personalisation, not for scoring.
    id: 'q6',
    category: 'readiness',
    type: 'free-text',
    text: 'What industry are you in?',
    options: undefined,
    maxPoints: 0,
  },

  // --- Intent qualifier questions (Q7–Q10) — feed the hidden Intent Score ---
  // Weights from PRD §6. INTENT_MAX = 30 + 25 + 25 + 20 = 100 exactly.

  {
    id: 'q7',
    category: 'qualifier',
    type: 'single-choice',
    text: 'When do you need this solved?',
    options: [
      { id: 'q7_a', label: 'Now / this quarter', points: 30 },
      { id: 'q7_b', label: 'This year',          points: 15 },
      { id: 'q7_c', label: 'Just exploring',     points: 0  },
    ],
    maxPoints: 30,
  },

  {
    id: 'q8',
    category: 'qualifier',
    type: 'single-choice',
    text: 'Do you have budget for a custom build?',
    options: [
      { id: 'q8_a', label: 'Allocated / ready',  points: 25 },
      { id: 'q8_b', label: 'Exploring budget',   points: 12 },
      { id: 'q8_c', label: 'No budget yet',      points: 0  },
    ],
    maxPoints: 25,
  },

  {
    id: 'q9',
    category: 'qualifier',
    type: 'single-choice',
    text: 'Are you the decision-maker?',
    options: [
      { id: 'q9_a', label: 'I decide',                  points: 25 },
      { id: 'q9_b', label: 'I influence',               points: 12 },
      { id: 'q9_c', label: 'Researching for someone',   points: 0  },
    ],
    maxPoints: 25,
  },

  {
    id: 'q10',
    category: 'qualifier',
    type: 'single-choice',
    text: 'Have you started looking for a solution?',
    options: [
      { id: 'q10_a', label: 'Already getting quotes', points: 20 },
      { id: 'q10_b', label: 'Started looking',        points: 10 },
      { id: 'q10_c', label: 'Not yet',                points: 0  },
    ],
    maxPoints: 20,
  },
]

// ---------------------------------------------------------------------------
// Derived constants — computed once at module load; never hard-coded elsewhere
// ---------------------------------------------------------------------------

/** Sum of max points across all readiness questions (Q1–Q6).
 *  24 + 20 + 22 + 18 + 16 + 0 = 100
 */
export const READINESS_MAX: number = QUIZ_QUESTIONS
  .filter(q => q.category === 'readiness')
  .reduce((sum, q) => sum + q.maxPoints, 0)

/** Sum of max points across all qualifier questions (Q7–Q10).
 *  30 + 25 + 25 + 20 = 100  (per PRD §6 — already on a 0–100 scale at max)
 */
export const INTENT_MAX: number = QUIZ_QUESTIONS
  .filter(q => q.category === 'qualifier')
  .reduce((sum, q) => sum + q.maxPoints, 0)

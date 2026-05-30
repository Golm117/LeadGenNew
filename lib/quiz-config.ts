// quiz-config.ts — Typed quiz configuration.
// Single source of truth for question definitions, point values, and scoring maxes.
//
// Redesigned per the question-design spec (assessment-question-design-spec.md) and
// its research basis (scored-self-assessment-quiz-design.md). See decision D-019.
// Design rules applied:
//   - Single-select MC is the default scored format.
//   - Readiness options are BEHAVIORALLY ANCHORED (each option = a real state) and
//     authored so the high-scoring answer is NOT inferable. Options are listed
//     worst→best by points but rendered in this order; never label the "good" one.
//   - Q1–Q6 stay 'readiness' (Q6 is the unscored free-text industry capture, kept
//     at id `q6` because submitAssessment reads `answers.q6`). Q7–Q10 are the
//     transparent intent qualifiers that drive routing.
// Weights and thresholds are calibration knobs; tune post-launch with a decision entry.

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
// Questions
// ---------------------------------------------------------------------------

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- Readiness questions (Q1–Q5 scored; Q6 unscored industry) ------------

  {
    id: 'q1',
    category: 'readiness',
    type: 'single-choice',
    text: 'When you need the real status of a job, order, or client — where do you look?',
    options: [
      { id: 'q1_a', label: 'One system everyone trusts and keeps updated',          points: 0  },
      { id: 'q1_b', label: 'Mostly a system, but the real detail lives in side spreadsheets', points: 8  },
      { id: 'q1_c', label: 'A patchwork of spreadsheets, shared docs and chat threads', points: 16 },
      { id: 'q1_d', label: "Mostly in people's heads and whatever they wrote down",  points: 24 },
    ],
    maxPoints: 24,
  },

  {
    id: 'q2',
    category: 'readiness',
    type: 'single-choice',
    text: 'How did your team end up working the way they do today?',
    options: [
      { id: 'q2_a', label: 'Our tools were built or set up around how we work',  points: 0  },
      { id: 'q2_b', label: 'We adapted our process to fit the tools',            points: 8  },
      { id: 'q2_c', label: 'We run constant workarounds to make the tools cope', points: 16 },
      { id: 'q2_d', label: 'The real work happens outside the tools entirely',   points: 22 },
    ],
    maxPoints: 22,
  },

  {
    id: 'q3',
    category: 'readiness',
    type: 'single-choice',
    text: 'From a job starting to finishing, how many separate places does someone re-enter or copy the same information?',
    options: [
      { id: 'q3_a', label: 'One — it flows through automatically', points: 0  },
      { id: 'q3_b', label: 'Two or three',                         points: 8  },
      { id: 'q3_c', label: 'Four or five',                         points: 16 },
      { id: 'q3_d', label: "I've lost count",                      points: 22 },
    ],
    maxPoints: 22,
  },

  {
    id: 'q4',
    category: 'readiness',
    type: 'single-choice',
    text: 'How often does work get redone because something was missed, entered wrong, or fell through the cracks?',
    options: [
      { id: 'q4_a', label: 'Rarely',              points: 0  },
      { id: 'q4_b', label: 'A few times a month',  points: 7  },
      { id: 'q4_c', label: 'Most weeks',           points: 14 },
      { id: 'q4_d', label: "It's a constant",      points: 20 },
    ],
    maxPoints: 20,
  },

  {
    id: 'q5',
    category: 'readiness',
    type: 'single-choice',
    text: 'Roughly how many hours a week does your team spend on manual admin a good system could handle — data entry, chasing updates, building reports by hand?',
    options: [
      { id: 'q5_a', label: 'Under 2',          points: 0  },
      { id: 'q5_b', label: '2–5',              points: 8  },
      { id: 'q5_c', label: '6–15',             points: 16 },
      { id: 'q5_d', label: 'More than 15',     points: 22 },
    ],
    maxPoints: 22,
  },

  {
    // Free-text: stored as `industry` on the lead row (submitAssessment reads
    // `answers.q6`). No points; used for fit analysis and copy personalisation.
    id: 'q6',
    category: 'readiness',
    type: 'free-text',
    text: 'What kind of operation do you run?',
    options: undefined,
    maxPoints: 0,
  },

  // --- Intent qualifier questions (Q7–Q10) — feed the hidden Intent Score ---
  // INTENT_MAX = 30 + 25 + 25 + 20 = 100 exactly.

  {
    id: 'q7',
    category: 'qualifier',
    type: 'single-choice',
    text: 'If a system that fit your operation existed, when would you want it?',
    options: [
      { id: 'q7_a', label: 'We need this solved now / this quarter', points: 30 },
      { id: 'q7_b', label: 'Sometime this year',                     points: 15 },
      { id: 'q7_c', label: 'Just exploring for now',                 points: 0  },
    ],
    maxPoints: 30,
  },

  {
    id: 'q8',
    category: 'qualifier',
    type: 'single-choice',
    text: 'Have you set aside budget to improve your systems?',
    options: [
      { id: 'q8_a', label: "Yes, it's allocated",         points: 25 },
      { id: 'q8_b', label: "We're working out what we'd spend", points: 12 },
      { id: 'q8_c', label: 'Not yet',                     points: 0  },
    ],
    maxPoints: 25,
  },

  {
    id: 'q9',
    category: 'qualifier',
    type: 'single-choice',
    text: 'Who makes the call on something like this?',
    options: [
      { id: 'q9_a', label: 'I do',                       points: 25 },
      { id: 'q9_b', label: "I'm part of the decision",   points: 12 },
      { id: 'q9_c', label: 'Researching for someone else', points: 0  },
    ],
    maxPoints: 25,
  },

  {
    id: 'q10',
    category: 'qualifier',
    type: 'single-choice',
    text: 'Where are you in looking for a fix?',
    options: [
      { id: 'q10_a', label: 'Already getting quotes or demos', points: 20 },
      { id: 'q10_b', label: 'Started looking around',          points: 10 },
      { id: 'q10_c', label: "Haven't started",                 points: 0  },
    ],
    maxPoints: 20,
  },
]

// ---------------------------------------------------------------------------
// Derived constants — computed once at module load; never hard-coded elsewhere
// ---------------------------------------------------------------------------

/** Sum of max points across all readiness questions (Q1–Q6).
 *  24 + 22 + 22 + 20 + 22 + 0 = 110
 */
export const READINESS_MAX: number = QUIZ_QUESTIONS
  .filter(q => q.category === 'readiness')
  .reduce((sum, q) => sum + q.maxPoints, 0)

/** Sum of max points across all qualifier questions (Q7–Q10).
 *  30 + 25 + 25 + 20 = 100  (already on a 0–100 scale at max)
 */
export const INTENT_MAX: number = QUIZ_QUESTIONS
  .filter(q => q.category === 'qualifier')
  .reduce((sum, q) => sum + q.maxPoints, 0)

'use client'

import { useReducer, useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'
import { QuizProgressNav } from '@/components/ui/progress-indicator'
import { QUIZ_QUESTIONS } from '@/lib/quiz-config'
import { submitAssessment } from '@/app/actions/submit-assessment'
import { loadUtm } from '@/lib/utm'

// ─── Local SubmitResult type (T-140 stub returns { token } or throws) ────────
type SubmitResult = { token: string } | { error: string }

// ─── State ───────────────────────────────────────────────────────────────────

type AssessmentStep = 'intro' | number | 'email'

interface State {
  step: AssessmentStep
  answers: Record<string, string>  // questionId → selectedOptionId or free-text
  name: string
  email: string
  turnstileToken: string
  submitting: boolean
  error: string | null
}

const INITIAL_STATE: State = {
  step: 'intro',
  answers: {},
  name: '',
  email: '',
  turnstileToken: '',
  submitting: false,
  error: null,
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SET_ANSWER'; questionId: string; value: string }
  | { type: 'SET_NAME'; value: string }
  | { type: 'SET_EMAIL'; value: string }
  | { type: 'SET_TURNSTILE'; token: string }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }

const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length // 10

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return { ...state, step: 1, error: null }

    case 'NEXT': {
      if (state.step === 'intro') return { ...state, step: 1, error: null }
      if (typeof state.step === 'number') {
        if (state.step < TOTAL_QUESTIONS) return { ...state, step: state.step + 1, error: null }
        return { ...state, step: 'email', error: null }
      }
      return state
    }

    case 'BACK': {
      if (state.step === 'email') return { ...state, step: TOTAL_QUESTIONS, error: null }
      if (typeof state.step === 'number') {
        if (state.step <= 1) return { ...state, step: 'intro', error: null }
        return { ...state, step: state.step - 1, error: null }
      }
      return state
    }

    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
        error: null,
      }

    case 'SET_NAME':
      return { ...state, name: action.value, error: null }

    case 'SET_EMAIL':
      return { ...state, email: action.value, error: null }

    case 'SET_TURNSTILE':
      return { ...state, turnstileToken: action.token, error: null }

    case 'SET_SUBMITTING':
      return { ...state, submitting: action.value }

    case 'SET_ERROR':
      return { ...state, error: action.error, submitting: false }

    default:
      return state
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Milestone nudges shown after completing certain questions (assessment.md)
function getMilestoneNudge(stepJustCompleted: number): string | null {
  if (stepJustCompleted === 4) return 'Halfway there.'
  if (stepJustCompleted === 7) return 'Almost done — three more.'
  if (stepJustCompleted === 9) return 'Last question.'
  return null
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AssessmentStepper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const reduce = useReducedMotion()

  // ── Derived values ─────────────────────────────────────────────────────────

  // For numeric steps, get the zero-indexed question
  const currentQuestion =
    typeof state.step === 'number' ? QUIZ_QUESTIONS[state.step - 1] : null

  // Progress nav: 10 question dots. Questions read "Question N of 10"; the email
  // step sits past the last dot (step 11 of 10 → all filled, none current) and
  // reads "Your results →".
  const navTotal = TOTAL_QUESTIONS // 10
  const navStep =
    state.step === 'email' ? TOTAL_QUESTIONS + 1 : typeof state.step === 'number' ? state.step : 1
  const navLabel =
    state.step === 'email'
      ? 'Your results →'
      : typeof state.step === 'number'
        ? `Question ${state.step} of ${TOTAL_QUESTIONS}`
        : ''

  // canContinue logic
  let canContinue = false
  if (typeof state.step === 'number' && currentQuestion) {
    if (currentQuestion.type === 'single-choice') {
      canContinue = Boolean(state.answers[currentQuestion.id])
    } else {
      // free-text (Q6)
      canContinue = (state.answers[currentQuestion.id] ?? '').trim().length > 0
    }
  } else if (state.step === 'email') {
    canContinue =
      state.name.trim().length > 0 &&
      isValidEmail(state.email) &&
      state.turnstileToken.length > 0
  }

  // Milestone nudge: shown when the PREVIOUS step's answer was the trigger
  const nudge =
    typeof state.step === 'number' && state.step > 1
      ? getMilestoneNudge(state.step - 1)
      : null

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleSelect(questionId: string, optionId: string) {
    dispatch({ type: 'SET_ANSWER', questionId, value: optionId })
    // Fire analytics. No auto-advance: the user reviews their pick and advances
    // via Continue — a timed auto-NEXT raced the button and could skip a question.
    window.gtag?.('event', 'quiz_question_answered', {
      step: state.step,
      question_id: questionId,
    })
  }

  function handleFreeTextChange(questionId: string, value: string) {
    dispatch({ type: 'SET_ANSWER', questionId, value })
  }

  const handleContinue = useCallback(async () => {
    if (state.step !== 'email') {
      // For Q6 (free-text), fire analytics before advancing
      if (typeof state.step === 'number' && currentQuestion?.type === 'free-text') {
        window.gtag?.('event', 'quiz_question_answered', {
          step: state.step,
          question_id: currentQuestion.id,
        })
      }
      dispatch({ type: 'NEXT' })
      return
    }

    // Email step submit
    dispatch({ type: 'SET_SUBMITTING', value: true })
    dispatch({ type: 'SET_ERROR', error: null })

    // Merge URL params (authoritative) with sessionStorage UTMs (fallback).
    // URL params take precedence so a direct link never gets overwritten by
    // a stale stored value. sessionStorage fills gaps when the user landed
    // with UTMs but navigated away before starting the quiz.
    const storedUtm = loadUtm()
    const utm = {
      utm_source: searchParams.get('utm_source') || storedUtm.utm_source || undefined,
      utm_medium: searchParams.get('utm_medium') || storedUtm.utm_medium || undefined,
      utm_campaign: searchParams.get('utm_campaign') || storedUtm.utm_campaign || undefined,
      referrer: (typeof document !== 'undefined' ? document.referrer : undefined) || storedUtm.referrer || undefined,
    }

    const payload = {
      answers: state.answers,
      name: state.name,
      email: state.email,
      turnstileToken: state.turnstileToken,
      honeypot: '',
      utm,
      variant: (searchParams.get('variant') as 'A' | 'B' | 'C') ?? undefined,
    }

    // Fire quiz_email_submitted before calling the action
    window.gtag?.('event', 'quiz_email_submitted', {})

    let result: SubmitResult
    try {
      result = await submitAssessment(payload)
    } catch {
      dispatch({
        type: 'SET_ERROR',
        error: "Something went wrong on our end. Your answers are still here — try submitting again in a moment.",
      })
      dispatch({ type: 'SET_SUBMITTING', value: false })
      return
    }

    if ('error' in result) {
      dispatch({ type: 'SET_ERROR', error: String((result as { error: unknown }).error) })
      dispatch({ type: 'SET_SUBMITTING', value: false })
      return
    }

    // Success
    window.gtag?.('event', 'quiz_completed', {})
    window.clarity?.('event', 'quiz_completed')
    router.push(`/results/${result.token}`)
  }, [state, currentQuestion, searchParams, router])

  // Fire quiz_start when intro CTA is clicked
  function handleStart() {
    const variant = searchParams.get('variant') ?? 'A'
    window.gtag?.('event', 'quiz_start', { variant })
    window.clarity?.('event', 'quiz_start')
    dispatch({ type: 'START' })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-900/5 md:p-10">
          {/* Keyed motion.div re-mounts on each step change for a ~150ms enter
              transition. No AnimatePresence/exit — mode="wait" can hang on its
              exit-complete callback (React 19 + framer-motion), freezing the step. */}
          <motion.div
            key={String(state.step)}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
              {/* ── Intro step ──────────────────────────────────────────── */}
              {state.step === 'intro' && <IntroStep onStart={handleStart} />}

              {/* ── Question steps (1–10) ───────────────────────────────── */}
              {typeof state.step === 'number' && currentQuestion && (
                <QuestionStep
                  question={currentQuestion}
                  answers={state.answers}
                  nudge={nudge}
                  onSelect={handleSelect}
                  onFreeTextChange={handleFreeTextChange}
                  navStep={navStep}
                  navTotal={navTotal}
                  navLabel={navLabel}
                  canContinue={canContinue}
                  onBack={() => dispatch({ type: 'BACK' })}
                  onContinue={handleContinue}
                />
              )}

              {/* ── Email capture step ──────────────────────────────────── */}
              {state.step === 'email' && (
                <EmailStep
                  name={state.name}
                  email={state.email}
                  submitting={state.submitting}
                  error={state.error}
                  navStep={navStep}
                  navTotal={navTotal}
                  navLabel={navLabel}
                  canContinue={canContinue}
                  onBack={() => dispatch({ type: 'BACK' })}
                  onContinue={handleContinue}
                  onNameChange={(v) => dispatch({ type: 'SET_NAME', value: v })}
                  onEmailChange={(v) => dispatch({ type: 'SET_EMAIL', value: v })}
                  onTurnstileSuccess={(token) => dispatch({ type: 'SET_TURNSTILE', token })}
                />
              )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}

// ─── Intro step ──────────────────────────────────────────────────────────────

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6">
      <div>
        <h1 className="text-2xl font-bold leading-snug tracking-tight text-slate-900 md:text-3xl">
          Let&apos;s see where you actually stand.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Ten short questions about how your business runs today. Answer honestly — the score is
          only useful if it reflects reality.
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          No pitch at the end. You&apos;ll get your Readiness Score (0–100) and a plain-language
          read on where you&apos;re losing time and whether a custom build makes sense for you
          right now.
        </p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          Start the assessment →
        </button>
        <p className="text-sm text-slate-400">Takes about 2 minutes. Results delivered instantly.</p>
      </div>
    </div>
  )
}

// ─── Question step ───────────────────────────────────────────────────────────

interface QuestionStepProps {
  question: (typeof QUIZ_QUESTIONS)[number]
  answers: Record<string, string>
  nudge: string | null
  onSelect: (questionId: string, optionId: string) => void
  onFreeTextChange: (questionId: string, value: string) => void
  navStep: number
  navTotal: number
  navLabel: string
  canContinue: boolean
  onBack: () => void
  onContinue: () => void
}

// Helper text per question (from assessment.md)
const HELPER_TEXT: Record<string, string> = {
  q1: 'Think quotes, scheduling, job and order tracking, invoicing, reporting — wherever the live, trustworthy detail actually sits day to day.',
  q2: 'Did your tools fit your work from the start, or did your team bend its process — and build workarounds — to fit the tools?',
  q3: 'Count each separate place the same details get typed or copied again — quote to job to schedule to invoice to report.',
  q4: 'Include fixing mistakes, re-entering data, chasing down discrepancies, and re-doing work a well-wired system would have caught the first time.',
  q5: 'A rough estimate is fine. Add up data entry, chasing updates, and hand-building reports across your team in a typical week.',
  q6: "Whatever describes your business best — there's no wrong answer. This helps us tailor the breakdown you'll see on your results page.",
  q7: 'Be honest — the result is more useful if it matches where you actually are. "Just exploring" is a completely valid answer.',
  q8: "This isn't a commitment — it just helps us give you a result that's actually relevant to your situation.",
  q9: "No wrong answer. If you're researching for a partner, owner, or board, we can still give you something useful to bring back.",
  q10: 'This helps us point you to the most relevant next step after your score — a conversation, a guide, or just your results to keep on file.',
}

function QuestionStep({
  question,
  answers,
  nudge,
  onSelect,
  onFreeTextChange,
  navStep,
  navTotal,
  navLabel,
  canContinue,
  onBack,
  onContinue,
}: QuestionStepProps) {
  const selectedId = answers[question.id] ?? null
  const helperText = HELPER_TEXT[question.id] ?? null

  return (
    <div className="flex flex-col gap-6">
      {nudge && (
        <p className="rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700">
          {nudge}
        </p>
      )}

      <fieldset>
        <legend className="text-xl font-bold leading-snug tracking-tight text-slate-900 md:text-2xl">
          {question.text}
        </legend>

        {helperText && (
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{helperText}</p>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {question.type === 'single-choice' && question.options?.map((option) => {
            const isSelected = selectedId === option.id
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(question.id, option.id)}
                className={
                  'rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all ' +
                  (isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50')
                }
              >
                {option.label}
              </button>
            )
          })}

          {question.type === 'free-text' && (
            <input
              type="text"
              value={answers[question.id] ?? ''}
              onChange={(e) => onFreeTextChange(question.id, e.target.value)}
              placeholder="e.g. Metal fabrication, Environmental services, Freight logistics…"
              className="rounded-2xl border border-slate-200 px-5 py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20"
            />
          )}
        </div>
      </fieldset>

      <QuizProgressNav
        step={navStep}
        total={navTotal}
        label={navLabel}
        isLast={false}
        canContinue={canContinue}
        onBack={onBack}
        onContinue={onContinue}
      />
    </div>
  )
}

// ─── Email capture step ───────────────────────────────────────────────────────

interface EmailStepProps {
  name: string
  email: string
  submitting: boolean
  error: string | null
  navStep: number
  navTotal: number
  navLabel: string
  canContinue: boolean
  onBack: () => void
  onContinue: () => void
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onTurnstileSuccess: (token: string) => void
}

function EmailStep({
  name,
  email,
  submitting,
  error,
  navStep,
  navTotal,
  navLabel,
  canContinue,
  onBack,
  onContinue,
  onNameChange,
  onEmailChange,
  onTurnstileSuccess,
}: EmailStepProps) {
  const [emailTouched, setEmailTouched] = useState(false)
  const emailInvalid = emailTouched && email.trim().length > 0 && !isValidEmail(email)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold leading-snug tracking-tight text-slate-900 md:text-2xl">
          Your score is ready. Where should we send it?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Enter your name and email below. We&apos;ll show your results immediately — and send a
          copy to your inbox so you have it later.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full-name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="full-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>

        {/* Work email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="work-email" className="text-sm font-medium text-slate-700">
            Work email
          </label>
          <input
            id="work-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@yourbusiness.com"
            autoComplete="email"
            aria-invalid={emailInvalid}
            aria-describedby={emailInvalid ? 'work-email-error' : undefined}
            className={
              'rounded-2xl border px-5 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 ' +
              (emailInvalid
                ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-600/20')
            }
          />
          {emailInvalid && (
            <p id="work-email-error" className="text-xs text-red-600">
              Please enter a valid email address.
            </p>
          )}
        </div>

        {/* Honeypot — hidden from real users, never described in copy */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          value=""
          readOnly
          aria-hidden="true"
        />

        {/* Cloudflare Turnstile widget */}
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          onSuccess={onTurnstileSuccess}
        />

        {/* Reassurance */}
        <p className="text-xs leading-relaxed text-slate-400">
          No spam. One results email, then you&apos;re in control of what happens next.
          We don&apos;t sell email lists or share your data.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <QuizProgressNav
        step={navStep}
        total={navTotal}
        label={navLabel}
        canContinue={canContinue && !submitting}
        onBack={onBack}
        onContinue={onContinue}
        finishLabel={submitting ? 'Submitting…' : 'See My Score →'}
      />

      <p className="text-center text-xs text-slate-400">Results load instantly after you submit.</p>
    </div>
  )
}

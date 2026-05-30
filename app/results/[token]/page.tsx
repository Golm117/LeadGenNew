// Results page — React Server Component.
// Reads lead by token from Supabase, renders band-matched score + insights + CTA.
// Next.js 16: `params` is a Promise — await it.

import type { Metadata } from 'next'
import { selectInsights } from '@/lib/insights'
import { ResultAnalytics } from '@/components/result-analytics'
import { CtaButton, SecondaryLink } from '@/components/result-cta'
import { ScopeRequestForm } from '@/components/scope-request-form'
import type { Lead } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Your Custom Software Readiness Score — GOLM',
}

// Force dynamic: token is unique per lead, never statically known
export const dynamic = 'force-dynamic'

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ResultPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params  // Next.js 16: params is a Promise

  // Attempt to load Supabase; gracefully degrade if env vars are missing (D-009)
  let lead: Lead | null = null
  let loadError = false

  try {
    const { createSupabaseServer } = await import('@/lib/supabase-server')
    const supabase = createSupabaseServer()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !data) {
      lead = null
    } else {
      lead = data as Lead
    }
  } catch {
    // Supabase env vars not set — dev environment without a project yet (D-009)
    loadError = true
  }

  if (loadError) {
    return <ResultError />
  }

  if (!lead) {
    return <ResultNotFound />
  }

  const answers = lead.answers as Record<string, string>
  const band = lead.intent_band as 'hot' | 'warm' | 'cold'
  const insights = selectInsights(answers, band)
  const firstName = lead.full_name?.split(' ')[0] || null

  return <ResultPageContent lead={lead} insights={insights} firstName={firstName} band={band} />
}

// ─── Not-found / error states ─────────────────────────────────────────────────

function ResultNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Results not found.</h1>
        <p className="mt-3 text-base text-slate-500">This link may have expired.</p>
        <a
          href="/assessment"
          className="mt-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Take the assessment
        </a>
      </div>
    </main>
  )
}

function ResultError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Results unavailable.
        </h1>
        <p className="mt-3 text-base text-slate-500">
          We couldn&apos;t load your results right now. Please try again in a moment.
        </p>
        <a
          href="/assessment"
          className="mt-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Take the assessment
        </a>
      </div>
    </main>
  )
}

// ─── Result page content ─────────────────────────────────────────────────────

interface ResultPageContentProps {
  lead: Lead
  insights: string[]
  firstName: string | null
  band: 'hot' | 'warm' | 'cold'
}

const BAND_CONFIG = {
  hot: {
    label: 'Strong fit',
    badgeBg: 'bg-indigo-600 text-white',
    scoreFg: 'text-indigo-600',
    borderFg: 'border-indigo-400',
    headline: 'Your operation is ready for this. Now is the right time.',
    framing: (score: number) =>
      `A score of ${score} puts you in the clearest-case bracket we see — the pain is real, the fit is strong, and your timeline and situation are aligned for a custom build to actually deliver.`,
    ctaHeading: "Let's talk about what a custom build looks like for you.",
    ctaBody:
      "We'll spend 30 minutes looking at your actual workflow — what's costing you time, what a fit-for-purpose system would fix, and whether the investment makes sense given your size and stage. No pressure, no obligation.",
    ctaLabel: 'Book a free 30-minute call →',
    ctaEvent: 'cta_book_call_click',
    ctaStyle: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
    fallback: "Or reply to your results email — we'll get back to you within one business day.",
  },
  warm: {
    label: 'Good potential',
    badgeBg: 'bg-amber-500 text-white',
    scoreFg: 'text-amber-600',
    borderFg: 'border-amber-400',
    headline: "There's real opportunity here — with the right scoping.",
    framing: (score: number) =>
      `A score of ${score} tells us the pain is genuine and a custom build would likely pay off — but a few things (timeline, budget, or scope) aren't fully in place yet. That's normal, and it's exactly what a scoping conversation is for.`,
    ctaHeading: 'Want a clearer picture of what it would take?',
    ctaBody:
      "Share a bit more about your operation and we'll put together a rough scope — what a fit-for-purpose build might include, a realistic ballpark, and what we'd need to know to give you a proper proposal. No cost, no commitment.",
    ctaLabel: 'Request a free scope outline →',
    ctaEvent: 'cta_quote_click',
    ctaStyle: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
    fallback: "Or reply to your results email with any questions — we're easy to reach.",
  },
  cold: {
    label: 'Not yet',
    badgeBg: 'bg-slate-400 text-white',
    scoreFg: 'text-slate-600',
    borderFg: 'border-slate-300',
    headline: 'Not the right moment — but that changes.',
    framing: (score: number) =>
      `A score of ${score} tells us one of two things: either the pain isn't severe enough yet to justify a custom build, or the timing and conditions (budget, authority, urgency) aren't in place. Either way, forcing it now wouldn't serve you — but staying in the loop means you'll know when the picture changes.`,
    ctaHeading: 'Keep this for when the time is right.',
    ctaBody:
      "We publish practical content on when and how niche businesses know it's time to move past the spreadsheet stack — no hype, no spam. Join the list to get it when it's useful.",
    ctaLabel: 'Join the newsletter →',
    ctaEvent: 'cta_newsletter_click',
    ctaStyle: 'bg-slate-700 hover:bg-slate-800 text-white shadow-slate-600/20',
    fallback: null,
  },
} as const

function ResultPageContent({ lead, insights, firstName, band }: ResultPageContentProps) {
  const cfg = BAND_CONFIG[band]
  const score = lead.readiness_score
  const greeting = firstName
    ? `Hi ${firstName} — here's your breakdown.`
    : "Hi — here's your breakdown."

  const bookingUrl = process.env.BOOKING_URL || '#'

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50/40 to-white">
      {/* Analytics: fires result_view with band on mount */}
      <ResultAnalytics band={band} />

      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">

        {/* ── Score block ────────────────────────────────────────────────── */}
        <section className="mb-12">
          <p className="mb-3 text-base text-slate-500">{greeting}</p>

          <div className="flex items-end gap-4">
            <div>
              <span className={`text-6xl font-bold leading-none md:text-7xl ${cfg.scoreFg}`}>
                {score}
              </span>
              <span className="ml-1 text-2xl font-medium text-slate-400 md:text-3xl">/ 100</span>
            </div>
            <span className={`mb-1 rounded-full px-3 py-1 text-sm font-semibold ${cfg.badgeBg}`}>
              {cfg.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">Custom Software Readiness Score</p>
        </section>

        {/* ── Band headline + framing ────────────────────────────────────── */}
        <section className="mb-8">
          <h1 className="text-2xl font-bold leading-snug tracking-tight text-slate-900 md:text-3xl">
            {cfg.headline}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {cfg.framing(score)}
          </p>
        </section>

        {/* ── Insight bullets ────────────────────────────────────────────── */}
        {insights.length > 0 && (
          <section className="mb-12">
            <ul className="flex flex-col gap-4">
              {insights.map((insight, i) => (
                <li
                  key={i}
                  className={`border-l-2 pl-4 text-base leading-relaxed text-slate-700 ${cfg.borderFg}`}
                >
                  {insight}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Primary CTA block ──────────────────────────────────────────── */}
        <section id="scope-form" className="mb-16 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            {cfg.ctaHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{cfg.ctaBody}</p>

          {band === 'warm' ? (
            <ScopeRequestForm token={lead.token} />
          ) : (
            <CtaButton
              href={band === 'hot' ? bookingUrl : '#'}
              label={cfg.ctaLabel}
              eventName={cfg.ctaEvent}
              className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 md:w-auto ${cfg.ctaStyle}`}
            />
          )}

          {cfg.fallback && (
            <p className="mt-4 text-sm text-slate-400">{cfg.fallback}</p>
          )}
        </section>

        {/* ── Secondary options — all bands (results.md §secondary actions) */}
        <section className="border-t border-slate-100 pt-8">
          <p className="mb-4 text-sm font-medium text-slate-500">All three options:</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <SecondaryLink
              href={bookingUrl}
              label="Book a call →"
              isPrimary={band === 'hot'}
              eventName="cta_book_call_click"
            />
            <SecondaryLink
              href={band === 'warm' ? '#scope-form' : '#'}
              label="Request a scope outline →"
              isPrimary={band === 'warm'}
              eventName="cta_quote_click"
            />
            <SecondaryLink
              href="#"
              label="Join the list →"
              isPrimary={band === 'cold'}
              eventName="cta_newsletter_click"
            />
          </div>
        </section>

      </div>
    </main>
  )
}

import { cookies } from 'next/headers'
import { Hero } from '@/components/hero'
import { LandingAnalytics } from '@/components/landing-analytics'
import { QuizStartButton } from '@/components/quiz-start-button'
import { Reveal } from '@/components/reveal'
import { SoundFamiliarScroll } from '@/components/sound-familiar-scroll'

// ─── Types ──────────────────────────────────────────────────────────────────

type Variant = 'A' | 'B' | 'C'
const VALID_VARIANTS: Variant[] = ['A', 'B', 'C']

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  // Next.js 16: searchParams is a Promise — await it
  const params = await searchParams
  const cookieStore = await cookies()

  // Read the A/B/C variant assigned by middleware (defaults to 'A' if unset)
  const raw = cookieStore.get('hero_variant')?.value ?? ''
  const variant: Variant = (VALID_VARIANTS.includes(raw as Variant) ? raw : 'A') as Variant

  // Build /assessment href carrying variant + any UTM params from the landing URL
  const utmQuery = new URLSearchParams()
  utmQuery.set('variant', variant)
  if (params.utm_source) utmQuery.set('utm_source', params.utm_source)
  if (params.utm_medium) utmQuery.set('utm_medium', params.utm_medium)
  if (params.utm_campaign) utmQuery.set('utm_campaign', params.utm_campaign)
  const assessmentHref = `/assessment?${utmQuery.toString()}`

  return (
    <main>
      {/* Analytics: fires landing_view + stores UTMs in sessionStorage on mount */}
      <LandingAnalytics
        variant={variant}
        utm_source={params.utm_source}
        utm_medium={params.utm_medium}
        utm_campaign={params.utm_campaign}
      />

      {/* ── Hero (variant-driven headline + subhead) ─────────────────────── */}
      {/* Hero's CTA fires quiz_start internally (variant in scope) */}
      <Hero variant={variant} assessmentHref={assessmentHref} />

      {/* ── Problem section — scroll-driven terminal type-on ────────────── */}
      <SoundFamiliarScroll />

      {/* ── What GOLM does ──────────────────────────────────────────────── */}
      <section className="bg-surface px-6 py-20 md:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            We build software around your operation, not the other way around.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            GOLM builds custom software for niche operations and logistics businesses: one system
            that fits how you actually work, replaces the spreadsheet-and-duct-tape stack, and
            grows with you.
          </p>
        </Reveal>
      </section>

      {/* ── Credibility proof strip (D-012: mock numbers for v1) ────────── */}
      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { stat: '40+', label: 'custom systems shipped' },
              { stat: '12', label: 'industries served' },
              { stat: '8+', label: 'years building ops software' },
              { stat: '~15 hrs', label: 'saved per client per week' },
            ].map(({ stat, label }, i) => (
              <Reveal
                key={label}
                delay={i * 0.08}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="text-3xl font-bold text-indigo-600 md:text-4xl">{stat}</div>
                <div className="mt-1 text-sm leading-snug text-slate-500">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you'll get ─────────────────────────────────────────────── */}
      <section className="bg-surface px-6 py-20 md:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            In two minutes, you&apos;ll know:
          </h2>
          <ul className="mt-8 space-y-5">
            <li className="border-l-2 border-indigo-300 pl-4 text-lg leading-relaxed text-slate-600">
              Your <strong className="font-semibold text-slate-800">Readiness Score</strong> (0–100), and how much your business stands to gain from custom software.
            </li>
            <li className="border-l-2 border-indigo-300 pl-4 text-lg leading-relaxed text-slate-600">
              <strong className="font-semibold text-slate-800">Where</strong>{' '}you&apos;re losing time and money right now.
            </li>
            <li className="border-l-2 border-indigo-300 pl-4 text-lg leading-relaxed text-slate-600">
              Whether a custom build is <strong className="font-semibold text-slate-800">worth it for you yet</strong>. Straight answer, no pitch.
            </li>
          </ul>
        </Reveal>
      </section>

      {/* ── Bottom CTA repeat ───────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Find out where you stand.
          </h2>
          <div className="mt-8 flex flex-col items-center gap-3">
            {/* Client component fires quiz_start before navigating */}
            <QuizStartButton assessmentHref={assessmentHref} variant={variant} />
            <p className="text-sm text-slate-500">Free · 2 minutes · Results instantly</p>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

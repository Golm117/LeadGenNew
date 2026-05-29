# Task.md — Live Work Board

The build, broken into pullable tasks. Agents claim work here (see `PROTOCOL.md` §4).
This board is populated by the research phase **after** the confirmation phase reaches
>95%. Until then it holds only the meta-tasks below.

Task block schema:

```
## T-NNN — <title>
- status: pending | claimed | in-progress | blocked | done
- owner: <agent-name | unassigned>
- domain: <area, e.g. data | frontend | scoring | email | infra>
- depends-on: [T-NNN, ...]   (must all be `done` before this is pullable)
- handoff-to: <agent-name | unassigned>
- acceptance: <what "done" means, testable>
- notes: <links to notepad entries / files produced>
```

---

## T-000 — Confirmation phase: reach >95% understanding of the PRD
- status: done
- owner: orchestrator (this CC session)
- domain: planning
- depends-on: []
- handoff-to: orchestrator
- acceptance: All load-bearing open questions resolved into `decisions.md`; confidence >=95% stated.
- notes: Done 2026-05-29 at 96%. See decisions D-001..D-008.

## T-001 — Research MVP build tasks
- status: done
- owner: orchestrator
- domain: planning
- depends-on: [T-000]
- handoff-to: orchestrator
- acceptance: This board populated with the full MVP task breakdown, each task with domain + dependencies.
- notes: Breakdown below maps to PRD §11 build sequence + §9.2 architecture.

## T-002 — Generate specialist agent definitions
- status: done
- owner: orchestrator
- domain: planning
- depends-on: [T-001]
- handoff-to: agents (onboarding runs in remote env on first activation)
- acceptance: `.claude/agents/*.md` created for each domain; roster handoff map seeded; agents self-describe + all-hands on first remote activation.
- notes: 7 agents created. Self-descriptions (Phase A) and all-hands (Phase B) execute in the remote session per PROTOCOL §3.

---

## MVP build tasks

Ordering follows PRD §11. `depends-on` enforces the real build order; anything with
all deps `done` is pullable in parallel by a matching-domain agent. All start `pending`
/ `unassigned`.

### Setup & foundation

## T-100 — Scaffold Next.js 16 + Tailwind + repo
- status: done
- owner: infra-agent
- domain: infra
- depends-on: []
- handoff-to: unassigned
- acceptance: `npm run dev` serves an App Router app; Tailwind compiles; lucide-react installed; npm lockfile committed. File tree matches PRD §9.2.
- notes: PRD §11.1, §9.1. TypeScript, no component library.
- handoff-note: Next.js 16.2.6 scaffolded at repo root with TypeScript, Tailwind v4, lucide-react v1.17.0, npm lockfile. All PRD §9.2 stubs created: `app/page.tsx`, `app/assessment/page.tsx`, `app/results/[token]/page.tsx`, `app/actions/submit-assessment.ts`, `lib/quiz-config.ts`, `lib/scoring.ts`, `lib/supabase-server.ts`, `lib/resend.ts`, `emails/.gitkeep`. `npm run build` passes (5 static/dynamic routes generated). T-101, T-110, T-120, T-130, T-150 are now unblocked.

## T-101 — Environment contract (.env.example) + DEPLOY runbook
- status: done
- owner: infra-agent (Slice 2)
- domain: infra
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: `.env.example` documents every PRD §9.2 var with correct public/server scoping and a one-line purpose; `DEPLOY.md` runbook lists the steps to provision Vercel + plug in keys. NO live Vercel project created (D-009).
- notes: Build-only. Secrets server-only. Live deploy is T-171, deferred.
- handoff-note: `.env.example` and `DEPLOY.md` created at repo root. All 7 PRD §9.2 vars documented with scoping notes and safe placeholders. DEPLOY.md covers Supabase/Resend/Turnstile/Vercel provisioning steps, env var table, post-deploy checklist, and BOOKING_URL launch note.

## T-110 — Supabase `leads` migration SQL (written, not applied)
- status: done
- owner: data-agent (Slice 2)
- domain: data
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: A Supabase CLI migration file creates `leads` exactly per PRD §7 (columns, defaults, band check, indexes); RLS enabled with NO anon/authenticated policies. Ready to `supabase db push` once a project exists. NOT applied to a live project (D-009).
- notes: PRD §7. RLS-locked; all access server-side via service role.
- handoff-note: `supabase/migrations/20260529000000_leads.sql` — verbatim PRD §7. RLS enabled, zero policies. Composite index on (intent_band, created_at desc); unique index on token. Ready for `supabase db push`.

## T-111 — Server Supabase client (service role)
- status: done
- owner: data-agent (Slice 2)
- domain: data
- depends-on: [T-100, T-110]
- handoff-to: unassigned
- acceptance: `lib/supabase-server.ts` exports a service-role client usable only server-side; never imported into client components.
- notes: PRD §9.2. `@supabase/supabase-js`, no ORM.
- handoff-note: `lib/supabase-server.ts` — `import 'server-only'` guard, `createSupabaseServer()` factory, `Lead` type. submit-agent and frontend-agent can import both.

### Scoring & config

## T-120 — Typed quiz config (Appendix A)
- status: done
- owner: scoring-agent (Slice 2)
- domain: scoring
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: `lib/quiz-config.ts` encodes all Appendix A questions, options, and point values as typed data; readiness vs qualifier questions distinguished.
- notes: PRD Appendix A, §5 page 2. Ship verbatim per D-006.
- handoff-note: `lib/quiz-config.ts` — all 10 Appendix A questions typed. READINESS_MAX=100, INTENT_MAX=100 (computed dynamically). Q6 is free-text/0pts. option ids follow pattern q{N}_{a,b,c,d}.

## T-121 — Scoring functions + bands
- status: done
- owner: scoring-agent (Slice 2)
- domain: scoring
- depends-on: [T-120]
- handoff-to: unassigned
- acceptance: `lib/scoring.ts` exports `computeReadiness` (0–100 normalized), `computeIntent` (0–100), `bandFor` (hot≥65/warm35–64/cold<35). Unit-testable pure functions.
- notes: PRD §6 weights + Appendix A.
- handoff-note: `lib/scoring.ts` — pure functions, `Answers` type exported. `bandFor` thresholds: hot>=65, warm>=35, cold<35. Free-text Q6 resolves to 0 pts via guard in resolvePoints.

## T-122 — Zod submission schema + shared types
- status: done
- owner: scoring-agent (Slice 2)
- domain: scoring
- depends-on: [T-120]
- handoff-to: unassigned
- acceptance: One Zod schema validates the submission payload (answers, name, email, turnstile token, honeypot, utm) and types the answers shared across config/scoring/action.
- notes: PRD §9.1, §9.2 skeleton step 1.
- handoff-note: `lib/schema.ts` — SubmissionSchema, SubmissionPayload, UtmData, AnswersSchema. honeypot max(0) rejects bots. variant field per D-011. Answers re-exported from scoring.ts.

### Email

## T-150 — Resend client + send helpers
- status: done
- owner: email-agent (Slice 2)
- domain: email
- depends-on: [T-100, T-101]
- handoff-to: unassigned
- acceptance: `lib/resend.ts` exports a server-only Resend client (reads `RESEND_API_KEY`) + typed send helpers, with a dry-run/preview path so it works before a key exists. Key never reaches client. No live send / no domain verification (D-009).
- notes: PRD §8, §9.2.
- handoff-note: `lib/resend.ts` — server-only, dry-run when RESEND_API_KEY absent/'dry-run'. sendResultEmail + sendHotLeadAlert exported. Caller constructs ReactElement and passes as emailComponent.

## T-151 — React Email templates (result + Hot alert)
- status: done
- owner: email-agent (Slice 2)
- domain: email
- depends-on: [T-150, T-121]
- handoff-to: unassigned
- acceptance: `emails/` has a lead result email (score + breakdown + matched CTA) and an internal Hot-lead alert (email, business, industry, score, answers summary). Previewable.
- notes: PRD §8.
- handoff-note: emails/result-email.tsx (ResultEmail component, band-matched CTA/copy) and emails/hot-lead-alert.tsx (HotLeadAlert, urgency footer). Both use @react-email/components inline styles, previewable.

### Frontend

## T-130 — Brand/visual system (Tailwind tokens + primitives)
- status: done
- owner: frontend-agent (Slice 2)
- domain: frontend
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: Tailwind theme has the PRD §9.3 tokens (base/surface/text/muted/accent), typography (Inter-like), rounded surfaces, restrained motion. Shared button/card/section primitives. Hand-built, no shadcn.
- notes: PRD §9.3.
- handoff-note: globals.css replaces Geist/dark-mode with @theme inline PRD §9.3 tokens; layout.tsx uses Inter (--font-inter); button/card/section primitives in components/ui/. hero.tsx/splite.tsx untouched.

## T-131 — Page 1 Landing (`/`)
- status: done
- owner: frontend-agent (Slice 3)
- domain: frontend
- depends-on: [T-130]
- handoff-to: analytics-agent
- acceptance: Landing built from `orchestration/content/landing.md` (approved copy): all sections + dual CTA → `/assessment`, UTM passthrough. **Hero A/B/C (D-011):** render one of 3 hero blocks (A/B/C) by an assigned `variant`; assign randomly on first visit, persist in a cookie, and append `variant` to the `/assessment` link. Rest of page identical across variants. **Hero visual = interactive 3D Spline scene re-skinned to light/indigo brand (D-013)**: lazy-loaded (`React.lazy`+`<Suspense>`), client-only, cursor-follow indigo glow; placeholder robot scene until a branded `.splinecode` is commissioned; hand-built `cn` util + thin `SplineScene` wrapper, NOT shadcn. The 3D visual + CTA are shared across A/B/C; only headline+subhead vary. `landing_view`/`quiz_start` hooks carry `variant`.
- notes: PRD §5 page 1, §9.3. Copy + design in content/landing.md. Mock proof numbers (D-012). Hero 3D per D-013.
- handoff-note: app/page.tsx (RSC, async searchParams + cookies): full landing from landing.md. proxy.ts (renamed from middleware.ts per Next.js 16 convention) assigns hero_variant cookie randomly on first visit. Hero accepts variant+assessmentHref props. components/landing-analytics.tsx fires landing_view+variant. components/quiz-start-button.tsx fires quiz_start+variant on bottom CTA click. Hero CTA fires quiz_start inline. All sections: problem, GOLM pitch, proof strip (D-012 mock), what-you-get, bottom CTA. analytics-agent wires T-160/161.

## T-132 — Page 2 Assessment (`/assessment`)
- status: done
- owner: frontend-agent (Slice 3)
- domain: frontend
- depends-on: [T-130, T-120]
- handoff-to: submit-agent
- acceptance: Client component stepper (useReducer), one question/step from `lib/quiz-config`, final email-capture step with name+email+honeypot+Turnstile widget. **Use `components/ui/progress-indicator.tsx` `QuizProgressNav` (D-014)** for the progress (dots) + Back/Continue nav — pass `step`/`total`/`canContinue` (gate until the current question is answered)/`onBack`/`onContinue`; do NOT rebuild it. Copy from `content/assessment.md`. Calls `submitAssessment`, redirects to `/results/[token]`.
- notes: PRD §5 page 2. Throwaway demo replaced with real Appendix A wiring.
- handoff-note: app/assessment/page.tsx (server wrapper, exports metadata, wraps in Suspense for useSearchParams). app/assessment/stepper.tsx ('use client', useReducer state machine, 10 QUIZ_QUESTIONS from lib/quiz-config.ts, QuizProgressNav D-014, auto-advance 300ms on single-choice, milestone nudges Q4/Q7/Q9, email capture step, honeypot, Turnstile via @marsidev/react-turnstile, calls submitAssessment+catches throws, redirects to /results/[token]). Analytics hooks: quiz_start, quiz_question_answered, quiz_email_submitted, quiz_completed. submit-agent T-140 implements submitAssessment for end-to-end.

## T-133 — Page 3 Result (`/results/[token]`)
- status: done
- owner: frontend-agent (Slice 3)
- domain: frontend
- depends-on: [T-130, T-111, T-121]
- handoff-to: analytics-agent
- acceptance: RSC reads lead by `token` server-side; renders Readiness Score + 2–4 tailored insight bullets; routes CTA emphasis by band (Hot=book call, Warm=quote, Cold=newsletter). Result events hooked.
- notes: PRD §5 page 3, §6.
- handoff-note: app/results/[token]/page.tsx (RSC, async params, try/catch around createSupabaseServer for D-009 dev env). lib/insights.ts created: selectInsights(answers, band) → string[] per results.md thresholds. components/result-analytics.tsx fires result_view+band on mount. components/result-cta.tsx fires cta_*_click on CTA clicks. Not-found + error states rendered gracefully. Band-matched: score chip (indigo/amber/slate), headline, framing, 2-4 insight bullets, primary CTA, secondary actions strip. analytics-agent wires T-161.

### Submit action & anti-spam

## T-140 — `submitAssessment` Server Action
- status: done
- owner: submit-agent
- domain: submit
- depends-on: [T-111, T-121, T-122, T-150]
- handoff-to: frontend-agent
- acceptance: Action runs validate(Zod) → verify Turnstile + reject honeypot → score → insert via service role → send result email (+Hot alert if band=hot) → return `{ token }`. Secrets server-only.
- notes: PRD §9.2 skeleton. The funnel's spine; integrates data+scoring+email.
- handoff-note: app/actions/submit-assessment.ts fully implemented. Exports `submitAssessment(payload: unknown): Promise<SubmitResult>` and `SubmitResult = { token: string } | { error: string }`. lib/insights.ts created (selectInsights). Pipeline: Zod validate → honeypot reject (pre-DB) → Turnstile verify (pre-DB, skip if TURNSTILE_SECRET_KEY absent/='test') → score → UUID token → Supabase insert (dry-run log if env vars absent per D-009) → selectInsights → sendResultEmail → sendHotLeadAlert (if hot) → return { token }. NEXT_PUBLIC_SITE_URL added to .env.example. All secrets server-only. npm run build: PASSED, TypeScript: clean. frontend-agent: wire T-132 submit call + redirect to /results/[token]; T-133 can import selectInsights from lib/insights.ts for server-side insight render.

## T-141 — Anti-spam hardening (Turnstile verify + honeypot)
- status: done
- owner: submit-agent
- domain: submit
- depends-on: [T-140]
- handoff-to: unassigned
- acceptance: Turnstile token verified server-side against secret; honeypot-filled submissions rejected before any DB write. Failure paths return clean client errors.
- notes: PRD §9.2 security.
- handoff-note: Anti-spam integrated into T-140 (submit-assessment.ts). Honeypot: SubmissionSchema enforces max(0) + explicit pre-DB guard rejects non-empty value silently. Turnstile: POST to Cloudflare siteverify vs TURNSTILE_SECRET_KEY; failure = user-facing message, no internals; missing/='test' key = skip+log for dev. All error returns are { error: string } with user-safe copy only — no DB error details or stack traces leak to client.

### Analytics & attribution

## T-160 — UTM capture → lead row
- status: pending
- owner: unassigned
- domain: analytics
- depends-on: [T-131, T-122, T-140]
- handoff-to: unassigned
- acceptance: UTM params captured on landing, carried through the quiz link, included in the submission payload, and persisted to `leads` (utm_source/medium/campaign, referrer). **Also capture the hero `variant` (D-011)** through the same path and store it on the lead row in `answers` JSONB (zero migration) for Hot-lead-yield-per-variant analysis.
- notes: PRD §10. Variant tracking per D-011.

## T-161 — Analytics events (GA4 + Clarity)
- status: pending
- owner: unassigned
- domain: analytics
- depends-on: [T-131, T-132, T-133]
- handoff-to: unassigned
- acceptance: Full event funnel fires: landing_view → quiz_start → quiz_question_answered → quiz_email_submitted → quiz_completed → result_view → cta_*_click. GA4 + Clarity installed. **`landing_view` and `quiz_start` carry a `variant` (A/B/C) dimension (D-011)** so start-rate per variant is measurable in GA4.
- notes: PRD §10. Variant dimension per D-011.

### Hardening & ship

## T-170 — Sentry + end-to-end test (one lead per band)
- status: pending
- owner: unassigned
- domain: submit
- depends-on: [T-140, T-133, T-151, T-141]
- handoff-to: unassigned
- acceptance: Sentry on the submit path. A fake submission of each band (hot/warm/cold) flows end-to-end: row inserted, correct band/CTA, correct emails sent. Security demo beat reproducible (network tab shows no secret; RLS rejects anon write).
- notes: PRD §11.9, §11.11, §9.2.

## T-171 — Deploy to Vercel + verify live  [DEFERRED — needs human keys]
- status: blocked
- owner: human (Dave)
- domain: infra
- depends-on: [T-170, T-160, T-161, T-101]
- handoff-to: human
- acceptance: Production deploy on `*.vercel.app`; full funnel verified live end-to-end; env vars set in Vercel (not bundle).
- notes: BLOCKED on D-009 — no Vercel/Supabase/Resend projects yet. Agents complete everything else code-side and leave a DEPLOY.md runbook (T-101). Unblock when Dave provisions accounts + plugs in keys. Domain interim per Q-04.

# roster.md — Team & Handoff Map

Populated during agent onboarding (`PROTOCOL.md` §3). Two parts:

1. **Self-descriptions** — each agent writes, in its own words, what it does (Phase A).
2. **Handoff map** — built in the all-hands (Phase B): for each agent, who it hands
   off to and who hands off to it.

No build work is claimed until this file is populated.

---

## Team

| Agent | Domain | Owns (Task.md) |
|---|---|---|
| infra-agent | infra | T-100, T-101, T-171 |
| data-agent | data | T-110, T-111 |
| scoring-agent | scoring | T-120, T-121, T-122 |
| frontend-agent | frontend | T-130, T-131, T-132, T-133 |
| submit-agent | submit | T-140, T-141, T-170 |
| email-agent | email | T-150, T-151 |
| analytics-agent | analytics | T-160, T-161 |

---

## Self-descriptions

_(Phase A completed 2026-05-29 — all 7 agents self-described. Written by each agent in its own words, collected by orchestrator.)_

### infra-agent

I stand up the application shell for the GOLM Lead-Generation Funnel and own both ends of the build: first commit and final production deploy. My primary deliverables are three tasks: T-100 (scaffold the Next.js 16 App Router project with TypeScript, Tailwind, lucide-react, Sentry, and npm lockfile, structured to the exact file tree in PRD §9.2), T-101 (produce a `.env.example` documenting all seven PRD §9.2 environment variables with correct public/server-only scoping and a `DEPLOY.md` runbook, without creating a live Vercel project per D-009), and T-171 (receive the hardened, tested app from submit-agent and execute the final production deploy to the `*.vercel.app` interim domain). Every other agent is blocked on T-100 — nothing is buildable until the repo exists and the env contract is established. I do not own any business logic (scoring, emails, UI pages, or the Server Action itself); I only own the infrastructure those components run on, and I gate the production deploy on submit-agent's T-170 sign-off before shipping T-171.

### data-agent

I own the system of record for the GOLM lead-gen funnel: the Supabase migration that creates the `leads` table exactly as specified in PRD §7, and the server-only service-role client (`lib/supabase-server.ts`) that every other agent uses to read and write it. My schema is precise — a single table with `answers` as JSONB (so leads can be re-scored historically), `readiness_score` and `intent_score` as first-class integer columns for direct SQL sorting, an `intent_band` column constrained to `hot|warm|cold`, a unique index on `token` (the unguessable result-page key), and a composite index on `(intent_band, created_at desc)` for the dashboard sort-by-intent use case. RLS is enabled with zero anon or authenticated policies — a hard lock, not a soft default — meaning the anon Supabase client cannot read or write a single row; all access flows server-side through the service role key. I receive the scaffolded repo from infra-agent after T-100 and hand off the working server client to submit-agent (T-140, for inserts) and frontend-agent (T-133, for server-side reads by token on the result page).

### scoring-agent

I am the scoring brain of the GOLM lead-gen funnel. I own three tightly coupled deliverables: the typed quiz config (`quiz-config.ts`) that encodes every question and point value from Appendix A verbatim, the pure scoring functions (`scoring.ts`) that compute both a public Readiness Score (0–100, summing Q1–6 readiness points and normalizing) and a hidden Intent Score (0–100, derived solely from the four qualifier questions on timeline, budget, authority, and active search), and the Zod submission schema that validates and types the full payload (answers, name, email, Turnstile token, honeypot, UTMs) as the shared contract for frontend and server action alike. My intent score maps leads into three routing bands: hot (score ≥ 65, trigger immediate GOLM alert and book-a-call CTA), warm (35–64, request-a-quote flow), or cold (< 35, nurture/newsletter path). All scoring logic is pure and unit-testable so submit-agent can call it without side effects; `quiz-config.ts` and `scoring.ts` together are the single source of truth for weights and thresholds, which are calibration knobs for post-launch tuning rather than items to redesign now.

### frontend-agent

I build the three pages that make up the GOLM lead-generation funnel — Landing (`/`), Assessment (`/assessment`), and Result (`/results/[token]`) — along with the shared visual system that unifies them in hand-built Tailwind with no component library. Each page has exactly one conversion goal: the landing page exists to push visitors to start the quiz, the assessment page exists to carry them through 8–12 scored questions and collect their email, and the result page exists to reveal their Readiness Score (0–100) and route them to the right next step based on their intent band (Hot to a booking call, Warm to a quote request, Cold to a newsletter). The visual system follows PRD §9.3 — a clean, minimal, light aesthetic using the five starter tokens (base `#FFFFFF`, surface `#F8FAFC`, text `#0F172A`, muted `#64748B`, accent `#4F46E5`), bold tight headings in an Inter-like sans, 12–16px rounded surfaces, and restrained hover motion only. I also own the event hook stubs (`landing_view`, `quiz_start`, `quiz_question_answered`, `quiz_email_submitted`, `quiz_completed`, `result_view`, `cta_*_click`) that the analytics-agent will wire, and I receive `quiz-config.ts` from scoring-agent, the server client from data-agent, and the `submitAssessment` action from submit-agent before I can complete the assessment and result pages.

### submit-agent

I own the funnel's spine: the `submitAssessment` Server Action is the one and only place a lead row is ever created in Supabase, and every other agent's output flows through me. The fixed action sequence is: validate with Zod (answers, email, name, Turnstile token, honeypot, UTM) → verify Turnstile server-side and reject immediately if the honeypot field is filled → score using `computeReadiness`/`computeIntent`/`bandFor` from scoring-agent → insert into `leads` via service-role client from data-agent → fire result email to the lead and an internal Hot-lead alert to GOLM when `band === 'hot'` via email-agent's helpers → return `{ token }` so the client redirects to `/results/[token]`. I wire — not reimplement — the pieces delivered by data-agent (`supabase-server.ts`), scoring-agent (`scoring.ts` + Zod schema), and email-agent (`resend.ts` + react-email templates), and I hand the working submit path to frontend-agent for the P2 redirect and to analytics-agent for UTM capture. I also own anti-spam hardening (T-141: Turnstile + honeypot) and the end-to-end test suite (T-170) that must prove the full path for each band — row inserted, correct band and CTA, correct emails fired — plus Sentry instrumentation on this path and the security demo beat showing no secret leaves the server and RLS rejects a direct anon write.

### email-agent

I own transactional email for the GOLM lead-gen funnel: a server-only Resend client in `lib/resend.ts` and two v1 React Email templates in `emails/`. The result email goes to every lead after their quiz submission, delivering their Readiness Score, a short answer-driven breakdown, and the CTA matched to their intent band — a booking link (via `BOOKING_URL`) for Hot, a quote prompt for Warm, and a newsletter/guide offer for Cold. The internal Hot-lead alert fires immediately to GOLM only when `intent_band === 'hot'`, carrying the lead's email, business name, industry, score, and an answers summary so GOLM can act on the lead without delay. Both templates are typed and previewable via React Email; the `RESEND_API_KEY` is strictly server-only and never reaches the client bundle. I consume the score and band as inputs passed by submit-agent after the Supabase insert succeeds — I do not recompute scoring — and I expose send helpers that submit-agent calls as the final step in the `submitAssessment` Server Action.

### analytics-agent

I make the funnel measurable end-to-end by owning two things: UTM attribution from first touch to the database row, and the full GA4 + Microsoft Clarity event funnel across all three pages. On the attribution side, I capture `utm_source`, `utm_medium`, `utm_campaign`, and `referrer` when a visitor lands on the landing page, thread those values through the quiz link and the `submitAssessment` payload, and ensure they are persisted to the `leads` table so GOLM can filter and rank channels by Hot-lead yield rather than raw lead volume. On the event side, I instrument the exact ordered sequence — `landing_view`, `quiz_start`, `quiz_question_answered` (with step index), `quiz_email_submitted`, `quiz_completed`, `result_view`, and the result-page CTAs (`cta_book_call_click`, `cta_quote_click`, `cta_newsletter_submit`) — wiring into the event hooks frontend-agent exposes in the pages rather than duplicating them. I do not introduce PostHog or any tooling not already in the stack unless decisions.md authorizes it. My handoff is the fully instrumented app, ready for submit-agent and infra-agent to run end-to-end tests and deploy.

---

## Handoff map (ratified 2026-05-29 — all-hands Phase B complete, no amendments)

Derived from Task.md dependencies. All 7 self-descriptions were reviewed; the proposed map is confirmed without amendment — every agent's stated receives/hands-off matches the map below.

- **infra-agent** → unblocks everyone (repo + env). Receives final hardened app from submit-agent (T-170) before running deploy (T-171).
- **data-agent** ← infra (T-100 repo). → submit-agent (insert in T-140) and frontend-agent (token read in T-133).
- **scoring-agent** ← infra (T-100 repo). → frontend-agent (`quiz-config.ts` for T-132 stepper; scoring for T-133 result render), submit-agent (scoring + Zod for T-140), email-agent (score/band shape for T-151 templates).
- **email-agent** ← infra (env/repo), scoring-agent (score/band shape). → submit-agent (`resend.ts` + templates for T-140).
- **frontend-agent** ← infra (T-100), scoring-agent (`quiz-config.ts`), data-agent (server client for T-133), submit-agent (action wiring for T-132). → analytics-agent (event hook stubs for T-160/T-161), submit-agent (finished UI for T-170 E2E test).
- **submit-agent** ← data-agent, scoring-agent, email-agent, frontend-agent. → frontend-agent (redirect token from T-140), analytics-agent (UTM payload for T-160), infra-agent (hardened + tested app for T-171 deploy).
- **analytics-agent** ← frontend-agent (event hooks), submit-agent (UTM payload). → submit-agent / infra-agent (fully instrumented app for T-170 E2E test + T-171 deploy).

Critical path: **infra (T-100)** → **(data ∥ scoring ∥ email ∥ frontend-visual)** → **submit (T-140/141)** → **analytics (T-160/161)** → **harden+test (T-170)** → **deploy (T-171)**.

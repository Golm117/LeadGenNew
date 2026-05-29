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
- status: pending
- owner: unassigned
- domain: infra
- depends-on: []
- handoff-to: unassigned
- acceptance: `npm run dev` serves an App Router app; Tailwind compiles; lucide-react installed; npm lockfile committed. File tree matches PRD §9.2.
- notes: PRD §11.1, §9.1. TypeScript, no component library.

## T-101 — Vercel project + environment variables
- status: pending
- owner: unassigned
- domain: infra
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: Vercel project linked; all PRD §9.2 env vars defined (placeholders ok) with correct public/server scoping; preview build succeeds.
- notes: PRD §9.2 env table. Secrets server-only.

## T-110 — Supabase `leads` table + RLS migration
- status: pending
- owner: unassigned
- domain: data
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: Migration creates `leads` exactly per PRD §7 (columns, defaults, band check, indexes); RLS enabled with NO anon/authenticated policies. Applied via Supabase CLI.
- notes: PRD §7. RLS-locked; all access server-side via service role.

## T-111 — Server Supabase client (service role)
- status: pending
- owner: unassigned
- domain: data
- depends-on: [T-100, T-110]
- handoff-to: unassigned
- acceptance: `lib/supabase-server.ts` exports a service-role client usable only server-side; never imported into client components.
- notes: PRD §9.2. `@supabase/supabase-js`, no ORM.

### Scoring & config

## T-120 — Typed quiz config (Appendix A)
- status: pending
- owner: unassigned
- domain: scoring
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: `lib/quiz-config.ts` encodes all Appendix A questions, options, and point values as typed data; readiness vs qualifier questions distinguished.
- notes: PRD Appendix A, §5 page 2. Ship verbatim per D-006.

## T-121 — Scoring functions + bands
- status: pending
- owner: unassigned
- domain: scoring
- depends-on: [T-120]
- handoff-to: unassigned
- acceptance: `lib/scoring.ts` exports `computeReadiness` (0–100 normalized), `computeIntent` (0–100), `bandFor` (hot≥65/warm35–64/cold<35). Unit-testable pure functions.
- notes: PRD §6 weights + Appendix A.

## T-122 — Zod submission schema + shared types
- status: pending
- owner: unassigned
- domain: scoring
- depends-on: [T-120]
- handoff-to: unassigned
- acceptance: One Zod schema validates the submission payload (answers, name, email, turnstile token, honeypot, utm) and types the answers shared across config/scoring/action.
- notes: PRD §9.1, §9.2 skeleton step 1.

### Email

## T-150 — Resend client + send helpers
- status: pending
- owner: unassigned
- domain: email
- depends-on: [T-100, T-101]
- handoff-to: unassigned
- acceptance: `lib/resend.ts` exports a server-only Resend client + typed send helpers. Key never reaches client.
- notes: PRD §8, §9.2.

## T-151 — React Email templates (result + Hot alert)
- status: pending
- owner: unassigned
- domain: email
- depends-on: [T-150, T-121]
- handoff-to: unassigned
- acceptance: `emails/` has a lead result email (score + breakdown + matched CTA) and an internal Hot-lead alert (email, business, industry, score, answers summary). Previewable.
- notes: PRD §8.

### Frontend

## T-130 — Brand/visual system (Tailwind tokens + primitives)
- status: pending
- owner: unassigned
- domain: frontend
- depends-on: [T-100]
- handoff-to: unassigned
- acceptance: Tailwind theme has the PRD §9.3 tokens (base/surface/text/muted/accent), typography (Inter-like), rounded surfaces, restrained motion. Shared button/card/section primitives. Hand-built, no shadcn.
- notes: PRD §9.3.

## T-131 — Page 1 Landing (`/`)
- status: pending
- owner: unassigned
- domain: frontend
- depends-on: [T-130]
- handoff-to: unassigned
- acceptance: RSC landing with all PRD §5 sections + dual CTA → `/assessment`, UTM passthrough on the link. `landing_view`/`quiz_start` event hooks present.
- notes: PRD §5 page 1, §9.3.

## T-132 — Page 2 Assessment (`/assessment`)
- status: pending
- owner: unassigned
- domain: frontend
- depends-on: [T-130, T-120]
- handoff-to: unassigned
- acceptance: Client component stepper (useReducer), progress bar, one question/step, final email-capture step with name+email+honeypot+Turnstile widget. Calls `submitAssessment`, redirects to `/results/[token]`.
- notes: PRD §5 page 2. Submit wiring depends on T-140.

## T-133 — Page 3 Result (`/results/[token]`)
- status: pending
- owner: unassigned
- domain: frontend
- depends-on: [T-130, T-111, T-121]
- handoff-to: unassigned
- acceptance: RSC reads lead by `token` server-side; renders Readiness Score + 2–4 tailored insight bullets; routes CTA emphasis by band (Hot=book call, Warm=quote, Cold=newsletter). Result events hooked.
- notes: PRD §5 page 3, §6.

### Submit action & anti-spam

## T-140 — `submitAssessment` Server Action
- status: pending
- owner: unassigned
- domain: submit
- depends-on: [T-111, T-121, T-122, T-150]
- handoff-to: unassigned
- acceptance: Action runs validate(Zod) → verify Turnstile + reject honeypot → score → insert via service role → send result email (+Hot alert if band=hot) → return `{ token }`. Secrets server-only.
- notes: PRD §9.2 skeleton. The funnel's spine; integrates data+scoring+email.

## T-141 — Anti-spam hardening (Turnstile verify + honeypot)
- status: pending
- owner: unassigned
- domain: submit
- depends-on: [T-140]
- handoff-to: unassigned
- acceptance: Turnstile token verified server-side against secret; honeypot-filled submissions rejected before any DB write. Failure paths return clean client errors.
- notes: PRD §9.2 security.

### Analytics & attribution

## T-160 — UTM capture → lead row
- status: pending
- owner: unassigned
- domain: analytics
- depends-on: [T-131, T-122, T-140]
- handoff-to: unassigned
- acceptance: UTM params captured on landing, carried through the quiz link, included in the submission payload, and persisted to `leads` (utm_source/medium/campaign, referrer).
- notes: PRD §10.

## T-161 — Analytics events (GA4 + Clarity)
- status: pending
- owner: unassigned
- domain: analytics
- depends-on: [T-131, T-132, T-133]
- handoff-to: unassigned
- acceptance: Full event funnel fires: landing_view → quiz_start → quiz_question_answered → quiz_email_submitted → quiz_completed → result_view → cta_*_click. GA4 + Clarity installed.
- notes: PRD §10.

### Hardening & ship

## T-170 — Sentry + end-to-end test (one lead per band)
- status: pending
- owner: unassigned
- domain: submit
- depends-on: [T-140, T-133, T-151, T-141]
- handoff-to: unassigned
- acceptance: Sentry on the submit path. A fake submission of each band (hot/warm/cold) flows end-to-end: row inserted, correct band/CTA, correct emails sent. Security demo beat reproducible (network tab shows no secret; RLS rejects anon write).
- notes: PRD §11.9, §11.11, §9.2.

## T-171 — Deploy to Vercel + verify live
- status: pending
- owner: unassigned
- domain: infra
- depends-on: [T-170, T-160, T-161, T-101]
- handoff-to: unassigned
- acceptance: Production deploy on `*.vercel.app`; full funnel verified live end-to-end; env vars set in Vercel (not bundle).
- notes: PRD §11.11. Domain remains interim per Q-04.

# decisions.md — Human-in-the-Loop Ledger

Resolves anything `PRD.md` left open or ambiguous. **Append-only. Immutable once
written.** Agents read this so they never re-ask a settled question. They never
silently overrule it. To reverse a decision, add a new entry that supersedes the old.

Entry format:

```
### D-NNN — <short title>
- Question:
- Answer:
- Decided by:
- Date:
- Supersedes: (D-NNN or —)
```

---

## Resolved

### D-001 — Agent split granularity
- Question: How finely to split the specialist build agents?
- Answer: 7 agents by domain — infra · data · scoring · frontend · submit (action + anti-spam) · email · analytics. 1:1 with PRD §9.2 architecture and §11 build steps.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

### D-002 — Remote access mechanism
- Question: How does the remote env (env_01HP1GyGVfbJx32k1JEb4YxB) get these agents?
- Answer: Git-tracked repo. `.claude/agents/` + `orchestration/` are committed; the remote CC session clones/pulls the same repo. No extra transport.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

### D-003 — Agent scope
- Question: Generic reusable agents or funnel-specific?
- Answer: Funnel-specific. Each agent's `.md` encodes this PRD's actual work (scoring model, Appendix A, etc.) for fastest ramp-up.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

### D-009 — No external accounts yet: build code-complete, human plugs in keys
- Question: Do Supabase / Vercel / Resend projects exist for the build to provision against?
- Answer: **No projects exist.** Agents build every system **code-complete** with env-var placeholders and clean integration seams, but must **NOT create live accounts/projects** or call paid/external APIs. The human plugs in API keys/projects as needed. Specifically:
  - **Supabase (T-110/111):** write the migration SQL + server client expecting env vars; do NOT apply to a live project. Migration must be ready to `supabase db push` once a project exists.
  - **Vercel (T-101/171):** produce a `.env.example` (all PRD §9.2 vars, correctly scoped) and a `DEPLOY.md` runbook; do NOT create a live Vercel project. Deploy (T-171) is **deferred** until the human provides keys.
  - **Resend (T-150/151):** build the client + templates reading `RESEND_API_KEY`; do NOT send live mail or verify a domain. Use a preview/dry-run path for testing.
  - **Turnstile:** code the widget + server verify against env keys; works once real keys are provided.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

### D-010 — Landing positioning: fully agnostic verticals (resolves Q-01)
- Question: Which niche industries to name in landing/quiz copy?
- Answer: **Name none.** Landing copy speaks purely to the pain pattern ("niche operations and logistics businesses"), no specific verticals. Widest net for v1.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

### D-011 — Hero A/B/C copy test
- Question: Run one hero or test variants?
- Answer: A/B/C test of the **hero block only** (headline + subhead); the rest of the page is identical across variants for clean measurement. Control = Variant A (outcome-led); B = cost-led; C = blunt. Copy in `orchestration/content/landing.md`.
  - **Mechanism (no new platform):** random assignment on first visit, persisted in a cookie, carried as a `variant` param through the quiz link, and stored on the lead row in the existing `answers` JSONB (zero migration).
  - **Measurement:** GA4 `variant` dimension on `landing_view` + `quiz_start` (start-rate per variant), and `variant` on the lead row enables Hot-lead-yield per variant — the real metric.
  - Owners: frontend-agent (assignment + render), analytics-agent (events + dimension), submit-agent (variant into payload/lead).
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

### D-012 — Credibility proof numbers: mock placeholders for v1
- Question: Real proof figures for the credibility strip?
- Answer: Use mock placeholder numbers for v1 (in `content/landing.md`), swap for real figures in a later copy pass. Not a blocker.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

### D-004 through D-008 — PRD §12 items: adopt PRD interim defaults for v1
- Question: How to handle the five PRD §12 "Decisions to Confirm" for the v1 build?
- Answer: Build v1 on the PRD's stated interim defaults (below). These are not blockers; the deeper choices remain flagged for human sign-off **before launch** (see Open section).
  - Q-01 Niche industries → generic niche-pain copy + placeholder verticals; copy pass later.
  - Q-02 Booking tool → plain `BOOKING_URL` link.
  - Q-03 Question set + weights → ship Appendix A verbatim; calibrate post-launch.
  - Q-04 Domain → `*.vercel.app` interim.
  - Q-05 Result shareability → shareable token link, no expiry.
- Decided by: Dave (via confirmation phase)
- Date: 2026-05-29
- Supersedes: —

### D-013 — Hero gets an interactive 3D (Spline) visual, re-skinned to brand
- Question: How to add visual appeal to the hero beyond the static score gauge?
- Answer: The hero **right-side visual becomes an interactive 3D Spline scene**, re-skinned to the light/indigo brand — NOT the black-card demo. It becomes the hero focal point (flanks/replaces the static score gauge).
  - **Perf is the known tradeoff** (Spline runtime + WebGL hurts mobile LCP on a conversion funnel). Mitigate: `React.lazy` + `<Suspense>` fallback, client-only, deferred/lazy load; keep the rest of the page light and asset-free.
  - **Scene asset:** the generic Spline robot is a **placeholder only**. A branded `.splinecode` scene (indigo, an ops/abstract motif that fits GOLM) must be commissioned before launch — tracked in Open.
  - **Project is not shadcn:** integrate hand-built — add a `cn` util + a thin `SplineScene` wrapper; do NOT pull in shadcn's card/token system. Deps: `@splinetool/react-spline`, `@splinetool/runtime`, `framer-motion` (cursor-follow indigo glow).
  - **A/B/C unaffected (D-011):** only headline+subhead vary across A/B/C; the 3D visual + CTA are shared, so the test stays measurable.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: relaxes the "score-gauge only / hero motion = nothing else" flourish constraint in `content/landing.md` design notes, for the hero visual specifically. Rest of §9.3 restraint stands.
- Follow-up (2026-05-29): interim hero polish committed — robot recolored toward **cyan/teal** via a CSS hue-rotate + centered screen-blend overlay (approximation only; the real recolor rides on the branded `.splinecode`, still Open), and the cursor-follow glow lifted to the section so it tracks across the **whole hero**.

### D-014 — Page-2 questionnaire uses `QuizProgressNav` for stepper progress + nav
- Question: What control drives the Page-2 quiz's progress indicator and Back/Continue navigation?
- Answer: Use `components/ui/progress-indicator.tsx` (`QuizProgressNav`), re-skinned from the user-provided 21st.dev component.
  - **Re-skinned to brand indigo** (`#4F46E5` family); original blue dropped.
  - **Progress style = dots** (Dave's call): a row of dots that scales to N steps — filled/current dots indigo, current dot ring+scaled, upcoming slate-200; "Question X of N" caption, no percentage. (An earlier percentage-**bar** iteration was rejected in favour of dots.)
  - **Generalized** from the source's 3 hardcoded steps to any N.
  - **Presentational control**, gated by `canContinue` (Continue disabled until the current question is answered); props `step`, `total`, `canContinue`, `onBack`, `onContinue` (+ optional labels). Keeps the animated Back-expand / Continue-collapse transition + the finish `CircleCheck` state.
  - **No new deps** — `framer-motion`, `lucide-react`, and `cn` are already present.
  - `app/assessment/page.tsx` currently holds a **throwaway demo** (mock questions) to preview the control; T-132 replaces it with the real Appendix A wiring.
- Decided by: Dave
- Date: 2026-05-29
- Supersedes: —

---

## Open / awaiting human

Still needs a human call **before launch** (v1 builds on interim defaults per D-004..008):

- **Q-02 — Booking tool**: Cal.com / Calendly / custom embed (plain link until then).
- **Q-04 — Domain**: golm.ca subpath vs dedicated domain (vercel.app until then).
- **Credibility numbers**: replace D-012 mock figures with real ones before launch.
- **Branded Spline scene (D-013)**: commission a custom indigo/brand `.splinecode` scene to replace the placeholder robot demo before launch.

_(Q-01 resolved by D-010 — fully agnostic.)_

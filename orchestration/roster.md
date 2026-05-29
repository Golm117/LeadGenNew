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

_(Phase A — each agent appends its own, in its own words, on first activation. Not pre-written.)_

### infra-agent
_(pending self-description)_

### data-agent
_(pending self-description)_

### scoring-agent
_(pending self-description)_

### frontend-agent
_(pending self-description)_

### submit-agent
_(pending self-description)_

### email-agent
_(pending self-description)_

### analytics-agent
_(pending self-description)_

---

## Handoff map (PROPOSED — confirm in Phase B all-hands)

Derived from Task.md dependencies. The all-hands either ratifies this or amends it.

- **infra-agent** → unblocks everyone (repo + env). Receives final app from submit-agent before deploy (T-171).
- **data-agent** ← infra. → submit-agent (insert) and frontend-agent (token read).
- **scoring-agent** ← infra. → frontend-agent (quiz-config, result render), submit-agent (scoring + Zod), email-agent (score/band).
- **email-agent** ← infra (env), scoring (band/score). → submit-agent (send helpers).
- **frontend-agent** ← infra, scoring (config), data (token read), submit (action wiring). → analytics-agent (event hooks), submit-agent (E2E test).
- **submit-agent** ← data, scoring, email, frontend. → frontend (redirect), analytics (UTM payload), infra (hardened app for deploy).
- **analytics-agent** ← frontend (event hooks), submit (payload). → submit/infra (E2E + deploy).

Critical path: infra → (data ∥ scoring ∥ email ∥ frontend-visual) → submit → analytics → harden → deploy.

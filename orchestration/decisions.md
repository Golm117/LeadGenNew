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

---

## Open / awaiting human

Still needs a human call **before launch** (v1 builds on interim defaults per D-004..008):

- **Q-01 — Niche industries**: final verticals for landing/quiz copy (placeholders used until then).
- **Q-02 — Booking tool**: Cal.com / Calendly / custom embed (plain link until then).
- **Q-04 — Domain**: golm.ca subpath vs dedicated domain (vercel.app until then).

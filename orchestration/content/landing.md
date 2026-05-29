# Landing Page Content — Page 1 (`/`)

Approved copy + design for T-131. Source of truth for landing copy. Verticals are
**fully agnostic** (D-010). One job: start the quiz. Visual language per PRD §9.3.

See decisions: D-010 (agnostic), D-011 (hero A/B/C test), D-012 (mock proof numbers).

---

## Hero — A/B/C test (HERO BLOCK ONLY varies; rest of page is shared)

Three variants of **headline + subhead only**. Everything below the hero is identical
across variants so the test is measurable. **Control = Variant A.** Assignment, tracking,
and measurement: see D-011 and tasks T-131 / T-160 / T-161.

Shared across all variants:
- **CTA button:** `Get your Custom Software Readiness Score — 2 min` → `/assessment` (carry UTM + `variant`)
- **Micro-line under CTA:** *Free · 2 minutes · Results instantly*
- **Visual:** radial 0–100 score gauge, needle in upper band, illustrative sample
  **"78 / 100 — Strong fit."** Indigo fill, soft gradient splash behind. Split hero
  (copy left / gauge right on desktop; stacked on mobile).

### Variant A — Outcome-led (CONTROL)
- **Headline:** Software built for how your business actually works.
- **Subhead:** Stop forcing your operations into tools made for someone else. In two minutes, see whether custom software is worth it for you — and where you're losing time today.

### Variant B — Cost-led
- **Headline:** The wrong software is quietly costing you hours, money, and growth.
- **Subhead:** Manual entry, constant workarounds, systems that break as you scale. See exactly where your operation is leaking time — in two minutes.

### Variant C — Blunt
- **Headline:** You're forcing your business into software it was never built for.
- **Subhead:** Spreadsheets and five disconnected tools, duct-taped into something that *almost* works. Find out what that's really costing you.

---

## The problem (shared)
**Heading:** Sound familiar?
- Your real workflow lives in spreadsheets, sticky notes, and people's heads.
- You pay for tools that each do 60% of what you need — and none of them talk to each other.
- Every new order or client adds manual steps, and the cracks show as you grow.

**Closer:** It works… until it doesn't. And it never really scales.

## What GOLM does (shared)
**Heading:** We build software around your operation — not the other way around.
**Body:** GOLM builds custom software for niche operations and logistics businesses: one
system that fits how you actually work, replaces the spreadsheet-and-duct-tape stack, and
grows with you.

## Credibility — proof strip (shared) — MOCK NUMBERS (D-012)
Placeholder figures for v1; swap for real ones in a later copy pass. Keep as 3–4 stat tiles:
- `40+ custom systems shipped`
- `12 industries served`
- `8+ years building ops software`
- `~15 hrs/week saved per client`

## What you'll get (shared) — the hook, ties to the gauge
**Heading:** In two minutes, you'll know:
- Your **Custom Software Readiness Score (0–100)** — how poised your business is to benefit from custom software.
- **Where** you're losing time and money in your current setup.
- Whether a custom build is **actually worth it for you right now** — straight answer, no pitch.

## CTA repeat (shared)
**Heading:** Find out where you stand.
**Button:** `Get your Custom Software Readiness Score — 2 min`

---

## Design notes (within PRD §9.3)
- **Layout:** split hero (copy ↔ gauge); centered content bands below, alternating white / `#F8FAFC`, generous whitespace.
- **Accent discipline:** indigo `#4F46E5` only on CTAs, gauge fill, and the score number. One soft gradient splash behind the hero — the only flourish.
- **Type:** Inter; large, bold, tight headlines; 16px relaxed body.
- **Motion:** CTA hover-lift; gauge needle eases in on load. Nothing else.
- **CTA frequency:** twice only (hero + bottom).
- **Events:** `landing_view` and `quiz_start` both carry the assigned `variant` (A/B/C).

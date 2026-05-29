# Results Page Content — Page 3 (`/results/[token]`)

Copy for the result page, per intent band. The page is a Server Component that reads
the lead row by `token` server-side and renders the band-matched layout.

Bands: **Hot ≥ 65 · Warm 35–64 · Cold < 35** (PRD §6 thresholds, calibrate post-launch).
Verticals fully agnostic (D-010). Tone: same honest, no-hard-pitch voice as landing.md.

Interpolation markers use `[CAPS]` syntax — replace with real values at render time.

---

## Shared page elements (all bands)

**Browser `<title>`:** `Your Custom Software Readiness Score — GOLM`

**Score display block (shared across all bands, styled differently per band):**
- Large score number: `[READINESS_SCORE]` / 100
- Label beneath: `Custom Software Readiness Score`
- Band label badge (colour-coded):
  - Hot: `Strong fit` (indigo `#4F46E5` background)
  - Warm: `Good potential` (amber / `#D97706`)
  - Cold: `Not yet` (slate / `#64748B`)

**Personal greeting line (above score):**
`Hi [FIRST_NAME] — here's your breakdown.`

*(Use first name if parseable from full_name; fall back to "Hi — here's your breakdown.")*

---

## Band: HOT (intent_score ≥ 65)

### Headline
`Your operation is ready for this. Now is the right time.`

### Score-framing sentence
`A score of [READINESS_SCORE] puts you in the clearest-case bracket we see — the pain is
real, the fit is strong, and your timeline and situation are aligned for a custom build
to actually deliver.`

### Insight bullets (2–4, drawn from their answers)

*Render the bullets that apply based on their specific answer values. Each bullet is one
tight sentence. Examples below — wire to answer thresholds in the render logic:*

- **If Q1 = "A lot" or "Almost everything":**
  `Your operations still run heavily on manual steps — that's recoverable time and
  margin sitting on the table right now.`

- **If Q2 = "Poorly" or "We force it":**
  `Your current software doesn't match how your business actually works, which means
  your team is managing the gap, not the work.`

- **If Q3 = "Significant" or "Constant":**
  `Errors and rework are a recurring cost in your operation — custom software that fits
  your workflow eliminates most of that at the source.`

- **If Q4 = "Yes" or "It's the bottleneck":**
  `Your process is actively limiting growth — what you can take on is constrained by
  your tooling, not your market.`

- **Always shown for Hot:**
  `Your timeline, budget situation, and decision-making position make this a conversation
  worth having now — not later.`

*Show 2–4 bullets. Always include the "always shown" one. Pick the highest-signal
readiness bullets based on point values — don't show all five.*

### CTA block

**Heading:** Let's talk about what a custom build looks like for you.

**Body:**
We'll spend 30 minutes looking at your actual workflow — what's costing you time,
what a fit-for-purpose system would fix, and whether the investment makes sense given
your size and stage. No pressure, no obligation.

**Primary button:** `Book a free 30-minute call →`
**Button href:** `[BOOKING_URL]` *(env var placeholder — plain link until booking tool is chosen; see Open items in decisions.md)*

**Secondary / fallback text** (below button, muted):
Or reply to your results email — we'll get back to you within one business day.

---

## Band: WARM (intent_score 35–64)

### Headline
`There's real opportunity here — with the right scoping.`

### Score-framing sentence
`A score of [READINESS_SCORE] tells us the pain is genuine and a custom build would
likely pay off — but a few things (timeline, budget, or scope) aren't fully in place
yet. That's normal, and it's exactly what a scoping conversation is for.`

### Insight bullets (2–4, drawn from their answers)

- **If Q1 = "A lot" or "Almost everything":**
  `A significant chunk of your operations still runs manually — that's the core of what
  custom software addresses, and your score reflects it.`

- **If Q2 = "Poorly" or "We force it":**
  `You're working around your tools rather than with them. That workaround cost compounds
  as your business grows.`

- **If Q3 = "Noticeable" or "Significant":**
  `There's measurable rework and error cost in your current setup — a scoped build would
  target that specifically.`

- **If Q4 = "Somewhat" or "Yes":**
  `Your current process is applying some drag on growth. Whether a custom build is the
  right unlock depends on scope and timing — which is worth mapping out.`

- **Always shown for Warm:**
  `The pieces aren't all aligned yet, but the opportunity is real. A short scoping call
  helps clarify what "right timing" actually looks like for your operation.`

*Show 2–4 bullets. Always include the "always shown" one.*

### CTA block

**Heading:** Want a clearer picture of what it would take?

**Body:**
Share a bit more about your operation and we'll put together a rough scope — what
a fit-for-purpose build might include, a realistic ballpark, and what we'd need to know
to give you a proper proposal. No cost, no commitment.

**Primary button:** `Request a free scope outline →`

**Button action:** Opens a short embedded form (or links to a scoped intake page)
collecting: business type, main workflow pain, rough size, preferred timeline.
*The exact mechanism (inline form vs. separate page) is a frontend decision — this is
the CTA copy.*

**Form submit confirmation (if inline):**
`Got it. We'll review and send you a scope outline within 2 business days.`

**Secondary / fallback text:**
Or reply to your results email with any questions — we're easy to reach.

---

## Band: COLD (intent_score < 35)

### Headline
`Not the right moment — but that changes.`

### Score-framing sentence
`A score of [READINESS_SCORE] tells us one of two things: either the pain isn't severe
enough yet to justify a custom build, or the timing and conditions (budget, authority,
urgency) aren't in place. Either way, forcing it now wouldn't serve you — but staying
in the loop means you'll know when the picture changes.`

### Insight bullets (2–4, drawn from their answers)

- **If Q1 = "None" or "Some" AND Q4 = "No" or "Somewhat":**
  `Your operations aren't at the point where a custom build would clearly pay for itself
  yet — that's useful to know now rather than after you've started a project.`

- **If Q7 = "Just exploring":**
  `You're in research mode right now, which is exactly when knowing your score is most
  useful — it'll tell you what to watch for as your business grows.`

- **If Q8 = "Not yet":**
  `Budget isn't in place, which matters: custom software is an investment, and the ROI
  case needs to be clear before it makes sense to proceed.`

- **If Q9 = "Researching for someone":**
  `If you're gathering information for someone else, send them your results link — it's a
  useful starting point for that conversation.`

- **Always shown for Cold:**
  `This isn't a "never" — it's a "not yet." Many businesses come back when they hit the
  next growth inflection point and the conditions line up.`

*Show 2–4 bullets. Always include the "always shown" one. For Cold, lean toward
empowering the person to understand their own situation rather than nudging them to act.*

### CTA block

**Heading:** Keep this for when the time is right.

**Body:**
We publish practical content on when and how niche businesses know it's time to move
past the spreadsheet stack — no hype, no spam. Join the list to get it when it's useful.

**Primary button:** `Join the newsletter →`

**Button action:** Email-only opt-in; the lead row already has their email, so this
button can be a lightweight confirmation ("add me to the list") that toggles a
`newsletter_opted_in` flag on the lead row, or routes to a separate subscribe page.
*Implementation detail for submit-agent / data-agent to coordinate — this is the copy.*

**Opt-in confirmation:**
`You're on the list. We'll send useful things, not noise.`

**Secondary / alternative CTA (below the opt-in, lower weight):**
`Download the Build vs. Buy Guide →` *(link to PDF / guide — future asset, placeholder
until guide is created; can suppress this CTA in v1 if asset doesn't exist yet)*

---

## Below the fold (all bands) — secondary actions

All three bands show a quieter secondary section below their primary CTA block. Keep it
visually light — this is an "if you want more" section, not a second pitch.

**Heading:** All three options:

Render all three routing options as equal-weight secondary links, de-emphasised against
whichever was the primary CTA above. This lets a Hot lead read a blog post, or a Cold
lead make a speculative inquiry, without the layout pushing them.

| Option | Label | Destination |
|---|---|---|
| Book a call | `Book a call →` | `[BOOKING_URL]` |
| Request a scope | `Request a scope outline →` | Intake form |
| Newsletter | `Join the list →` | Opt-in |

*The band-matched option above should appear visually distinct (primary button weight)
so the routing is clear. The other two are secondary links.*

---

## Score-result email (reference for email-agent)

The result email sent by Resend mirrors the page 3 content. Key elements to carry over:

- Personal greeting: `Hi [FIRST_NAME],`
- Score + band: `Your Custom Software Readiness Score: [READINESS_SCORE] / 100 — [BAND_LABEL]`
- 2–3 insight bullets (same logic as page 3)
- Band-matched primary CTA with button
- Plain-text fallback link for non-HTML clients
- Sign-off: `— Dave & the GOLM team`

The email does NOT need to reproduce the full page — the score, 2–3 bullets, and one
clear CTA is enough. Page 3 (the token URL) is the canonical destination; include a
`View your full results →` link back to it.

---

## Design notes (results page, within PRD §9.3)

- **Score display:** large, bold number (`[READINESS_SCORE]`) with `/100` beside it in
  muted weight. The indigo `#4F46E5` accent on the score number for Hot; amber for Warm;
  slate for Cold. A simple radial or horizontal gauge fill is the only graphic element needed.
- **Band badge:** small pill-shaped label beside the score (e.g. `Strong fit`), band-colour background.
- **Primary CTA button:** full-width on mobile, consistent with landing.md CTA style.
  Indigo for Hot/Warm; slate for Cold.
- **Insight bullets:** left-aligned list with a subtle indigo or band-colour left border.
  Each is one sentence, no sub-bullets.
- **Secondary CTA section:** visually separated (a soft horizontal rule or whitespace gap);
  lower typographic weight than the primary block above.
- **Token URL handling:** the page URL is `/results/[token]`. The token is unguessable
  (UUID). The page reads the lead row server-side by token. If the token is invalid or
  not found, render a neutral "Results not found" state with a link back to `/assessment`.
- **Share nudge (optional):** a small "Copy results link" button for Hot/Warm leads who
  want to share with a business partner or report-to. Low priority for v1.

---

## Open questions for Dave

1. **Warm CTA mechanism:** inline form on the results page, or link to a separate intake
   page (`/scope-request`)? The latter is cleaner to build and easier to iterate on,
   but adds a navigation step. Recommend the separate page for v1 unless the frontend-agent
   can inline a short 3-field form cleanly.

2. **Cold newsletter opt-in flag:** the lead row already has the email. Does a "join the list"
   click just flip a DB flag, or route to an external list (e.g. Resend audience)? Needs
   coordination between submit-agent and data-agent on the data shape.

3. **Score interpolation in insight bullets:** the copy above maps insights to specific
   answer thresholds. The frontend or a scoring helper needs to select which bullets to
   render. Suggest scoring-agent or submit-agent returns a `selected_insights: string[]`
   array alongside the token, so the results page is purely presentational.

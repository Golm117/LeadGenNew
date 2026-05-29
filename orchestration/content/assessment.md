# Assessment Page Content — Page 2 (`/assessment`)

UX microcopy for the quiz stepper. Questions are **verbatim from Appendix A** — do NOT
reword them or their answer options. Only the surrounding UI copy (intro, helper text,
progress, email-capture step) is defined here. Verticals fully agnostic (D-010).

Voice: same as landing.md — honest, direct, no padding, no empty encouragement. Speak
to the person's real situation. Every line earns its place.

---

## Page-level wrapper

**Browser `<title>` / `<meta name="description">`**
- Title: `Custom Software Readiness Assessment — GOLM`
- Description: `Ten questions about how your business runs today. Takes two minutes. Your score tells you whether custom software is worth it right now.`

---

## Step 0 — Intro / first-step framing

Shown before Q1, or as a "welcome" interstitial inside the stepper.

**Heading:** Let's see where you actually stand.

**Body:**
Ten short questions about how your business runs today. Answer honestly — the score is
only useful if it reflects reality.

No pitch at the end. You'll get your Readiness Score (0–100) and a plain-language read
on where you're losing time and whether a custom build makes sense for you right now.

**CTA to begin:** `Start the assessment →`

**Micro-line beneath (optional, same weight as landing.md's micro-line):**
*Takes about 2 minutes. Results delivered instantly.*

---

## Progress bar

**Text label format:** `Question [N] of 10`

**Milestone nudges** — short inline text shown at key waypoints, not a popup:

| At Q | Display |
|---|---|
| Q4 complete | `Halfway there.` |
| Q7 complete | `Almost done — three more.` |
| Q9 complete | `Last question.` |

Keep milestone text minimal. One line, no exclamation marks.

---

## Questions + helper text

### Q1 — Operations baseline

**Question (verbatim):** How much of your daily operations still run on spreadsheets or manual steps?

**Answer options (verbatim):** None / Some / A lot / Almost everything

**Helper text (below the question, smaller/muted):**
Think about quotes, job tracking, scheduling, invoicing, reporting — any step where
someone updates a spreadsheet or writes something down rather than a system handling it.

---

### Q2 — Software fit

**Question (verbatim):** How well does your current software fit how your business actually works?

**Answer options (verbatim):** Perfectly / Mostly / Poorly / We force it

**Helper text:**
Consider whether your tools were built for your type of work, or whether your team
adapted their process to work around the tool's limitations.

---

### Q3 — Cost of errors / rework

**Question (verbatim):** What's the cost of errors or rework from your current setup?

**Answer options (verbatim):** Negligible / Noticeable / Significant / Constant

**Helper text:**
Include time spent fixing mistakes, re-entering data, chasing down discrepancies,
and re-doing work that a well-wired system would have caught the first time.

---

### Q4 — Growth constraint

**Question (verbatim):** Is your current process holding back growth?

**Answer options (verbatim):** No / Somewhat / Yes / It's the bottleneck

**Helper text:**
If adding a new client, a new service line, or doubling volume would require hiring
extra admin before it would require anything else — that's a process constraint.

---

### Q5 — Company size

**Question (verbatim):** Company size

**Answer options (verbatim):** Solo / 2–10 / 11–50 / 50+

**Helper text:**
Count the people whose day-to-day work touches the operations or workflows you're
thinking about — not just total headcount.

---

### Q6 — Industry

**Question (verbatim):** Industry

**Input type:** Free-text field (with an optional short-list autocomplete for the most
common inputs, but always allow freeform — don't force a dropdown that doesn't fit).

**Placeholder text:** *e.g. Metal fabrication, Environmental services, Freight logistics…*

**Helper text:**
Enter whatever describes your business best. There's no wrong answer — this helps us
tailor the breakdown you'll see on your results page.

---

### Q7 — Timeline (intent qualifier)

**Question (verbatim):** When do you need this solved?

**Answer options (verbatim):** Now / this quarter / This year / Just exploring

**Helper text:**
Be honest here — the result is more useful if it matches where you actually are, not
where you wish you were. "Just exploring" is a completely valid answer.

---

### Q8 — Budget (intent qualifier)

**Question (verbatim):** Do you have budget for a custom build?

**Answer options (verbatim):** Allocated / ready / Exploring / Not yet

**Helper text:**
Custom software projects vary widely in scope and cost. This question isn't a
commitment — it helps us give you a result that's actually relevant to your situation.

---

### Q9 — Authority (intent qualifier)

**Question (verbatim):** Are you the decision-maker?

**Answer options (verbatim):** I decide / I influence / Researching for someone

**Helper text:**
No wrong answer. If you're doing research for a partner, owner, or board, we can
still give you something useful to bring back.

---

### Q10 — Active search (intent qualifier)

**Question (verbatim):** Have you started looking for a solution?

**Answer options (verbatim):** Already getting quotes / Started looking / Not yet

**Helper text:**
This helps us point you to the most relevant next step after your score — whether
that's a conversation, a guide, or just your results to keep on file.

---

## Email capture step — final step before submit

Shown after Q10 is answered. This is the "gate" — answers are held in client state;
nothing is written to the DB until the user submits here.

**Step label in progress bar:** `Your results →` (replaces the `Question N of 10` format)

**Heading:** Your score is ready. Where should we send it?

**Sub-heading / body:**
Enter your name and email below. We'll show your results immediately — and send a copy
to your inbox so you have it later.

**Field labels:**
- `Full name` — placeholder: *Your name*
- `Work email` — placeholder: *you@yourbusiness.com*

**Reassurance line (below the fields, muted/small):**
No spam. One results email, then you're in control of what happens next.
We don't sell email lists or share your data.

**Submit button:** `See My Score →`

**Micro-line beneath button:** *Results load instantly after you submit.*

**Honeypot field:** hidden from real users; label can be anything generic in the HTML
(e.g. `website`) — never shown, never described in copy.

**Turnstile widget:** rendered in the form, above the submit button. Keep visually
unobtrusive — the widget handles its own UI, no copy needed around it beyond standard
"verify you're human" which it handles internally.

---

## Error states

Keep errors specific and non-blaming:

| Error | Message |
|---|---|
| Email field empty | `Please enter your email address.` |
| Email format invalid | `That doesn't look like a valid email — double-check and try again.` |
| Name field empty | `Please enter your name.` |
| Turnstile failed | `We couldn't verify the submission. Please reload and try again, or contact us if this keeps happening.` |
| Server error on submit | `Something went wrong on our end. Your answers are still here — try submitting again in a moment.` |

---

## Design notes (assessment page, within PRD §9.3)

- **One question per step** — the stepper advances on selection (no explicit "Next" needed
  for single-choice questions). Show a brief animation between steps; keep it under 200ms.
- **Q6 (industry free text)** and the email-capture step both have input fields —
  these steps show an explicit `Continue →` / `See My Score →` button.
- **Back navigation:** a quiet back-arrow or "← Back" text link above the question,
  always visible, always functional. Don't trap the user.
- **Progress bar:** top of the stepper, full width, fills as steps complete.
  Use indigo `#4F46E5` fill on a `#F1F5F9` track. Show `Question N of 10` beside it.
- **Selected answer state:** indigo border + light indigo fill on the selected option card.
- **Mobile:** full-width answer cards, large tap targets (min 48px), no hover dependence.
- **Accessibility:** each question is a `<fieldset>` with `<legend>` matching the question
  text; answer options are `<input type="radio">` with visible labels.

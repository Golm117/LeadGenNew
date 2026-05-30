# Assessment Question Design — Checklist & Spec

Working spec for designing the scored self-assessment. Derived from
[scored-self-assessment-quiz-design.md](scored-self-assessment-quiz-design.md).
This governs *how* questions are structured and scored — not what they ask. Run every
question, the scoring model, and the results page through these checks before shipping.

---

## 1. Quiz-level rules

- [ ] **6–10 scored questions.** Don't exceed 10. Fewer is fine if the score still discriminates.
- [ ] **Total time under ~3–5 minutes.** Time, not just count, drives abandonment.
- [ ] **One question per screen.**
- [ ] **Default format = single-select multiple choice** with weighted, behaviorally-anchored options. Use other formats only where the construct demands it (see §2).
- [ ] **Mostly one format**, with deliberate exceptions — don't switch format for novelty.
- [ ] **Email gate placed immediately before the result** (after all questions are answered).
- [ ] **Progress indication:** only if it reads as "already well along" on a short quiz. Bottom-of-screen, visual, no discouraging "1 of 10" that feels slow. Honest "you're more than halfway" beats a crawling bar.

## 2. Choosing a format (per question)

Pick the format that fits the construct — in this priority order:

- [ ] **Single-select MC (default)** — for "which best describes you" / categorical states / qualification. Behaviorally anchor the options.
- [ ] **Likert / rating** — only for a genuine *degree* rating. If used: **5 points** (7 only for a high-importance construct), **every point labeled**, **odd (neutral midpoint)** by default.
- [ ] **Binary (yes/no)** — only for **gates or branching logic**, never as a core scored item (2 levels = low precision, max acquiescence).
- [ ] **Numeric input** — only for a true objective count (e.g., hours, headcount). Add input validation + bin the value into bands.
- [ ] **Avoid sliders and ranking entirely** — higher mobile drop-off, anchoring noise, no measurement gain.

## 3. Per-question checklist (run EVERY question through this)

- [ ] **One idea per question.** No "and" — split double-barreled questions in two.
- [ ] **Neutral wording**, not leading or loaded ("How would you rate X?" not "Don't you agree X is bad?").
- [ ] **Plain and short.** No jargon, no single/double negatives.
- [ ] **Every respondent can answer honestly** — don't assume facts not in evidence; gate first, then ask the conditional.
- [ ] **Asks about concrete, recent, observable behavior** where possible — not a global self-judgment. ("How often in the last month…" beats "Are you good at…".)
- [ ] **Scoring direction is NOT inferable** from the question or option wording (anti-gaming).

## 4. Answer-option rules

- [ ] **3–6 options** per single-select question, well-separated and mutually exclusive.
- [ ] **Behaviorally anchored:** each option describes a real state, e.g.
      `"No written process"` → `"Have one but don't follow it"` → `"Follow it consistently"`.
      The respondent matches reality to a description, not an aspiration to a number.
- [ ] **Options are exhaustive and balanced** (no skew toward one end; cover the full real range).
- [ ] **Randomize option order** where order isn't meaningful (mitigates primacy effects, ~up to 15% shift).
- [ ] **No option telegraphs "this is the high-scoring answer."**

## 5. Anti-inflation rules (the core of a *self*-assessment)

- [ ] Concrete/behavioral options over abstract self-ratings (see §3, §4).
- [ ] **Mix in positively- and negatively-keyed items**; **reverse-score** the negative ones before summing (detects/blunts straight-lining and acquiescence).
- [ ] Keep it **private, self-administered, low-stakes** — reduces impression management.
- [ ] For any touchy item, consider **third-person framing** ("How common is it for people in your role to…").
- [ ] Scoring direction stays hidden throughout.

## 6. Scoring spec

- [ ] Assign each option a **point value** (e.g., 0–4 on a 5-point item; weighted values on single-select).
- [ ] **Reverse-score** negatively-keyed items before summing.
- [ ] **Sum to a raw total**, then **min-max normalize to 0–100**:
      `score = (raw − min_possible) / (max_possible − min_possible) × 100`.
- [ ] **Equal weighting by default.** Only weight an item higher with a *specific, defensible* rationale (a genuinely high-signal question). No arbitrary weights.
- [ ] Confirm items **span the range** so most respondents don't hit the ceiling/floor.

## 7. Banding spec

- [ ] **3–5 bands** with plain-language labels.
- [ ] **Thresholds tied to meaning**, not round numbers — each band must be describable ("people here typically have X but not Y").
- [ ] **Report band + an approximate number** — never decimals, never implied precision the quiz can't support.
- [ ] **Recalibrate thresholds against real response data** once it exists, so bands aren't all empty or all crowded.

## 8. Results-page spec

- [ ] Lead with the **band label** (humans remember the label, not the digits), supported by the **approximate score** + a **one-line interpretation** of what the band means.
- [ ] **Tie every claim to a specific input** — reference the actual answers that drove the score ("you marked X and Y as not yet in place — those are your biggest gaps").
- [ ] **Include honest gaps/weaknesses**, not just praise. Specific and occasionally unflattering reads as real; uniform positivity reads as a horoscope (Barnum/Forer trap).
- [ ] **State the scope** briefly — a short quiz is a directional diagnostic, not a full audit. (This *raises* credibility.)
- [ ] **Benchmarks only if backed by real data.** Never fabricate an "industry average." If no norms yet, interpret against the construct ("a score in this band usually means…").
- [ ] **CTA is specific to the band/answers** ("here's the one thing to fix first"), not a generic "Contact us."
- [ ] **Follow up fast** on the captured lead (the lead-response window is short).

## 9. Pre-launch

- [ ] **Pretest** every question by reading it aloud to a few real people (cognitive testing catches ~85% of problem items).
- [ ] Verify the **full point→raw→0–100→band** pipeline end-to-end with a worst-case, best-case, and contradictory answer set.
- [ ] Plan **what to A/B test** and **what to recalibrate** after the first batch of real responses.

---

### Quick reference (defaults)

| Decision | Default |
|---|---|
| Question count | 6–10 |
| Time | < 3–5 min |
| Primary format | Single-select MC, behaviorally anchored |
| Rating scale (when used) | 5 pts (7 if important), all labeled, odd/neutral |
| Options per single-select | 3–6 |
| Binary | Gates/branching only |
| Sliders / ranking | Avoid |
| Weighting | Equal, unless a real rationale |
| Score | Sum → min-max normalize to 0–100 |
| Bands | 3–5, meaning-anchored thresholds |
| Score display | Band + approximate number (no decimals) |
| Email gate | Immediately before the result |

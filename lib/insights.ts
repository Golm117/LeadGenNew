// insights.ts — Tailored insight bullets for the result email and results page.
// Pure function: answers + band → string[]. No side effects.
// Used by: app/actions/submit-assessment.ts (email step) + app/results/[token]/page.tsx.
//
// Spec note (assessment-question-design-spec.md §8): every bullet is tied to a
// SPECIFIC answer the person gave — no generic flattery (Barnum/Forer trap). Warm
// and cold results name an honest gap, not just praise. The hours bullet quotes the
// respondent's own admin-time estimate (q5) so the result reads as a real read, not
// a horoscope.

import type { Answers } from '@/lib/scoring'

// Quantified, answer-grounded bullet from the admin-hours question (q5).
function hoursBullet(answers: Answers): string | null {
  if (answers.q5 === 'q5_c')
    return 'You put manual admin at 6–15 hours a week — most of a working day spent on work a fitted system would largely absorb.'
  if (answers.q5 === 'q5_d')
    return "You flagged 15+ hours a week on manual admin — at that level it's effectively a part-time role's worth of effort the right system removes."
  return null
}

/**
 * Select 2–4 tailored insight bullets based on the lead's answers and intent band.
 * Each bullet is plain prose (no markdown); the caller renders them as a list.
 */
export function selectInsights(answers: Answers, band: 'hot' | 'warm' | 'cold'): string[] {
  const bullets: string[] = []

  if (band === 'hot') {
    if (answers.q1 === 'q1_c' || answers.q1 === 'q1_d')
      bullets.push('You told us the real status of your work lives across spreadsheets, notes, or in people’s heads — consolidating that into one fitted system is where most of your recoverable time is.')
    if (answers.q2 === 'q2_c' || answers.q2 === 'q2_d')
      bullets.push("You're running workarounds — or working outside your tools entirely — to get the job done. That's a daily tax purpose-built software removes.")
    if (answers.q3 === 'q3_c' || answers.q3 === 'q3_d')
      bullets.push('The same information gets re-entered in four or more places as a job moves through — every one is a chance for error and a few minutes lost, multiplied across every job.')
    const h = hoursBullet(answers)
    if (h) bullets.push(h)
    else if (answers.q4 === 'q4_c' || answers.q4 === 'q4_d')
      bullets.push('Rework is a weekly-or-worse occurrence for you — a system that catches the miss at the source eliminates most of that at its root.')
    bullets.push('Your timeline, budget position, and decision-making role all line up — which is why this is a conversation worth having now, not later.')
    return bullets.slice(0, 4)
  }

  if (band === 'warm') {
    if (answers.q1 === 'q1_c' || answers.q1 === 'q1_d')
      bullets.push('A lot of your real operating detail lives outside any single system — that scattering is the core of what custom software addresses, and your score reflects it.')
    if (answers.q2 === 'q2_c' || answers.q2 === 'q2_d')
      bullets.push("You're working around your tools rather than with them. That workaround cost compounds as your business grows.")
    if (answers.q3 === 'q3_b' || answers.q3 === 'q3_c')
      bullets.push('Information gets re-keyed in several places as work moves through — a scoped build would target those handoffs first.')
    const h = hoursBullet(answers)
    if (h) bullets.push(h)
    else if (answers.q4 === 'q4_b' || answers.q4 === 'q4_c')
      bullets.push('There’s measurable rework cost in your current setup — worth quantifying before deciding scope.')
    bullets.push("The pain is real, but the timing, budget, or scope isn't all settled yet — a short scoping call is exactly how you figure out whether now is the right moment.")
    return bullets.slice(0, 4)
  }

  // Cold band — reframe "not yet" honestly, point to what to watch.
  if (
    (answers.q1 === 'q1_a' || answers.q1 === 'q1_b') &&
    (answers.q4 === 'q4_a' || answers.q4 === 'q4_b')
  )
    bullets.push("Your operation isn't yet at the point where a custom build would clearly pay for itself — useful to know now rather than after you've started a project.")
  const h = hoursBullet(answers)
  if (h)
    bullets.push("Worth noting: you flagged significant weekly admin time. If that keeps climbing as you grow, it's the signal the math has changed.")
  if (answers.q7 === 'q7_c')
    bullets.push("You're in research mode right now, which is exactly when knowing your score is most useful — it tells you what to watch for as your business grows.")
  if (answers.q8 === 'q8_c')
    bullets.push("Budget isn't in place yet, and custom software only makes sense once the ROI case is clear — so that's the right thing to sort first.")
  if (answers.q9 === 'q9_c')
    bullets.push("If you're gathering this for someone else, send them your results link — it's a clean starting point for that conversation.")
  bullets.push("This isn't a 'never' — it's a 'not yet.' Many businesses come back when they hit the next growth inflection point and the conditions line up.")
  return bullets.slice(0, 4)
}

// insights.ts — Tailored insight bullets for the result email and results page.
// Pure function: answers + band → string[]. No side effects.
// Used by: app/actions/submit-assessment.ts (email step) + app/results/[token]/page.tsx (T-133).

import type { Answers } from '@/lib/scoring'

/**
 * Select 2–4 tailored insight bullets based on the lead's answers and intent band.
 *
 * Each bullet is a plain prose sentence (no markdown). The caller is responsible
 * for rendering them as a list. Returns at most 4 bullets.
 *
 * Band behaviour:
 *   hot  — emphasise immediate pain + readiness indicators + urgency signal
 *   warm — acknowledge partial fit, name the specific friction, name the unlock
 *   cold — reframe "not yet" positively, point to what to watch for
 */
export function selectInsights(answers: Answers, band: 'hot' | 'warm' | 'cold'): string[] {
  const bullets: string[] = []

  if (band === 'hot') {
    if (answers.q1 === 'q1_c' || answers.q1 === 'q1_d')
      bullets.push("Your operations still run heavily on manual steps — that's recoverable time and margin sitting on the table right now.")
    if (answers.q2 === 'q2_c' || answers.q2 === 'q2_d')
      bullets.push("Your current software doesn't match how your business actually works, which means your team is managing the gap, not the work.")
    if (answers.q3 === 'q3_c' || answers.q3 === 'q3_d')
      bullets.push("Errors and rework are a recurring cost in your operation — custom software that fits your workflow eliminates most of that at the source.")
    if (answers.q4 === 'q4_c' || answers.q4 === 'q4_d')
      bullets.push("Your process is actively limiting growth — what you can take on is constrained by your tooling, not your market.")
    bullets.push("Your timeline, budget situation, and decision-making position make this a conversation worth having now — not later.")
    return bullets.slice(0, 4)
  }

  if (band === 'warm') {
    if (answers.q1 === 'q1_c' || answers.q1 === 'q1_d')
      bullets.push("A significant chunk of your operations still runs manually — that's the core of what custom software addresses, and your score reflects it.")
    if (answers.q2 === 'q2_c' || answers.q2 === 'q2_d')
      bullets.push("You're working around your tools rather than with them. That workaround cost compounds as your business grows.")
    if (answers.q3 === 'q3_b' || answers.q3 === 'q3_c')
      bullets.push("There's measurable rework and error cost in your current setup — a scoped build would target that specifically.")
    if (answers.q4 === 'q4_b' || answers.q4 === 'q4_c')
      bullets.push("Your current process is applying some drag on growth. Whether a custom build is the right unlock depends on scope and timing — which is worth mapping out.")
    bullets.push("The pieces aren't all aligned yet, but the opportunity is real. A short scoping call helps clarify what 'right timing' actually looks like for your operation.")
    return bullets.slice(0, 4)
  }

  // Cold band
  if ((answers.q1 === 'q1_a' || answers.q1 === 'q1_b') && (answers.q4 === 'q4_a' || answers.q4 === 'q4_b'))
    bullets.push("Your operations aren't at the point where a custom build would clearly pay for itself yet — that's useful to know now rather than after you've started a project.")
  if (answers.q7 === 'q7_c')
    bullets.push("You're in research mode right now, which is exactly when knowing your score is most useful — it'll tell you what to watch for as your business grows.")
  if (answers.q8 === 'q8_c')
    bullets.push("Budget isn't in place, which matters: custom software is an investment, and the ROI case needs to be clear before it makes sense to proceed.")
  if (answers.q9 === 'q9_c')
    bullets.push("If you're gathering information for someone else, send them your results link — it's a useful starting point for that conversation.")
  bullets.push("This isn't a 'never' — it's a 'not yet.' Many businesses come back when they hit the next growth inflection point and the conditions line up.")
  return bullets.slice(0, 4)
}

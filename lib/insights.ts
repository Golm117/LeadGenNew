// insights.ts — Select 2–4 tailored insight bullets for the results page.
// Pure function: deterministic given the same answers + band.
// Created by frontend-agent (T-133); submit-agent (T-140) may also use this
// to store selected insights on the lead row for the results email.

import type { Answers } from '@/lib/scoring'

/**
 * Select 2–4 insight strings for a lead's results page.
 *
 * Logic mirrors content/results.md thresholds exactly.
 * "Always shown" bullet is appended last so it is always included,
 * then the array is capped at 4.
 */
export function selectInsights(answers: Answers, band: 'hot' | 'warm' | 'cold'): string[] {
  const insights: string[] = []

  if (band === 'hot') {
    if (answers.q1 === 'q1_c' || answers.q1 === 'q1_d')
      insights.push(
        "Your operations still run heavily on manual steps — that's recoverable time and margin sitting on the table right now."
      )
    if (answers.q2 === 'q2_c' || answers.q2 === 'q2_d')
      insights.push(
        "Your current software doesn't match how your business actually works, which means your team is managing the gap, not the work."
      )
    if (answers.q3 === 'q3_c' || answers.q3 === 'q3_d')
      insights.push(
        "Errors and rework are a recurring cost in your operation — custom software that fits your workflow eliminates most of that at the source."
      )
    if (answers.q4 === 'q4_c' || answers.q4 === 'q4_d')
      insights.push(
        "Your process is actively limiting growth — what you can take on is constrained by your tooling, not your market."
      )
    // Always shown for Hot
    insights.push(
      "Your timeline, budget situation, and decision-making position make this a conversation worth having now — not later."
    )
    return insights.slice(0, 4)
  }

  if (band === 'warm') {
    if (answers.q1 === 'q1_c' || answers.q1 === 'q1_d')
      insights.push(
        "A significant chunk of your operations still runs manually — that's the core of what custom software addresses, and your score reflects it."
      )
    if (answers.q2 === 'q2_c' || answers.q2 === 'q2_d')
      insights.push(
        "You're working around your tools rather than with them. That workaround cost compounds as your business grows."
      )
    if (answers.q3 === 'q3_b' || answers.q3 === 'q3_c')
      insights.push(
        "There's measurable rework and error cost in your current setup — a scoped build would target that specifically."
      )
    if (answers.q4 === 'q4_b' || answers.q4 === 'q4_c')
      insights.push(
        "Your current process is applying some drag on growth. Whether a custom build is the right unlock depends on scope and timing — which is worth mapping out."
      )
    // Always shown for Warm
    insights.push(
      "The pieces aren't all aligned yet, but the opportunity is real. A short scoping call helps clarify what “right timing” actually looks like for your operation."
    )
    return insights.slice(0, 4)
  }

  // Cold
  if (
    (answers.q1 === 'q1_a' || answers.q1 === 'q1_b') &&
    (answers.q4 === 'q4_a' || answers.q4 === 'q4_b')
  )
    insights.push(
      "Your operations aren't at the point where a custom build would clearly pay for itself yet — that's useful to know now rather than after you've started a project."
    )
  if (answers.q7 === 'q7_c')
    insights.push(
      "You're in research mode right now, which is exactly when knowing your score is most useful — it'll tell you what to watch for as your business grows."
    )
  if (answers.q8 === 'q8_c')
    insights.push(
      "Budget isn't in place, which matters: custom software is an investment, and the ROI case needs to be clear before it makes sense to proceed."
    )
  if (answers.q9 === 'q9_c')
    insights.push(
      "If you're gathering information for someone else, send them your results link — it's a useful starting point for that conversation."
    )
  // Always shown for Cold
  insights.push(
    "This isn't a “never” — it's a “not yet.” Many businesses come back when they hit the next growth inflection point and the conditions line up."
  )
  return insights.slice(0, 4)
}

'use server'

// submitAssessment — the funnel's spine.
//
// Pipeline (PRD §9.2 skeleton, T-140 + T-141):
//   1. Validate with Zod (SubmissionSchema)
//   2. Reject honeypot — BEFORE any DB write (T-141)
//   3. Verify Turnstile server-side — BEFORE any DB write (T-141; skipped if secret absent)
//   4. Score (computeReadiness + computeIntent + bandFor)
//   5. Generate token (crypto.randomUUID)
//   6. Insert lead row via service-role client (dry-run log if env vars absent, D-009)
//   7. Compute insights for the result email
//   8. Send result email (dry-run if RESEND_API_KEY absent, D-009)
//   9. Send hot-lead alert if band === 'hot' (dry-run if key absent)
//  10. Return { token }
//
// Secrets held here: TURNSTILE_SECRET_KEY (read + used only in step 3).
// lib/supabase-server.ts holds SUPABASE_SERVICE_ROLE_KEY (server-only import).
// lib/resend.ts holds RESEND_API_KEY (server-only import).
// None of these vars are ever referenced in client-side files.

import { SubmissionSchema } from '@/lib/schema'
import { computeReadiness, computeIntent, bandFor, type Answers } from '@/lib/scoring'
import { createSupabaseServer } from '@/lib/supabase-server'
import { sendResultEmail, sendHotLeadAlert } from '@/lib/resend'
import { selectInsights } from '@/lib/insights'
import ResultEmail from '@/emails/result-email'
import HotLeadAlert from '@/emails/hot-lead-alert'
import { createElement } from 'react'

// ---------------------------------------------------------------------------
// Return type — always one of these two shapes; NEVER throw to the client.
// ---------------------------------------------------------------------------

export type SubmitResult = { token: string } | { error: string }

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

export async function submitAssessment(payload: unknown): Promise<SubmitResult> {

  // -------------------------------------------------------------------------
  // STEP 1: Validate with Zod
  // -------------------------------------------------------------------------
  const parsed = SubmissionSchema.safeParse(payload)
  if (!parsed.success) {
    // Return generic message — never leak Zod internals to the client.
    return { error: 'Invalid submission data.' }
  }
  const data = parsed.data

  // -------------------------------------------------------------------------
  // STEP 2: Reject honeypot — BEFORE any DB write (T-141)
  //
  // SubmissionSchema already enforces honeypot.max(0), so a non-empty value
  // would fail Zod validation above. This explicit guard is the belt-and-
  // suspenders check: it runs after parsing and handles any edge case where
  // a default('') value somehow passes through with content.
  // Silent rejection — no hint to the bot that the honeypot was the trigger.
  // -------------------------------------------------------------------------
  if (data.honeypot && data.honeypot.length > 0) {
    return { error: 'Invalid submission.' }
  }

  // -------------------------------------------------------------------------
  // STEP 3: Verify Turnstile — BEFORE any DB write (T-141)
  //
  // Secret key is server-only (no NEXT_PUBLIC_ prefix). If absent or set to
  // the sentinel value 'test', skip verification and log — this supports local
  // dev and CI where no Turnstile keys are configured (D-009).
  // -------------------------------------------------------------------------
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (!turnstileSecret || turnstileSecret === 'test') {
    console.log('[turnstile] skipped — TURNSTILE_SECRET_KEY not set or test mode')
  } else {
    let verifyData: { success: boolean }
    try {
      const verifyRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: data.turnstileToken,
          }),
        }
      )
      verifyData = await verifyRes.json() as { success: boolean }
    } catch (fetchErr) {
      console.error('[turnstile] fetch error:', fetchErr)
      return { error: "We couldn't verify the submission. Please reload and try again, or contact us if this keeps happening." }
    }
    if (!verifyData.success) {
      return { error: "We couldn't verify the submission. Please reload and try again, or contact us if this keeps happening." }
    }
  }

  // -------------------------------------------------------------------------
  // STEP 4: Score
  // -------------------------------------------------------------------------
  const answers = data.answers as Answers
  const readinessScore = computeReadiness(answers)
  const intentScore    = computeIntent(answers)
  const intentBand     = bandFor(intentScore)

  // -------------------------------------------------------------------------
  // STEP 5: Generate token
  // -------------------------------------------------------------------------
  const token = crypto.randomUUID()

  // -------------------------------------------------------------------------
  // STEP 6: Insert lead row via service-role client
  //
  // createSupabaseServer() throws if env vars are absent (D-009). Catch and
  // dry-run log so the rest of the pipeline (email) still fires during local
  // dev/test without a live Supabase project.
  // -------------------------------------------------------------------------
  const leadRow = {
    token,
    email:           data.email,
    full_name:       data.name,
    industry:        answers.q6 || null,
    answers:         { ...answers, _variant: data.variant ?? null },
    readiness_score: readinessScore,
    intent_score:    intentScore,
    intent_band:     intentBand,
    utm_source:      data.utm?.utm_source    ?? null,
    utm_medium:      data.utm?.utm_medium    ?? null,
    utm_campaign:    data.utm?.utm_campaign  ?? null,
    referrer:        data.utm?.referrer      ?? null,
    routed_action:   intentBand === 'hot' ? 'book_call' : intentBand === 'warm' ? 'quote' : 'newsletter',
    status:          'new',
  }

  let supabaseAvailable = false
  try {
    const supabase = createSupabaseServer()
    const { error: dbError } = await supabase.from('leads').insert(leadRow)
    if (dbError) {
      console.error('[supabase] insert error:', dbError)
      return { error: 'Server error. Please try again.' }
    }
    supabaseAvailable = true
  } catch {
    // Supabase env vars not configured — dry-run mode (D-009)
    console.log('[supabase dry-run] Lead would be inserted:', {
      token,
      email: data.email,
      intentBand,
      readinessScore,
      intentScore,
    })
  }

  // Log when running fully dry (no DB, useful for build-time verification)
  if (!supabaseAvailable) {
    console.log('[supabase dry-run] Lead row (not persisted):', JSON.stringify(leadRow))
  }

  // -------------------------------------------------------------------------
  // STEP 7: Compute insights for the result email
  // -------------------------------------------------------------------------
  const insights = selectInsights(answers, intentBand)

  // -------------------------------------------------------------------------
  // STEP 8: Send result email
  //
  // sendResultEmail dry-runs when RESEND_API_KEY is absent (D-009).
  // We construct the React element here so the email templates stay pure
  // components with no server-action imports.
  // -------------------------------------------------------------------------
  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const resultUrl  = `${siteUrl}/results/${token}`
  const bookingUrl = process.env.BOOKING_URL || '#'

  try {
    await sendResultEmail({
      to:             data.email,
      name:           data.name,
      readinessScore,
      intentBand,
      insights,
      bookingUrl,
      emailComponent: createElement(ResultEmail, {
        name: data.name,
        readinessScore,
        intentBand,
        insights,
        bookingUrl,
        resultUrl,
      }),
    })
  } catch (emailErr) {
    // Non-fatal: log and continue — lead is already saved.
    console.error('[email] sendResultEmail error:', emailErr)
  }

  // -------------------------------------------------------------------------
  // STEP 9: Hot-lead alert (band === 'hot' only)
  //
  // sendHotLeadAlert dry-runs when RESEND_API_KEY is absent (D-009).
  // -------------------------------------------------------------------------
  if (intentBand === 'hot') {
    try {
      await sendHotLeadAlert({
        leadEmail:      data.email,
        leadName:       data.name,
        industry:       answers.q6 || undefined,
        readinessScore,
        intentScore,
        emailComponent: createElement(HotLeadAlert, {
          leadName:      data.name,
          leadEmail:     data.email,
          industry:      answers.q6 || undefined,
          readinessScore,
          intentScore,
          answers,
        }),
      })
    } catch (alertErr) {
      // Non-fatal: log and continue.
      console.error('[email] sendHotLeadAlert error:', alertErr)
    }
  }

  // -------------------------------------------------------------------------
  // STEP 10: Return token — client redirects to /results/[token]
  // -------------------------------------------------------------------------
  return { token }
}

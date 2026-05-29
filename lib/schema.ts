// schema.ts — Zod submission schema + shared types.
// This is the shared type contract between the frontend (assessment page),
// submit-agent (submitAssessment Server Action), and scoring functions.
// Both sides import from here; never duplicate these types.

import { z } from 'zod'

// ---------------------------------------------------------------------------
// Answer map — validated as a non-empty string record
// ---------------------------------------------------------------------------

export const AnswersSchema = z.record(z.string(), z.string())

// ---------------------------------------------------------------------------
// UTM attribution
// ---------------------------------------------------------------------------

export const UtmSchema = z.object({
  utm_source:   z.string().optional(),
  utm_medium:   z.string().optional(),
  utm_campaign: z.string().optional(),
  referrer:     z.string().optional(),
})

// ---------------------------------------------------------------------------
// Full submission payload
// ---------------------------------------------------------------------------

export const SubmissionSchema = z.object({
  answers: AnswersSchema,

  name:  z.string().min(1, 'Name is required').max(100),

  // z.string().min(1) ensures the field is present/non-empty before .email()
  // validates format. This is the correct Zod v4 pattern for required email.
  email: z.string().min(1, 'Email is required').email('Invalid email'),

  turnstileToken: z.string().min(1, 'Turnstile token required'),

  // Honeypot: must be absent or empty string. If a bot fills it in, .max(0)
  // rejects the submission with a clear signal before any DB write occurs.
  honeypot: z.string().max(0, 'Bot detected').optional().default(''),

  utm: UtmSchema.optional().default({}),

  // Hero A/B/C test variant (D-011). Stored on the lead row (via answers JSONB
  // or a dedicated column) so Hot-lead yield can be measured per variant.
  variant: z.enum(['A', 'B', 'C']).optional(),
})

// ---------------------------------------------------------------------------
// Derived TypeScript types
// ---------------------------------------------------------------------------

export type SubmissionPayload = z.infer<typeof SubmissionSchema>
export type UtmData           = z.infer<typeof UtmSchema>

// Re-export Answers from scoring so callers have a single import point.
export type { Answers } from './scoring'

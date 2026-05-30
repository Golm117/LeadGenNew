'use server'

import { z } from 'zod'

const ScopeRequestSchema = z.object({
  token:        z.string().uuid(),
  businessType: z.string().trim().min(1).max(120),
  primaryPain:  z.string().trim().min(1).max(600),
  size:         z.string().trim().min(1).max(80),
  timeline:     z.string().trim().min(1).max(80),
})

export async function submitScopeRequest(
  payload: unknown
): Promise<{ ok: true } | { error: string }> {
  try {
    const parsed = ScopeRequestSchema.safeParse(payload)
    if (!parsed.success) {
      return { error: 'Invalid request.' }
    }

    const { token, businessType, primaryPain, size, timeline } = parsed.data

    const scopeEntry = {
      businessType,
      primaryPain,
      size,
      timeline,
      submittedAt: new Date().toISOString(),
    }

    try {
      const { createSupabaseServer } = await import('@/lib/supabase-server')
      const supabase = createSupabaseServer()

      const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('answers')
        .eq('token', token)
        .single()

      if (fetchError || !lead) {
        return { error: 'We could not find your results. Please reload and try again.' }
      }

      const merged = {
        ...(lead.answers as Record<string, unknown>),
        _scope_request: scopeEntry,
      }

      const { error: updateError } = await supabase
        .from('leads')
        .update({ answers: merged, status: 'scope_requested' })
        .eq('token', token)

      if (updateError) {
        console.error('[scope-request] update error:', updateError)
        return { error: 'Server error. Please try again.' }
      }

      return { ok: true }
    } catch {
      // Supabase env vars not configured — dry-run mode (D-009)
      console.log('[scope-request dry-run] Would update lead answers._scope_request:', {
        token,
        ...scopeEntry,
      })
      return { ok: true }
    }
  } catch (err) {
    console.error('[scope-request] unexpected error:', err)
    return { error: 'Server error. Please try again.' }
  }
}

import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/** A row from public.leads — matches the PRD §7 schema exactly. */
export type Lead = {
  id: string
  token: string
  created_at: string
  email: string
  full_name: string | null
  business_name: string | null
  industry: string | null
  answers: Record<string, unknown>
  readiness_score: number
  intent_score: number
  intent_band: 'hot' | 'warm' | 'cold'
  routed_action: string | null
  status: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
}

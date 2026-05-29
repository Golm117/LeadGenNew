import 'server-only'
import { Resend } from 'resend'
import type { ReactElement } from 'react'

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 'dry-run') return null
  return new Resend(key)
}

export interface SendResultEmailParams {
  to: string
  name: string
  readinessScore: number
  intentBand: 'hot' | 'warm' | 'cold'
  insights: string[]        // 2-4 tailored insight bullets
  bookingUrl?: string
  emailComponent: ReactElement
}

export interface SendHotAlertParams {
  leadEmail: string
  leadName: string
  businessName?: string
  industry?: string
  readinessScore: number
  intentScore: number
  emailComponent: ReactElement
}

export async function sendResultEmail(params: SendResultEmailParams): Promise<void> {
  const client = getResend()
  if (!client) {
    console.log('[email dry-run] Result email to:', params.to, '| score:', params.readinessScore, '| band:', params.intentBand)
    return
  }
  await client.emails.send({
    from: 'GOLM <noreply@golm.ca>',
    to: params.to,
    subject: `Your Custom Software Readiness Score: ${params.readinessScore}/100`,
    react: params.emailComponent,
  })
}

export async function sendHotLeadAlert(params: SendHotAlertParams): Promise<void> {
  const client = getResend()
  if (!client) {
    console.log('[email dry-run] Hot-lead alert | lead:', params.leadEmail, '| score:', params.readinessScore, '| intent:', params.intentScore)
    return
  }
  await client.emails.send({
    from: 'GOLM Funnel <noreply@golm.ca>',
    to: 'admin@golm.ca',
    subject: `🔥 Hot Lead: ${params.leadName} (${params.readinessScore}/100)`,
    react: params.emailComponent,
  })
}

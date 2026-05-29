'use client'

import { useState, useTransition } from 'react'
import { submitScopeRequest } from '@/app/actions/submit-scope-request'

interface ScopeRequestFormProps {
  token: string
}

export function ScopeRequestForm({ token }: ScopeRequestFormProps) {
  const [businessType, setBusinessType] = useState('')
  const [primaryPain, setPrimaryPain]   = useState('')
  const [size, setSize]                 = useState('')
  const [timeline, setTimeline]         = useState('')
  const [error, setError]               = useState<string | null>(null)
  const [success, setSuccess]           = useState(false)
  const [isPending, startTransition]    = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!businessType.trim() || !primaryPain.trim() || !size.trim() || !timeline.trim()) {
      setError('Please fill in all fields before submitting.')
      return
    }

    window.gtag?.('event', 'cta_quote_click', {})
    window.gtag?.('event', 'scope_request_submitted', {})

    startTransition(async () => {
      const result = await submitScopeRequest({ token, businessType, primaryPain, size, timeline })
      if ('ok' in result) {
        setSuccess(true)
      } else {
        setError(result.error)
      }
    })
  }

  if (success) {
    return (
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-6 py-8 text-center">
        <p className="text-base font-semibold text-indigo-800">
          Thanks — we&apos;ll be in touch within one business day with a rough scope.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          What kind of business do you run?
        </label>
        <input
          type="text"
          value={businessType}
          onChange={e => setBusinessType(e.target.value)}
          placeholder="e.g. Commercial refrigeration service company, 12 techs"
          disabled={isPending}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          What&apos;s the primary pain or bottleneck you&apos;re trying to solve?
        </label>
        <textarea
          rows={4}
          value={primaryPain}
          onChange={e => setPrimaryPain(e.target.value)}
          placeholder="e.g. We track job costing in three different spreadsheets and they're always out of sync — we lose hours each week reconciling them and quotes get delayed."
          disabled={isPending}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60 resize-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Team or operation size
        </label>
        <input
          type="text"
          value={size}
          onChange={e => setSize(e.target.value)}
          placeholder="e.g. 8 full-time, 4 part-time seasonal"
          disabled={isPending}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Timeline — when are you hoping to have something in place?
        </label>
        <input
          type="text"
          value={timeline}
          onChange={e => setTimeline(e.target.value)}
          placeholder="e.g. Within 3–6 months, before next busy season"
          disabled={isPending}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 md:w-auto"
      >
        {isPending ? 'Sending…' : 'Request a free scope outline →'}
      </button>
    </form>
  )
}

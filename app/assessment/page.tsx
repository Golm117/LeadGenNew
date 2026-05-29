// Server Component wrapper — exports metadata, renders client stepper.
// Keeps 'use client' out of this file so Next.js can use the metadata export.
// Suspense is required because AssessmentStepper uses useSearchParams().
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AssessmentStepper } from './stepper'

export const metadata: Metadata = {
  title: 'Custom Software Readiness Assessment — GOLM',
  description:
    'Ten questions about how your business runs today. Takes two minutes. Your score tells you whether custom software is worth it right now.',
}

function StepperFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-6 py-16">
      <div className="flex h-10 w-10 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      </div>
    </main>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<StepperFallback />}>
      <AssessmentStepper />
    </Suspense>
  )
}

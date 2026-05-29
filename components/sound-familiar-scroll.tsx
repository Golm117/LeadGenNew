'use client'

import { useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { ContainerScroll, useContainerScroll } from '@/components/ui/container-scroll-animation'

// Terminal lines — the approved "Sound familiar?" pain points, dressed as console output.
const LINES: { text: string; cls: string }[] = [
  { text: '> golm scan ./your-operation', cls: 'text-emerald-400' },
  { text: 'analyzing how your business actually runs…', cls: 'text-slate-500' },
  { text: '', cls: '' },
  { text: "✗ real workflow lives in spreadsheets, sticky notes & people's heads", cls: 'text-slate-200' },
  { text: '✗ 5 tools, each does ~60% of the job — none of them talk to each other', cls: 'text-slate-200' },
  { text: '✗ every new order or client adds manual steps; the cracks widen as you grow', cls: 'text-slate-200' },
  { text: '', cls: '' },
  { text: "// it works… until it doesn't. and it never really scales.", cls: 'text-amber-400' },
]

const PLAIN = LINES.map((l) => l.text).join('\n')
const TOTAL = LINES.reduce((n, l) => n + l.text.length + 1, 0)

function Terminal() {
  const ctx = useContainerScroll()
  const fallback = useMotionValue(0)
  const progress = ctx ?? fallback
  const reduce = useReducedMotion()

  // Scroll progress drives how many characters have been "typed".
  const chars = useTransform(progress, [0.12, 0.82], [0, TOTAL], { clamp: true })
  const [shown, setShown] = useState(reduce ? TOTAL : 0)
  useMotionValueEvent(chars, 'change', (v) => {
    if (!reduce) setShown(Math.round(v))
  })

  let budget = shown
  let cursorPlaced = false
  const done = shown >= TOTAL

  return (
    <div className="flex h-full flex-col">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-xs text-slate-500">your-operation.ts</span>
      </div>

      {/* typed body */}
      <div
        aria-hidden
        className="flex-1 overflow-hidden px-5 py-5 font-mono text-sm leading-relaxed md:px-7 md:py-7 md:text-base"
      >
        {LINES.map((line, i) => {
          const take = Math.max(0, Math.min(line.text.length, budget))
          const visible = line.text.slice(0, take)
          const isActive = !done && !cursorPlaced && take < line.text.length && budget > -1
          if (isActive) cursorPlaced = true
          budget -= line.text.length + 1
          return (
            <div key={i} className={line.cls || 'text-slate-200'}>
              {visible || ' '}
              {isActive && (
                <motion.span
                  aria-hidden
                  className="ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.12em] bg-indigo-400 align-middle"
                  animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* full copy for assistive tech / crawlers, independent of scroll state */}
      <span className="sr-only">{PLAIN}</span>
    </div>
  )
}

export function SoundFamiliarScroll() {
  return (
    <section className="bg-white">
      <ContainerScroll
        titleComponent={
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Sound familiar?
          </h2>
        }
      >
        <Terminal />
      </ContainerScroll>
    </section>
  )
}

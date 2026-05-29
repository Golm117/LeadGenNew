'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { GetStartedButton } from '@/components/ui/get-started-button'
import { SplineScene } from '@/components/ui/splite'
import { Typewriter } from '@/components/ui/typewriter'
import { cn } from '@/lib/utils'

// Placeholder Spline scene (D-013): swap for a branded indigo .splinecode before launch.
const SCENE = 'https://prod.spline.design/LgR4arZTQ3QN1vTR/scene.splinecode'

// Hero copy per A/B/C variant (D-011). Only headline + subhead differ across variants.
// The 3D visual and CTA are shared (per D-013, D-011 intent).
const VARIANT_COPY = {
  A: {
    headlineStart: 'Software built for how your business ',
    accentPhrases: ['actually works.', 'really runs.', 'operates day to day.'],
    subhead:
      "Stop forcing your operations into tools made for someone else. In two minutes, see whether custom software is worth it for you — and where you're losing time today.",
  },
  B: {
    headlineStart: 'The wrong software is quietly costing you ',
    accentPhrases: ['hours, money, and growth.', 'hours every single week.', 'more than you think.'],
    subhead:
      'Manual entry, constant workarounds, systems that break as you scale. See exactly where your operation is leaking time — in two minutes.',
  },
  C: {
    headlineStart: "You're forcing your business into software it was ",
    accentPhrases: ['never built for.', 'never designed to run.', 'never meant to handle.'],
    subhead:
      "Spreadsheets and five disconnected tools, duct-taped into something that almost works. Find out what that's really costing you.",
  },
} as const

interface HeroProps {
  /** A/B/C test variant from cookie (D-011). Defaults to 'A'. */
  variant?: 'A' | 'B' | 'C'
  /** Full href for assessment link including variant + UTM params. */
  assessmentHref?: string
}

export function Hero({ variant = 'A', assessmentHref = '/assessment' }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)
  const size = 520
  const mouseX = useSpring(0, { bounce: 0 })
  const mouseY = useSpring(0, { bounce: 0 })
  const left = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const top = useTransform(mouseY, (y) => `${y - size / 2}px`)

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = sectionRef.current
      if (!el) return
      const { left: l, top: t } = el.getBoundingClientRect()
      mouseX.set(e.clientX - l)
      mouseY.set(e.clientY - t)
    },
    [mouseX, mouseY]
  )

  const copy = VARIANT_COPY[variant]

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 to-white"
    >
      {/* base cursor-follow glow — shows across the light hero background */}
      <motion.div
        className={cn(
          'pointer-events-none absolute z-0 rounded-full blur-3xl transition-opacity duration-300',
          'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_70%)]',
          hovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{ width: size, height: size, left, top }}
      />
      {/* soft brand gradient splash — only flourish on the page (§9.3) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 z-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-[540px] max-w-6xl items-center px-6 py-16 md:min-h-[620px] md:py-24">
        {/* Robot — right-anchored full-bleed visual; edges feathered to melt into the hero */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-0 h-full w-full md:pointer-events-auto md:w-[64%]"
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 62% 78% at 60% 50%, #000 42%, transparent 76%)',
            maskImage:
              'radial-gradient(ellipse 62% 78% at 60% 50%, #000 42%, transparent 76%)',
          }}
        >
          <SplineScene scene={SCENE} className="h-full w-full" />
        </div>

        {/* glow re-applied over the robot area (the opaque visual occludes the base glow) */}
        <motion.div
          className={cn(
            'pointer-events-none absolute z-[1] rounded-full blur-3xl mix-blend-screen transition-opacity duration-300',
            'bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.6),transparent_70%)]',
            hovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width: size, height: size, left, top }}
        />

        {/* legibility scrim — only on mobile, where the robot sits full-width behind the copy;
            transparent on desktop so the cursor glow is never muted */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-indigo-50 via-indigo-50/70 to-transparent md:from-transparent md:via-transparent md:to-transparent" />

        {/* score chip — outcome preview (D-013), anchored to the robot */}
        <div className="absolute bottom-10 right-6 z-10 rounded-2xl bg-white/95 px-4 py-3 shadow-lg shadow-indigo-900/10 backdrop-blur md:right-12">
          <div className="text-2xl font-bold text-indigo-600">78 / 100</div>
          <div className="text-xs font-medium text-slate-500">Strong fit</div>
        </div>

        {/* Copy — overlaid on top of the visual */}
        <div className="relative z-10 flex max-w-xl flex-col">
          <span className="mb-4 inline-flex w-fit items-center rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700">
            Custom Software Readiness
          </span>
          <h1 className="grid grid-cols-1 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
            {/* Reserve height for the tallest phrase: every phrase is rendered
                invisibly in the same grid cell, so the H1 never changes height as
                the tail cycles — the subhead, CTA and floating chips stay put. */}
            {copy.accentPhrases.map((phrase, i) => (
              <span key={i} aria-hidden className="invisible col-start-1 row-start-1">
                {copy.headlineStart}
                {phrase}
              </span>
            ))}
            <span className="col-start-1 row-start-1">
              {copy.headlineStart}
              {/* sr-only full first phrase keeps the H1 crawlable/accessible; the
                  animated tail is hidden from assistive tech to avoid double-reads */}
              <span className="sr-only">{copy.accentPhrases[0]}</span>
              <span aria-hidden="true">
                <Typewriter
                  text={copy.accentPhrases}
                  className="text-indigo-600"
                  speed={55}
                  deleteSpeed={32}
                  waitTime={1900}
                  initialDelay={350}
                />
              </span>
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            {copy.subhead}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3">
            <GetStartedButton
              href={assessmentHref}
              label="Get Started"
              onClick={() => {
                window.gtag?.('event', 'quiz_start', { variant })
                window.clarity?.('event', 'quiz_start')
              }}
            />
            <p className="text-sm text-slate-500">Free · 2 minutes · Results instantly</p>
          </div>
        </div>
      </div>
    </section>
  )
}

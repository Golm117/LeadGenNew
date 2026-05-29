'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { cn } from '@/lib/utils'

// Placeholder Spline scene (D-013): swap for a branded indigo .splinecode before launch.
const SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

function IndigoGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const size = 320
  const mouseX = useSpring(0, { bounce: 0 })
  const mouseY = useSpring(0, { bounce: 0 })
  const left = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const top = useTransform(mouseY, (y) => `${y - size / 2}px`)

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const parent = ref.current?.parentElement
      if (!parent) return
      const { left: l, top: t } = parent.getBoundingClientRect()
      mouseX.set(e.clientX - l)
      mouseY.set(e.clientY - t)
    },
    [mouseX, mouseY]
  )

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className={cn(
          'pointer-events-none absolute rounded-full blur-3xl transition-opacity duration-300',
          'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.55),transparent_70%)]',
          hovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{ width: size, height: size, left, top }}
      />
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 to-white">
      {/* soft brand splash */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 px-6 py-16 md:grid-cols-2 md:py-24">
        {/* Left — copy (Variant A / control) */}
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit items-center rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700">
            Custom Software Readiness
          </span>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
            Software built for how your business{' '}
            <span className="text-indigo-600">actually works.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            Stop forcing your operations into tools made for someone else. In two
            minutes, see whether custom software is worth it for you — and where
            you&apos;re losing time today.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3">
            <a
              href="/assessment"
              className="group inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30"
            >
              Get your Custom Software Readiness Score — 2 min
            </a>
            <p className="text-sm text-slate-500">Free · 2 minutes · Results instantly</p>
          </div>
        </div>

        {/* Right — interactive 3D (re-skinned indigo panel, not black) */}
        <div className="relative h-[360px] overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 shadow-2xl shadow-indigo-900/30 md:h-[480px]">
          <IndigoGlow />
          <SplineScene scene={SCENE} className="relative z-10 h-full w-full" />
          {/* sample score chip — gauge motif retained as secondary element */}
          <div className="absolute bottom-5 left-5 z-20 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <div className="text-2xl font-bold text-indigo-600">78 / 100</div>
            <div className="text-xs font-medium text-slate-500">Strong fit</div>
          </div>
        </div>
      </div>
    </section>
  )
}

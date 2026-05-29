'use client'

import React, { createContext, useContext, useRef } from 'react'
import { useScroll, useTransform, motion, useReducedMotion, MotionValue } from 'framer-motion'

// Exposes the container's scroll progress so card content can animate in sync
// with the tilt/scale (e.g. a scroll-driven terminal type-on).
const ScrollProgressContext = createContext<MotionValue<number> | null>(null)
export const useContainerScroll = () => useContext(ScrollProgressContext)

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const reduce = useReducedMotion()
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scaleDimensions = (): [number, number] => (isMobile ? [0.7, 0.9] : [1.05, 1])

  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -100])

  return (
    <ScrollProgressContext.Provider value={scrollYProgress}>
      <div
        ref={containerRef}
        className="relative flex h-[60rem] items-center justify-center p-2 md:h-[70rem] md:p-20"
      >
        <div className="relative w-full py-10 md:py-40" style={{ perspective: '1000px' }}>
          <Header translate={translate}>{titleComponent}</Header>
          <Card rotate={rotate} scale={scale}>
            {children}
          </Card>
        </div>
      </div>
    </ScrollProgressContext.Provider>
  )
}

const Header = ({
  translate,
  children,
}: {
  translate: MotionValue<number>
  children: React.ReactNode
}) => {
  return (
    <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
      {children}
    </motion.div>
  )
}

const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  children: React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #4338ca1a, 0 37px 37px #4338ca14, 0 84px 50px #4338ca0a, 0 149px 60px #4338ca05',
      }}
      // Brand-light bezel: indigo border + white frame (no dark-mode variants — this app is light-only).
      className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[30px] border border-indigo-200 bg-white p-2 shadow-2xl md:h-[40rem] md:p-6"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-slate-950 md:rounded-2xl">
        {children}
      </div>
    </motion.div>
  )
}

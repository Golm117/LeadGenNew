'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

import { cn } from '@/lib/utils'

interface TypewriterProps {
  text: string | readonly string[]
  speed?: number
  initialDelay?: number
  waitTime?: number
  deleteSpeed?: number
  loop?: boolean
  className?: string
  showCursor?: boolean
  hideCursorOnType?: boolean
  cursorChar?: string | React.ReactNode
  cursorClassName?: string
  cursorAnimationVariants?: {
    initial: Variants['initial']
    animate: Variants['animate']
  }
}

// Root is a <span> (not <div>) so it can live inside an <h1>. Respects
// prefers-reduced-motion: renders the first phrase in full with no cursor.
export function Typewriter({
  text,
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = '|',
  cursorClassName = 'ml-1',
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: 'reverse',
      },
    },
  },
}: TypewriterProps) {
  const reduce = useReducedMotion()
  const texts: readonly string[] = Array.isArray(text) ? text : [text as string]

  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  // Reduced motion: skip the animation and show the first phrase in full.
  useEffect(() => {
    if (reduce) setDisplayText(texts[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  useEffect(() => {
    if (reduce) return
    let timeout: ReturnType<typeof setTimeout>

    const currentText = texts[currentTextIndex]

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === '') {
          setIsDeleting(false)
          if (currentTextIndex === texts.length - 1 && !loop) {
            return
          }
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setCurrentIndex(0)
          timeout = setTimeout(() => {}, waitTime)
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1))
          }, deleteSpeed)
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex])
            setCurrentIndex((prev) => prev + 1)
          }, speed)
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, waitTime)
        }
      }
    }

    // Apply the initial delay only at the very start.
    if (currentIndex === 0 && !isDeleting && displayText === '') {
      timeout = setTimeout(startTyping, initialDelay)
    } else {
      startTyping()
    }

    return () => clearTimeout(timeout)
  }, [
    currentIndex,
    displayText,
    isDeleting,
    speed,
    deleteSpeed,
    waitTime,
    texts,
    currentTextIndex,
    loop,
    initialDelay,
    reduce,
  ])

  return (
    <span className={cn('inline whitespace-pre-wrap tracking-tight', className)}>
      <span>{displayText}</span>
      {showCursor && !reduce && (
        <motion.span
          variants={cursorAnimationVariants}
          className={cn(
            cursorClassName,
            hideCursorOnType &&
              (currentIndex < texts[currentTextIndex].length || isDeleting)
              ? 'hidden'
              : ''
          )}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  )
}

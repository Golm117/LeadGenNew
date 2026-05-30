import { cn } from '@/lib/utils'

interface SectionProps {
  className?: string
  children: React.ReactNode
  as?: 'section' | 'div' | 'article'
}

export function Section({ className, children, as: Tag = 'section' }: SectionProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-6xl px-6 py-16 md:py-24', className)}>
      {children}
    </Tag>
  )
}

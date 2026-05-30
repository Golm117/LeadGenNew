import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-2xl border border-slate-100 bg-surface p-6 shadow-sm', className)}>
      {children}
    </div>
  )
}

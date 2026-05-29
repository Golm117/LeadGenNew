import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' && 'rounded-[10px] px-4 py-2 text-sm',
        size === 'md' && 'rounded-[10px] px-6 py-3 text-base',
        size === 'lg' && 'rounded-[10px] px-8 py-4 text-lg',
        variant === 'primary' && 'bg-accent text-white shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/30',
        variant === 'secondary' && 'border border-slate-200 bg-white text-slate-700 hover:bg-surface hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

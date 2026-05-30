import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface GetStartedButtonProps {
  /** Destination URL (internal route or external link). */
  href: string
  /** Visible label; hidden on hover as the chevron slides across. */
  label?: string
  /** Fires before navigation — used here for the quiz_start analytics event. */
  onClick?: () => void
  className?: string
}

// Brand-styled (indigo) take on the shadcn "Get Started" button: the label
// fades on hover while a chevron tile expands across the button. Rendered as a
// link so it carries href + analytics. No shadcn tokens / deps.
export function GetStartedButton({
  href,
  label = 'Get Started',
  onClick,
  className,
}: GetStartedButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center overflow-hidden rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/60 focus-visible:ring-offset-2',
        className
      )}
    >
      <span className="mr-9 transition-opacity duration-500 group-hover:opacity-0 motion-reduce:transition-none">
        {label}
      </span>
      <i
        aria-hidden
        className="absolute bottom-1 right-1 top-1 z-10 flex w-1/4 items-center justify-center rounded-lg bg-white/15 text-white transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 motion-reduce:transition-none"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </i>
    </a>
  )
}

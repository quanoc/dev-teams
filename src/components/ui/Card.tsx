import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  highlight?: 'amber' | 'red' | 'purple'
}

export function Card({ children, className, onClick, highlight }: CardProps) {
  const highlightClasses = {
    amber: 'border-amber-300 dark:border-amber-700',
    red:   'border-red-300 dark:border-red-700',
    purple:'border-brand-purple-mid',
  }
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4',
        onClick && 'cursor-pointer hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-150',
        highlight && highlightClasses[highlight],
        className,
      )}
    >
      {children}
    </div>
  )
}

import { Check, X, Loader2, Clock, AlertCircle } from 'lucide-react'
import { cn, stageStatusColor, STAGE_STATUS_LABEL } from '@/lib/utils'
import type { Stage } from '@/types'

interface StageProgressProps {
  stages: Stage[]
  compact?: boolean
}

function StageIcon({ status }: { status: Stage['status'] }) {
  const base = 'w-4 h-4'
  if (status === 'done')    return <Check className={cn(base, 'text-white')} strokeWidth={2.5} />
  if (status === 'active')  return <Loader2 className={cn(base, 'text-brand-purple animate-spin')} />
  if (status === 'blocked') return <AlertCircle className={cn(base, 'text-red-500')} />
  if (status === 'skipped') return <X className={cn(base, 'text-gray-300 dark:text-zinc-600')} />
  return <Clock className={cn(base, 'text-gray-300 dark:text-zinc-600')} />
}

export function StageProgress({ stages, compact = false }: StageProgressProps) {
  const visible = stages.filter((s) => s.status !== 'skipped')
  const activeIdx = stages.findIndex((s) => s.status === 'active')

  return (
    <div className={cn('flex items-center gap-0 w-full', compact ? 'gap-0' : 'gap-0')}>
      {stages.map((stage, i) => {
        const isSkipped = stage.status === 'skipped'
        const isLast = i === stages.length - 1
        const isActive = stage.status === 'active'
        const isDone = stage.status === 'done'

        return (
          <div key={stage.key} className="flex items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                isDone    ? 'bg-brand-purple border-brand-purple' :
                isActive  ? 'bg-white dark:bg-zinc-900 border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.15)]' :
                isSkipped ? 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700' :
                stage.status === 'blocked' ? 'bg-red-50 dark:bg-red-900/20 border-red-300' :
                'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700'
              )}>
                <StageIcon status={stage.status} />
              </div>
              {!compact && (
                <div className={cn(
                  'text-[10px] mt-1.5 text-center leading-tight whitespace-nowrap',
                  isDone    ? 'text-brand-purple font-medium' :
                  isActive  ? 'text-brand-purple font-semibold' :
                  isSkipped ? 'text-gray-300 dark:text-zinc-600 line-through' :
                  'text-gray-400 dark:text-zinc-500'
                )}>
                  {stage.label}
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className={cn(
                'flex-1 h-0.5 mx-1 rounded-full transition-colors duration-300',
                isDone ? 'bg-brand-purple' :
                isActive ? 'bg-gradient-to-r from-brand-purple to-gray-200 dark:to-zinc-700' :
                'bg-gray-100 dark:bg-zinc-800'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

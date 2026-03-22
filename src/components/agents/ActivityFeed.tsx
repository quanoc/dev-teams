import { useAgentStore } from '@/stores/agentStore'
import { formatRelativeTime, activityTypeIcon } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ActivityType } from '@/types'

const TYPE_COLOR: Record<ActivityType, string> = {
  stage_complete: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  stage_start:    'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  human_action:   'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  alert:          'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  artifact:       'bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400',
  comment:        'bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400',
}

export function ActivityFeed() {
  const activities = useAgentStore((s) => s.activities)

  return (
    <div className="space-y-1">
      {activities.map((act) => (
        <div key={act.id} className="flex gap-3 py-2.5 border-b border-gray-50 dark:border-zinc-800/60 last:border-0">
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 mt-0.5',
            TYPE_COLOR[act.type]
          )}>
            {activityTypeIcon(act.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
              <span className="font-medium">{act.actorName}</span>
              <span className="text-gray-400 dark:text-zinc-500"> · {act.taskTitle}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{act.content}</div>
            <div className="text-[10px] text-gray-300 dark:text-zinc-600 mt-1">{formatRelativeTime(act.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

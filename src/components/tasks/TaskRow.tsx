import { AlertTriangle, Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import {
  cn, TASK_TYPE_LABEL, TASK_SIZE_LABEL, taskTypeColor,
  formatDuration, getDurationStatus
} from '@/lib/utils'
import type { Task } from '@/types'

const STAGE_LABEL: Record<string, string> = {
  requirement: '需求分析',
  design:      '方案设计',
  development: '代码开发',
  review:      'Code Review',
  testing:     '测试验证',
  deployment:  '发布上线',
}

const STAGE_COLOR: Record<string, string> = {
  requirement: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  design:      'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  development: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  review:      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  testing:     'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  deployment:  'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

interface TaskRowProps {
  task: Task
}

export function TaskRow({ task }: TaskRowProps) {
  const navigate = useNavigate()
  const durationStatus = getDurationStatus(task.durationElapsedMin, task.durationEstimateMin)
  const isWaiting = task.status === 'waiting'
  const isBlocked = task.status === 'blocked'
  const isDone = task.status === 'done'

  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      className={cn(
        'flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 dark:border-zinc-800/60 cursor-pointer transition-colors duration-100 last:border-0',
        isWaiting ? 'bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30' :
        isBlocked ? 'bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/60 dark:hover:bg-red-950/20' :
        'hover:bg-gray-50 dark:hover:bg-zinc-800/40'
      )}
    >
      {/* Type badge */}
      <Badge className={cn('flex-shrink-0 w-14 justify-center', taskTypeColor(task.type))}>
        {TASK_TYPE_LABEL[task.type]}
      </Badge>

      {/* Title + size + blocked */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isWaiting && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
          {isBlocked && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
          <span className={cn(
            'text-sm font-medium truncate',
            isDone ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-800 dark:text-zinc-200'
          )}>
            {task.title}
          </span>
          <span className="text-xs text-gray-300 dark:text-zinc-600 flex-shrink-0">
            {TASK_SIZE_LABEL[task.size]}
          </span>
        </div>
        {task.blockedReason && (
          <div className="text-xs text-red-500 dark:text-red-400 mt-0.5 truncate">{task.blockedReason}</div>
        )}
        {isWaiting && !task.blockedReason && (
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">待人工介入</div>
        )}
      </div>

      {/* Current stage */}
      <Badge className={cn('flex-shrink-0 hidden sm:inline-flex', STAGE_COLOR[task.currentStage])}>
        {STAGE_LABEL[task.currentStage]}
      </Badge>

      {/* Duration */}
      <div className={cn(
        'flex items-center gap-1 text-xs flex-shrink-0 w-20 justify-end',
        durationStatus === 'overdue' ? 'text-red-500 dark:text-red-400 font-medium' :
        durationStatus === 'warning' ? 'text-amber-500 dark:text-amber-400' :
        'text-gray-400 dark:text-zinc-500'
      )}>
        <Clock className="w-3.5 h-3.5" />
        {formatDuration(task.durationElapsedMin)}
        {durationStatus !== 'normal' && <AlertTriangle className="w-3 h-3" />}
      </div>

      {/* Assignee */}
      <Avatar member={task.assignee} size="sm" className="flex-shrink-0" />

      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-zinc-600 flex-shrink-0" />
    </div>
  )
}

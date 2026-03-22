import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Clock, Tag } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { StageProgress } from '@/components/tasks/StageProgress'
import { WorkspacePanel } from '@/components/tasks/WorkspacePanel'
import { MessageStream } from '@/components/tasks/MessageStream'
import { ArtifactPanel } from '@/components/tasks/ArtifactPanel'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import {
  cn, TASK_TYPE_LABEL, TASK_SIZE_LABEL, TASK_PRIORITY_LABEL,
  taskTypeColor, taskPriorityColor, formatDuration, getDurationStatus
} from '@/lib/utils'

export function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === id))

  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">🤖</div>
          <div className="text-sm">任务不存在</div>
          <button onClick={() => navigate('/tasks')} className="mt-4 text-xs text-brand-purple hover:underline">返回列表</button>
        </div>
      </div>
    )
  }

  const durationStatus = getDurationStatus(task.durationElapsedMin, task.durationEstimateMin)
  const isWaiting = task.status === 'waiting'

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Header ── */}
      <div className={cn(
        'flex-shrink-0 border-b',
        isWaiting
          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
          : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
      )}>
        {/* Top row */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2">
          <button
            onClick={() => navigate('/tasks')}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">{task.title}</h1>
              <Badge className={taskTypeColor(task.type)}>{TASK_TYPE_LABEL[task.type]}</Badge>
              <Badge className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">{TASK_SIZE_LABEL[task.size]}</Badge>
              <span className={cn('text-xs font-medium', taskPriorityColor(task.priority))}>
                {TASK_PRIORITY_LABEL[task.priority]}优先级
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Avatar member={task.assignee} size="sm" />
                <span className="text-xs text-gray-500 dark:text-zinc-400">{task.assignee.name}</span>
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs',
                durationStatus === 'overdue' ? 'text-red-500 font-medium' :
                durationStatus === 'warning' ? 'text-amber-500' :
                'text-gray-400 dark:text-zinc-500'
              )}>
                <Clock className="w-3 h-3" />
                {formatDuration(task.durationElapsedMin)} / {formatDuration(task.durationEstimateMin)}
                {durationStatus !== 'normal' && <AlertTriangle className="w-3 h-3" />}
              </div>
              {task.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-zinc-500">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA badge for waiting tasks */}
          {isWaiting && (
            <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
              待你介入
            </div>
          )}
        </div>

        {/* Stage progress */}
        <div className="px-5 pb-4 pt-2">
          <StageProgress stages={task.stages} />
        </div>
      </div>

      {/* ── Three-column body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Workspace ~55% */}
        <div className="flex-[55] border-r border-gray-100 dark:border-zinc-800 overflow-hidden">
          <WorkspacePanel task={task} />
        </div>

        {/* Message stream ~28% */}
        <div className="flex-[28] border-r border-gray-100 dark:border-zinc-800 overflow-hidden">
          <MessageStream taskId={task.id} />
        </div>

        {/* Artifacts ~17% */}
        <div className="flex-[17] overflow-hidden bg-gray-50/50 dark:bg-zinc-900/50">
          <ArtifactPanel artifacts={task.artifacts} />
        </div>
      </div>
    </div>
  )
}

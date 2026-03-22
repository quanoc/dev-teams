import { Bot, Clock, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { cn, agentStatusColor, AGENT_STATUS_LABEL, formatRelativeTime, formatDuration } from '@/lib/utils'
import type { Agent } from '@/types'

const AGENT_COLORS: Record<string, string> = {
  main:         'bg-zinc-800 text-zinc-100',
  requirement:  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  architecture: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  code:         'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  review:       'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  test:         'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  deploy:       'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

const PULSE_STATUS = ['running', 'analyzing', 'reviewing']

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const isPulsing = PULSE_STATUS.includes(agent.status)
  const isWaiting = agent.status === 'waiting'

  return (
    <Card className={cn('flex flex-col gap-3', isWaiting && 'border-amber-200 dark:border-amber-800/60')}>
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', AGENT_COLORS[agent.id])}>
          <Bot className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800 dark:text-zinc-200 leading-none truncate">{agent.name}</div>
          <div className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{formatRelativeTime(agent.lastActiveAt)}</div>
        </div>
        <div className="flex items-center gap-1">
          {isPulsing && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
          )}
          <Badge className={cn('ml-1', agentStatusColor(agent.status))}>
            {AGENT_STATUS_LABEL[agent.status]}
          </Badge>
        </div>
      </div>

      {/* Current task */}
      <div className="text-xs text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2 min-h-[36px] flex items-center">
        {agent.currentTaskTitle ?? '暂无任务'}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-zinc-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          今日完成 {agent.todayCompleted}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDuration(agent.todayProcessedMin)}
        </span>
      </div>
    </Card>
  )
}

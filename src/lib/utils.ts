import { clsx, type ClassValue } from 'clsx'
import type { TaskType, TaskSize, TaskPriority, AgentStatus, StageStatus, ActivityType, TaskStatus, AgentId } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  return `${Math.floor(hours / 24)} 天前`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h < 24) return m > 0 ? `${h}h ${m}m` : `${h}h`
  const d = Math.floor(h / 24)
  const rh = h % 24
  return rh > 0 ? `${d}d ${rh}h` : `${d}d`
}

export function isOverdue(elapsed: number, estimate: number): boolean {
  return elapsed >= estimate
}

export function isWarning(elapsed: number, estimate: number): boolean {
  return elapsed >= estimate * 0.8
}

export function getDurationStatus(elapsed: number, estimate: number): 'normal' | 'warning' | 'overdue' {
  if (isOverdue(elapsed, estimate)) return 'overdue'
  if (isWarning(elapsed, estimate)) return 'warning'
  return 'normal'
}

// ─── Label maps ───────────────────────────────────────────────────────────

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  bug: 'Bug',
  feature: '功能',
  requirement: '需求',
  'tech-debt': '技术债',
  refactor: '重构',
}

export const TASK_SIZE_LABEL: Record<TaskSize, string> = {
  small: '小任务',
  medium: '中型需求',
  large: '大型需求',
}

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  critical: '紧急',
  high: '高',
  medium: '中',
  low: '低',
}

export const AGENT_STATUS_LABEL: Record<AgentStatus, string> = {
  running: '运行中',
  idle: '待机',
  waiting: '待审批',
  error: '异常',
  analyzing: '分析中',
  reviewing: 'Review 中',
}

export const STAGE_STATUS_LABEL: Record<StageStatus, string> = {
  skipped: '已跳过',
  pending: '待执行',
  active: '进行中',
  done: '已完成',
  blocked: '已阻塞',
}

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  stage_complete: '阶段完成',
  stage_start: '阶段开始',
  human_action: '人工操作',
  alert: '需要介入',
  artifact: '产出物',
  comment: '评论',
}

export const AGENT_NAME: Record<AgentId, string> = {
  main: '主 Agent',
  requirement: '需求 Agent',
  architecture: '架构 Agent',
  code: '代码 Agent',
  review: 'Review Agent',
  test: '测试 Agent',
  deploy: '发布 Agent',
}

// ─── Color helpers ────────────────────────────────────────────────────────

export function agentStatusColor(status: AgentStatus) {
  const map: Record<AgentStatus, string> = {
    running:   'bg-status-running-bg text-status-running-text',
    idle:      'bg-status-idle-bg text-status-idle-text',
    waiting:   'bg-status-waiting-bg text-status-waiting-text border border-status-waiting-border',
    error:     'bg-status-blocked-bg text-status-blocked-text',
    analyzing: 'bg-status-analyzing-bg text-status-analyzing-text',
    reviewing: 'bg-status-reviewing-bg text-status-reviewing-text',
  }
  return map[status]
}

export function taskTypeColor(type: TaskType) {
  const map: Record<TaskType, string> = {
    bug:          'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    feature:      'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    requirement:  'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'tech-debt':  'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    refactor:     'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }
  return map[type]
}

export function taskPriorityColor(priority: TaskPriority) {
  const map: Record<TaskPriority, string> = {
    critical: 'text-red-600 dark:text-red-400',
    high:     'text-amber-600 dark:text-amber-400',
    medium:   'text-blue-600 dark:text-blue-400',
    low:      'text-gray-400',
  }
  return map[priority]
}

export function stageStatusColor(status: StageStatus) {
  const map: Record<StageStatus, string> = {
    done:    'bg-brand-purple text-white',
    active:  'bg-brand-purple-lt text-brand-purple border border-brand-purple-mid',
    pending: 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500',
    skipped: 'bg-gray-50 text-gray-300 dark:bg-zinc-900 dark:text-zinc-600 line-through',
    blocked: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400',
  }
  return map[status]
}

export function taskStatusColor(status: TaskStatus) {
  const map: Record<TaskStatus, string> = {
    active:  'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    waiting: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    blocked: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    done:    'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400',
    pending: 'bg-gray-50 text-gray-400 dark:bg-zinc-900 dark:text-zinc-500',
  }
  return map[status]
}

export function activityTypeIcon(type: ActivityType): string {
  const map: Record<ActivityType, string> = {
    stage_complete: '✓',
    stage_start:    '▶',
    human_action:   '👤',
    alert:          '⚠',
    artifact:       '📄',
    comment:        '💬',
  }
  return map[type]
}

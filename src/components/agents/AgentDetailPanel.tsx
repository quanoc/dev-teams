import { X, FileText, CheckCircle2, Clock, AlertCircle, Info, AlertTriangle, CheckCircle, Zap, Code, TestTube, Rocket, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAgentStore } from '@/stores/agentStore'
import type { AgentId, AgentLog, AgentSkill, AgentRecentTask } from '@/types'

const AGENT_NAMES: Record<AgentId, string> = {
  main: '主 Agent',
  requirement: '需求 Agent',
  architecture: '架构 Agent',
  code: '代码 Agent',
  review: 'Review Agent',
  test: '测试 Agent',
  deploy: '发布 Agent',
}

const LOG_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const LOG_COLORS = {
  info: 'text-blue',
  warning: 'text-amber',
  error: 'text-red',
  success: 'text-green',
}

const LOG_BG_COLORS = {
  info: 'bg-blue-bg',
  warning: 'bg-amber-bg',
  error: 'bg-red-bg',
  success: 'bg-green-bg',
}

const SKILL_ICONS = {
  analysis: Zap,
  coding: Code,
  testing: TestTube,
  deployment: Rocket,
  documentation: BookOpen,
}

const TASK_TYPE_COLORS = {
  bug: 'text-red',
  feature: 'text-green',
  requirement: 'text-purple',
  'tech-debt': 'text-amber',
  refactor: 'text-blue',
}

const TASK_STATUS_COLORS = {
  active: 'bg-blue-bg text-blue',
  waiting: 'bg-amber-bg text-amber',
  blocked: 'bg-red-bg text-red',
  done: 'bg-green-bg text-green',
  pending: 'bg-bg-3 text-text-2',
}

function formatTime(isoString: string) {
  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

function LogItem({ log }: { log: AgentLog }) {
  const Icon = LOG_ICONS[log.level]
  const color = LOG_COLORS[log.level]
  const bgColor = LOG_BG_COLORS[log.level]
  
  return (
    <div className="flex gap-2 py-2 border-b border-line last:border-0">
      <div className={cn('w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5', bgColor)}>
        <Icon className={cn('w-3 h-3', color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-text-0 leading-relaxed">{log.message}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-text-2">{formatTime(log.timestamp)}</span>
          {log.taskTitle && (
            <span className="text-[10px] text-text-3">· {log.taskTitle}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function SkillItem({ skill }: { skill: AgentSkill }) {
  const Icon = SKILL_ICONS[skill.category]
  
  return (
    <div className="flex items-center gap-2 py-2 border-b border-line last:border-0">
      <div className="w-6 h-6 rounded bg-bg-3 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-text-1" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-text-0">{skill.name}</div>
        <div className="text-[10px] text-text-2 truncate">{skill.description}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[10px] font-mono text-text-1">{skill.usageCount}次</div>
        <div className="text-[9px] text-text-3">{formatTime(skill.lastUsedAt)}</div>
      </div>
    </div>
  )
}

function RecentTaskItem({ task }: { task: AgentRecentTask }) {
  const typeColor = TASK_TYPE_COLORS[task.type]
  const statusColor = TASK_STATUS_COLORS[task.status]
  
  return (
    <div className="flex items-center gap-2 py-2 border-b border-line last:border-0">
      <FileText className={cn('w-4 h-4 flex-shrink-0', typeColor)} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-text-0 truncate">{task.taskTitle}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn('text-[9px] px-1.5 py-0.5 rounded', statusColor)}>
            {task.status === 'done' ? '已完成' : task.status === 'active' ? '进行中' : task.status === 'waiting' ? '等待中' : '待处理'}
          </span>
          {task.duration > 0 && (
            <span className="text-[10px] text-text-2">{formatDuration(task.duration)}</span>
          )}
        </div>
      </div>
      {task.completedAt && (
        <div className="text-[10px] text-text-3 flex-shrink-0">
          {formatTime(task.completedAt)}
        </div>
      )}
    </div>
  )
}

export function AgentDetailPanel() {
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId)
  const selectAgent = useAgentStore((s) => s.selectAgent)
  const getAgentLogs = useAgentStore((s) => s.getAgentLogs)
  const getAgentSkills = useAgentStore((s) => s.getAgentSkills)
  const getAgentRecentTasks = useAgentStore((s) => s.getAgentRecentTasks)
  
  if (!selectedAgentId) {
    return (
      <div className="h-full flex items-center justify-center text-text-2 text-sm">
        <div className="text-center">
          <div className="text-text-3 mb-2">👈</div>
          <div>点击上方 Agent 查看详情</div>
        </div>
      </div>
    )
  }
  
  const logs = getAgentLogs(selectedAgentId)
  const skills = getAgentSkills(selectedAgentId)
  const recentTasks = getAgentRecentTasks(selectedAgentId)
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line flex-shrink-0">
        <h3 className="text-sm font-semibold text-text-0">
          {AGENT_NAMES[selectedAgentId]}
        </h3>
        <button
          onClick={() => selectAgent(null)}
          className="w-6 h-6 rounded hover:bg-bg-2 flex items-center justify-center text-text-2 hover:text-text-0 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                运行日志
              </span>
              <span className="text-[10px] text-text-2">{logs.length} 条</span>
            </div>
            <div className="panel-body">
              {logs.length > 0 ? (
                logs.map((log) => <LogItem key={log.id} log={log} />)
              ) : (
                <div className="text-xs text-text-2 text-center py-4">暂无日志</div>
              )}
            </div>
          </div>
          
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                最近任务
              </span>
              <span className="text-[10px] text-text-2">{recentTasks.length} 个</span>
            </div>
            <div className="panel-body">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => <RecentTaskItem key={task.taskId} task={task} />)
              ) : (
                <div className="text-xs text-text-2 text-center py-4">暂无任务</div>
              )}
            </div>
          </div>
          
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                已安装 Skills
              </span>
              <span className="text-[10px] text-text-2">{skills.length} 个</span>
            </div>
            <div className="panel-body">
              {skills.length > 0 ? (
                skills.map((skill) => <SkillItem key={skill.id} skill={skill} />)
              ) : (
                <div className="text-xs text-text-2 text-center py-4">暂无 Skills</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

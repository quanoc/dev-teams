import { cn } from '@/lib/utils'
import { FileText, Lightbulb, Code2, ShieldCheck, BookOpen, Rocket, Zap } from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'
import type { AgentId } from '@/types'

const MASTER_AGENT = {
  id: 'main' as AgentId,
  name: '藜诺',
  role: '协调中枢',
  status: 'online',
  avatar: '藜',
  color: 'purple',
  description: '统筹全局，协调各Agent协作，负责任务分配与进度跟踪',
  output: '项目计划、任务调度、风险预警',
}

const SUB_AGENTS = [
  {
    id: 'requirement' as AgentId,
    name: '小析',
    role: 'PM',
    icon: FileText,
    status: 'busy',
    color: 'blue',
    description: '分析用户需求，拆解功能点，输出用户故事',
    output: 'PRD文档、用户故事、需求清单',
  },
  {
    id: 'architecture' as AgentId,
    name: '张架',
    role: '架构师',
    icon: Lightbulb,
    status: 'idle',
    color: 'amber',
    description: '设计系统架构，规划技术方案，定义接口规范',
    output: '架构图、API设计、数据库模型',
  },
  {
    id: 'code' as AgentId,
    name: '码哥',
    role: 'RD',
    icon: Code2,
    status: 'busy',
    color: 'green',
    description: '编写高质量代码，实现业务功能，进行Code Review',
    output: '源代码、单元测试、技术文档',
  },
  {
    id: 'test' as AgentId,
    name: '小质',
    role: '测试',
    icon: ShieldCheck,
    status: 'busy',
    color: 'cyan',
    description: '保障代码质量，生成测试用例，执行自动化测试',
    output: '测试用例、Bug报告、质量报告',
  },
  {
    id: 'review' as AgentId,
    name: '小文',
    role: '技术写作',
    icon: BookOpen,
    status: 'idle',
    color: 'purple',
    description: '生成技术文档，维护API文档，编写使用指南',
    output: 'API文档、README、CHANGELOG',
  },
  {
    id: 'deploy' as AgentId,
    name: '小云',
    role: '运维',
    icon: Rocket,
    status: 'idle',
    color: 'red',
    description: '配置CI/CD流水线，管理部署环境，监控系统状态',
    output: '部署脚本、监控配置、运维手册',
  },
]

const statusConfig = {
  online: { dot: 'bg-green', pulse: true, label: '运行中' },
  busy: { dot: 'bg-amber', pulse: true, label: '工作中' },
  idle: { dot: 'bg-text-3', pulse: false, label: '空闲' },
}

const colorConfig = {
  purple: { bg: 'bg-purple-bg', border: 'border-purple-dark', text: 'text-purple' },
  blue: { bg: 'bg-blue-bg', border: 'border-blue-dark', text: 'text-blue' },
  amber: { bg: 'bg-amber-bg', border: 'border-amber-dark', text: 'text-amber' },
  green: { bg: 'bg-green-bg', border: 'border-green-dark', text: 'text-green' },
  teal: { bg: 'bg-teal-bg', border: 'border-teal-dark', text: 'text-teal' },
  red: { bg: 'bg-red-bg', border: 'border-red-dark', text: 'text-red' },
  cyan: { bg: 'bg-cyan-bg', border: 'border-cyan-dark', text: 'text-cyan' },
}

export function AgentTeamHeader() {
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId)
  const selectAgent = useAgentStore((s) => s.selectAgent)
  const masterColor = colorConfig[MASTER_AGENT.color as keyof typeof colorConfig]
  const masterStatus = statusConfig[MASTER_AGENT.status as keyof typeof statusConfig]

  return (
    <div className="panel p-2.5 animate-stagger-1">
      <div className="flex items-center gap-2 flex-wrap">
        <div
          onClick={() => selectAgent(MASTER_AGENT.id)}
          className={cn(
            'group relative flex items-center gap-1.5 px-2 py-1 rounded-lg border-2 bg-bg-2 flex-shrink-0 cursor-pointer',
            masterColor.border,
            selectedAgentId === MASTER_AGENT.id && 'ring-2 ring-purple ring-offset-2 ring-offset-bg-1'
          )}
        >
          <div
            className={cn(
              'w-6 h-6 rounded flex items-center justify-center',
              masterColor.bg,
              masterColor.text
            )}
          >
            <Zap className="w-3 h-3" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-text-0">{MASTER_AGENT.name}</span>
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  masterStatus.dot,
                  masterStatus.pulse && 'animate-pulse'
                )}
              />
            </div>
            <div className="text-[9px] text-text-2">{MASTER_AGENT.role}</div>
          </div>

          <div className="absolute left-0 top-full mt-2 w-64 p-3 rounded-lg bg-bg-1 border border-line shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-text-0">{MASTER_AGENT.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-bg text-purple">
                {masterStatus.label}
              </span>
            </div>
            <div className="text-[11px] text-text-1 mb-2 leading-relaxed">
              {MASTER_AGENT.description}
            </div>
            <div className="pt-2 border-t border-line">
              <div className="text-[9px] text-text-2 mb-1">主要产出:</div>
              <div className="text-[10px] text-text-1">{MASTER_AGENT.output}</div>
            </div>
            <div className="absolute left-6 -top-1 w-2 h-2 bg-bg-1 border-l border-t border-line rotate-45" />
          </div>
        </div>

        <div className="flex items-center px-0.5">
          <div className="w-4 h-px bg-gradient-to-r from-purple/50 to-line" />
        </div>

        <div className="flex items-center gap-1.5 flex-1 flex-wrap">
          {SUB_AGENTS.map((agent) => {
            const color = colorConfig[agent.color as keyof typeof colorConfig]
            const status = statusConfig[agent.status as keyof typeof statusConfig]
            const Icon = agent.icon
            const isSelected = selectedAgentId === agent.id

            return (
              <div
                key={agent.id}
                onClick={() => selectAgent(agent.id)}
                className={cn(
                  'group relative flex items-center gap-1.5 px-2 py-1 rounded-lg border border-dashed bg-bg-2/50 cursor-pointer',
                  'hover:bg-bg-2 hover:border-solid transition-all duration-200',
                  color.border,
                  isSelected && 'ring-2 ring-purple ring-offset-2 ring-offset-bg-1 bg-bg-2 border-solid'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded flex items-center justify-center flex-shrink-0',
                    color.bg,
                    color.text
                  )}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-text-0">{agent.name}</span>
                    <span
                      className={cn('w-1.5 h-1.5 rounded-full', status.dot, status.pulse && 'animate-pulse')}
                    />
                  </div>
                  <div className="text-[9px] text-text-2">{agent.role}</div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-3 rounded-lg bg-bg-1 border border-line shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn('w-6 h-6 rounded flex items-center justify-center', color.bg, color.text)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-text-0">{agent.name}</span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded',
                        color.bg,
                        color.text
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-1 mb-2 leading-relaxed">{agent.description}</div>
                  <div className="pt-2 border-t border-line">
                    <div className="text-[9px] text-text-2 mb-1">主要产出:</div>
                    <div className="text-[10px] text-text-1">{agent.output}</div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-bg-1 border-l border-t border-line rotate-45" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

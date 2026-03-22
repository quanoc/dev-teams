import { TopBar } from '@/components/layout/TopBar'
import { ActivityFeed } from '@/components/agents/ActivityFeed'
import { DoraMetrics } from '@/components/agents/DoraMetrics'
import { AgentTeamHeader } from '@/components/agents/AgentTeamHeader'
import { AgentDetailPanel } from '@/components/agents/AgentDetailPanel'
import { useTaskStore } from '@/stores/taskStore'
import { useAgentStore } from '@/stores/agentStore'
import { TrendingUp, TrendingDown, Minus, CheckCircle2, Circle, AlertCircle, Clock, Cpu, Users, Zap, AlertTriangle, Lightbulb, Bug } from 'lucide-react'
import { cn } from '@/lib/utils'

// 今日概览数据
const TODAY_STATS = [
  { label: '活跃任务', value: 12, icon: Zap, color: 'text-blue', bgColor: 'bg-blue-bg', borderColor: 'border-blue-dark' },
  { label: '今日完成', value: 28, icon: CheckCircle2, color: 'text-green', bgColor: 'bg-green-bg', borderColor: 'border-green-dark' },
  { label: '人工介入', value: 8, icon: Users, color: 'text-amber', bgColor: 'bg-amber-bg', borderColor: 'border-amber-dark' },
  { label: 'AI自主率', value: '85%', icon: Cpu, color: 'text-purple', bgColor: 'bg-purple-bg', borderColor: 'border-purple-dark' },
]

// 实时流水线数据
const PIPELINE_TASKS = [
  { id: '#128', title: '用户认证模块', steps: [
    { agent: '小析', status: 'done', time: '2h' },
    { agent: '张架', status: 'done', time: '3h' },
    { agent: '码哥', status: 'running', time: '1h' },
    { agent: '小质', status: 'pending', time: '' },
    { agent: '小文', status: 'pending', time: '' },
    { agent: '小云', status: 'pending', time: '' },
  ]},
  { id: '#129', title: '支付接口优化', steps: [
    { agent: '小析', status: 'done', time: '1h' },
    { agent: '张架', status: 'running', time: '30m' },
    { agent: '码哥', status: 'pending', time: '' },
    { agent: '小质', status: 'pending', time: '' },
    { agent: '小文', status: 'pending', time: '' },
    { agent: '小云', status: 'pending', time: '' },
  ]},
  { id: '#45', title: '修复内存泄漏', steps: [
    { agent: '小质', status: 'done', time: '30m' },
    { agent: '码哥', status: 'running', time: '2h' },
    { agent: '小质', status: 'pending', time: '' },
  ]},
]

// Agent负载数据
const AGENT_WORKLOAD = [
  { name: '小析', role: 'PM', load: 8, max: 10, color: 'bg-blue' },
  { name: '张架', role: '架构师', load: 4, max: 8, color: 'bg-amber' },
  { name: '码哥', role: 'RD', load: 10, max: 12, color: 'bg-green' },
  { name: '小质', role: '测试', load: 6, max: 10, color: 'bg-cyan' },
  { name: '小文', role: '技术写作', load: 3, max: 6, color: 'bg-purple' },
  { name: '小云', role: '运维', load: 2, max: 8, color: 'bg-red' },
]

// 异常告警数据
const ALERTS = [
  { id: 1, type: 'error', icon: AlertCircle, title: '码哥遇到编译错误，需要人工介入', agent: '码哥', time: '5分钟前', action: '处理' },
  { id: 2, type: 'warning', icon: Bug, title: '小质发现3个严重Bug，已自动分配', agent: '小质', time: '12分钟前', action: '查看' },
  { id: 3, type: 'info', icon: Lightbulb, title: '小文建议补充API文档', agent: '小文', time: '30分钟前', action: '忽略' },
]

export function Overview() {
  const tasks = useTaskStore((s) => s.tasks)
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId)

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="总览"
        subtitle={new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AgentTeamHeader />

          <div className="grid grid-cols-4 gap-3">
            {TODAY_STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className={cn(
                  'panel p-4 flex items-center gap-3',
                  idx === 0 && 'animate-stagger-2',
                  idx === 1 && 'animate-stagger-3',
                  idx === 2 && 'animate-stagger-4',
                  idx === 3 && 'animate-stagger-5'
                )}
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bgColor)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
                <div>
                  <div className="text-[10px] text-text-2 mb-0.5">{stat.label}</div>
                  <div className="text-xl font-mono font-semibold text-text-0">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="panel animate-stagger-3">
              <div className="panel-head">
                <span className="panel-title">🔄 实时流水线</span>
                <span className="panel-action">查看全部 12个任务</span>
              </div>
              <div className="panel-body space-y-3">
                {PIPELINE_TASKS.map((task) => (
                  <div key={task.id} className="p-3 bg-bg-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-text-2">{task.id}</span>
                      <span className="text-xs text-text-0">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {task.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center">
                          <div
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[9px] whitespace-nowrap',
                              step.status === 'done' && 'bg-green-bg text-green',
                              step.status === 'running' && 'bg-blue-bg text-blue animate-pulse',
                              step.status === 'pending' && 'bg-bg-3 text-text-3'
                            )}
                          >
                            {step.agent}
                            {step.status === 'done' && '✓'}
                            {step.status === 'running' && '▶'}
                          </div>
                          {idx < task.steps.length - 1 && (
                            <div className="w-3 h-px bg-line mx-0.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel animate-stagger-4">
              <div className="panel-head">
                <span className="panel-title">📊 Agent负载</span>
              </div>
              <div className="panel-body space-y-3">
                {AGENT_WORKLOAD.map((agent) => (
                  <div key={agent.name} className="flex items-center gap-3">
                    <div className="w-12 text-[11px] text-text-0">{agent.name}</div>
                    <div className="w-10 text-[9px] text-text-2">{agent.role}</div>
                    <div className="flex-1 h-2 bg-bg-3 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', agent.color)}
                        style={{ width: `${(agent.load / agent.max) * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-[10px] font-mono text-text-2">
                      {agent.load}/{agent.max}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="panel animate-stagger-5">
            <div className="panel-head">
              <span className="panel-title">👥 人机协作</span>
            </div>
            <div className="panel-body space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-bg-2 rounded-lg">
                  <div className="text-[10px] text-text-2 mb-1">人机比</div>
                  <div className="text-lg font-mono text-text-0">3:7</div>
                </div>
                <div className="text-center p-3 bg-bg-2 rounded-lg">
                  <div className="text-[10px] text-text-2 mb-1">人工介入</div>
                  <div className="text-lg font-mono text-amber">15%</div>
                </div>
                <div className="text-center p-3 bg-bg-2 rounded-lg">
                  <div className="text-[10px] text-text-2 mb-1">AI自主</div>
                  <div className="text-lg font-mono text-green">85%</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-6 bg-bg-2 rounded flex items-center px-2">
                    <div className="w-[15%] h-3 bg-amber rounded" />
                    <span className="ml-2 text-[10px] text-text-2">人工确认 15%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-6 bg-bg-2 rounded flex items-center px-2">
                    <div className="w-[85%] h-3 bg-green rounded" />
                    <span className="ml-2 text-[10px] text-text-2">AI自主 85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel animate-stagger-6">
            <div className="panel-head">
              <span className="panel-title">⚡ 效能与资源</span>
            </div>
            <div className="panel-body">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-bg-2 rounded-lg">
                  <div className="text-[10px] text-text-2 mb-1">产出效率</div>
                  <div className="text-lg font-mono text-green">320%</div>
                  <div className="text-[9px] text-text-3">vs 人工基准</div>
                </div>
                <div className="p-3 bg-bg-2 rounded-lg">
                  <div className="text-[10px] text-text-2 mb-1">代码质量</div>
                  <div className="text-lg font-mono text-blue">A+</div>
                  <div className="text-[9px] text-text-3">测试覆盖 92%</div>
                </div>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1.5 border-b border-line">
                  <span className="text-text-2">Token消耗</span>
                  <span className="font-mono text-text-0">12.5M</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-line">
                  <span className="text-text-2">API调用</span>
                  <span className="font-mono text-text-0">8.2K</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-line">
                  <span className="text-text-2">今日成本</span>
                  <span className="font-mono text-text-0">$23.5</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-text-2">GPU利用率</span>
                  <span className="font-mono text-text-0">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel animate-stagger-6">
          <div className="panel-head">
            <span className="panel-title">⚠️ 需要关注</span>
            <span className="ml-auto text-[10px] font-mono bg-red-bg text-red px-2 py-0.5 rounded">
              {ALERTS.length} 个告警
            </span>
          </div>
          <div className="panel-body space-y-2">
            {ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  alert.type === 'error' && 'bg-red-bg/30 border-red-dark/30',
                  alert.type === 'warning' && 'bg-amber-bg/30 border-amber-dark/30',
                  alert.type === 'info' && 'bg-blue-bg/30 border-blue-dark/30'
                )}
              >
                <alert.icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0',
                    alert.type === 'error' && 'text-red',
                    alert.type === 'warning' && 'text-amber',
                    alert.type === 'info' && 'text-blue'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-0 truncate">{alert.title}</div>
                  <div className="text-[10px] text-text-2">
                    {alert.agent} · {alert.time}
                  </div>
                </div>
                <button
                  className={cn(
                    'text-[10px] px-3 py-1 rounded transition-colors',
                    alert.type === 'error' && 'bg-red text-white hover:bg-red-dark',
                    alert.type === 'warning' && 'bg-amber text-white hover:bg-amber-dark',
                    alert.type === 'info' && 'bg-bg-3 text-text-2 hover:bg-line'
                  )}
                >
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAgentId && (
        <div className="w-[380px] border-l border-line bg-bg-1 overflow-y-auto">
          <AgentDetailPanel />
        </div>
      )}
    </div>

    <div className="px-5 py-2.5 border-t border-line bg-bg-1 flex gap-2 items-end flex-shrink-0">
      <div className="flex gap-1 flex-wrap mb-1.5">
        {['@小析', '@码哥', '@小质'].map((chip) => (
          <button
            key={chip}
            className="text-[10px] font-mono px-2 py-0.5 rounded border border-line-2 text-text-2 hover:border-purple hover:text-purple transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <input
          type="text"
          placeholder="输入指令或问题..."
          className="input-field"
        />
      </div>
      <button className="w-8 h-8 bg-purple rounded flex items-center justify-center flex-shrink-0 hover:bg-[#8060f0] transition-colors">
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  </div>
  )
}

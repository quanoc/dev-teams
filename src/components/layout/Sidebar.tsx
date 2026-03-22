import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListTodo, Bot, BarChart3, Zap, GitBranch, Clock, Code, AlertCircle, Activity } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { cn } from '@/lib/utils'

const NAV_GROUPS = [
  {
    label: '工作台',
    items: [
      { to: '/', label: '总览', icon: LayoutDashboard },
      { to: '/pipeline', label: '流水线', icon: GitBranch, badge: '2' },
      { to: '/tasks', label: '需求看板', icon: ListTodo },
      { to: '/review', label: '代码审查', icon: Code, badge: '5', badgeWarn: true },
    ]
  },
  {
    label: 'AI 能力',
    items: [
      { to: '/requirements', label: '需求拆解', icon: Activity },
      { to: '/tests', label: '智能测试生成', icon: Zap },
      { to: '/complete', label: '代码补全', icon: Code },
      { to: '/debug', label: '故障分析', icon: AlertCircle },
    ]
  },
  {
    label: '度量',
    items: [
      { to: '/efficiency', label: '效能看板', icon: Activity },
      { to: '/quality', label: '质量报告', icon: BarChart3 },
    ]
  },
]

const AGENTS = [
  { name: '需求 Agent', status: '空闲', statusColor: 'bg-green', avatar: '需', avatarBg: 'bg-purple-bg', avatarText: 'text-purple' },
  { name: '代码 Agent', status: 'reviewing…', statusColor: 'bg-amber', avatar: '码', avatarBg: 'bg-blue-bg', avatarText: 'text-blue' },
  { name: '测试 Agent', status: 'generating…', statusColor: 'bg-amber', avatar: '测', avatarBg: 'bg-green-bg', avatarText: 'text-green' },
  { name: '发布 Agent', status: '空闲', statusColor: 'bg-green', avatar: '发', avatarBg: 'bg-amber-bg', avatarText: 'text-amber' },
]

export function Sidebar() {
  const tabCount = useTaskStore((s) => s.tabCount)
  const waitingCount = tabCount('waiting')

  return (
    <aside className="w-[200px] flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-md bg-purple flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-wide text-text-0">AgentTeam</div>
            <div className="text-[10px] text-text-2 font-mono">v0.4.1 · OpenClaw</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2.5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="text-[9px] font-semibold uppercase tracking-widest text-text-3 px-2 mb-1">
              {group.label}
            </div>
            {group.items.map(({ to, label, icon: Icon, badge, badgeWarn }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'nav-item',
                    isActive && 'active'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {(badge || (label === '需求看板' && waitingCount > 0)) && (
                      <span className={cn(
                        'ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded',
                        badgeWarn || (label === '代码审查' && isActive)
                          ? 'bg-amber-dark text-amber'
                          : 'bg-purple-dark text-purple'
                      )}>
                        {label === '需求看板' ? waitingCount : badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Online Agents */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <div className="text-[9px] font-semibold uppercase tracking-widest text-text-3 px-2 mb-1.5">
          在线 Agent
        </div>
        {AGENTS.map((agent) => (
          <div key={agent.name} className="agent-row">
            <div className="relative">
              <div className={cn(
                'w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold font-mono',
                agent.avatarBg,
                agent.avatarText
              )}>
                {agent.avatar}
              </div>
              <div className={cn(
                'absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full border border-sidebar',
                agent.statusColor
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-text-0 truncate">{agent.name}</div>
              <div className="text-[10px] text-text-2 font-mono">{agent.status}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

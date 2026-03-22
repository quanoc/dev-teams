import { AlertTriangle, X, Bell, Settings, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@/stores/taskStore'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const tasks = useTaskStore((s) => s.tasks)
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)
  const waitingTasks = tasks.filter((t) => t.status === 'waiting')

  return (
    <div className="flex-shrink-0 z-20">
      {/* Alert banner */}
      {!dismissed && waitingTasks.length > 0 && (
        <div className="bg-amber-bg border-b border-amber-dark px-5 py-2 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber flex-shrink-0" />
          <div className="flex-1 flex items-center gap-2 text-sm text-amber flex-wrap">
            <span className="font-medium">待介入 {waitingTasks.length} 项：</span>
            {waitingTasks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { navigate(`/tasks/${t.id}`) }}
                className="underline underline-offset-2 hover:text-amber/80 transition-colors"
              >
                {t.title}{i < waitingTasks.length - 1 ? ' ·' : ''}
              </button>
            ))}
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber/60 hover:text-amber transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="h-12 px-5 border-b border-line bg-bg-1 flex items-center gap-3 flex-shrink-0">
        <h1 className="text-[13px] font-semibold text-text-0">{title}</h1>
        {subtitle && (
          <span className="text-[11px] text-text-2 font-mono">{subtitle}</span>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button className="topbar-pill active">
            实时
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-slow ml-1.5" />
          </button>
          <button className="topbar-pill">最近1小时</button>
          <button className="topbar-pill">今天</button>
          <div className="w-px h-4 bg-line mx-1" />
          <button className="p-1.5 rounded text-text-2 hover:text-text-0 hover:bg-bg-3 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-text-2 hover:text-text-0 hover:bg-bg-3 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-full bg-purple-bg border border-purple-dark flex items-center justify-center text-purple text-xs font-mono">
            U
          </button>
        </div>
      </div>
    </div>
  )
}

import { TopBar } from '@/components/layout/TopBar'
import { TaskRow } from '@/components/tasks/TaskRow'
import { useTaskStore } from '@/stores/taskStore'
import { cn } from '@/lib/utils'

type TabKey = 'all' | 'waiting' | 'active' | 'done' | 'blocked'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',     label: '全部' },
  { key: 'waiting', label: '待介入' },
  { key: 'active',  label: '进行中' },
  { key: 'done',    label: '已完成' },
  { key: 'blocked', label: '被阻塞' },
]

const TAB_ACCENT: Partial<Record<TabKey, string>> = {
  waiting: 'text-amber-600 dark:text-amber-400',
  blocked: 'text-red-600 dark:text-red-400',
}

export function Tasks() {
  const activeTab     = useTaskStore((s) => s.activeTab)
  const setActiveTab  = useTaskStore((s) => s.setActiveTab)
  const filteredTasks = useTaskStore((s) => s.filteredTasks)
  const tabCount      = useTaskStore((s) => s.tabCount)

  const tasks = filteredTasks()

  return (
    <div className="min-h-screen">
      <TopBar title="任务列表" subtitle={`共 ${tasks.length} 项`} />

      {/* Tabs */}
      <div className="sticky top-[89px] z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800 px-6">
        <div className="flex gap-0">
          {TABS.map(({ key, label }) => {
            const count = tabCount(key)
            const isActive = activeTab === key
            const accent = TAB_ACCENT[key]
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-colors duration-150',
                  isActive
                    ? 'border-brand-purple text-brand-purple font-medium'
                    : 'border-transparent text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300',
                )}
              >
                {label}
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full font-medium',
                  isActive
                    ? 'bg-brand-purple-lt text-brand-purple'
                    : count > 0 && accent
                    ? `${accent} bg-current/10`
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-4 px-5 py-2 bg-gray-50 dark:bg-zinc-900/60 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-14 text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">类型</div>
        <div className="flex-1 text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">任务</div>
        <div className="hidden sm:block w-24 text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">阶段</div>
        <div className="w-20 text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide text-right">时长</div>
        <div className="w-8" />
        <div className="w-4" />
      </div>

      {/* Task list */}
      <div className="bg-white dark:bg-zinc-900">
        {tasks.length === 0 ? (
          <div className="text-center py-20 text-sm text-gray-400 dark:text-zinc-500">
            此分类下没有任务
          </div>
        ) : (
          tasks.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}

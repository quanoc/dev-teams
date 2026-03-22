import { CheckCircle2, XCircle, AlertTriangle, FileText, Loader2, Rocket } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

// ── Review workspace ───────────────────────────────────────────────────────
function ReviewWorkspace({ task }: { task: Task }) {
  const approveReview = useTaskStore((s) => s.approveReview)
  const rejectReview  = useTaskStore((s) => s.rejectReview)
  const report = task.artifacts.find((a) => a.stage === 'review')

  return (
    <div className="space-y-4">
      {/* CTA banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">需要你的审批</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Review Agent 首轮扫描完成，发现安全问题，需要高级开发最终确认后才能进入测试阶段。
            </div>
          </div>
        </div>
      </div>

      {/* Review report */}
      {report && (
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Review 报告</div>
          <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">●</span>
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-zinc-300">SQL 注入风险</div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5">payment.service.ts · line 142</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">●</span>
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-zinc-300">未校验用户权限</div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5">payment.controller.ts · line 287</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">●</span>
              <div>
                <div className="text-xs text-gray-500 dark:text-zinc-400">3 项代码规范建议</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => approveReview(task.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-purple text-white text-sm font-medium hover:bg-violet-600 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          批准通过，进入测试
        </button>
        <button
          onClick={() => rejectReview(task.id)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <XCircle className="w-4 h-4" />
          退回修改
        </button>
      </div>
    </div>
  )
}

// ── Requirement workspace ──────────────────────────────────────────────────
function RequirementWorkspace({ task }: { task: Task }) {
  const advanceStage = useTaskStore((s) => s.advanceStage)
  const draft = task.artifacts.find((a) => a.stage === 'requirement')
  return (
    <div className="space-y-4">
      <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <Loader2 className="w-4 h-4 text-violet-500 animate-spin flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-violet-800 dark:text-violet-300">需求 Agent 分析中</div>
            <div className="text-xs text-violet-600 dark:text-violet-400 mt-1">
              已识别 4 个核心用户故事，正在生成验收标准，预计 10 分钟完成。
            </div>
          </div>
        </div>
      </div>
      {draft && (
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-2">草稿产出物</div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl">
            <FileText className="w-5 h-5 text-violet-500" />
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-zinc-300">{draft.name}</div>
              <div className="text-xs text-gray-400 dark:text-zinc-500">{draft.size} · 草稿待评审</div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => advanceStage(task.id)}
        className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
      >
        确认需求，进入方案设计
      </button>
    </div>
  )
}

// ── Development workspace ──────────────────────────────────────────────────
function DevelopmentWorkspace({ task }: { task: Task }) {
  const isOverdue = task.durationElapsedMin > task.durationEstimateMin
  return (
    <div className="space-y-4">
      {isOverdue && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl p-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-red-700 dark:text-red-400">开发时长已超预期</div>
              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                {task.blockedReason ?? '代码 Agent 正在等待更多信息'}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-blue-800 dark:text-blue-300">代码 Agent 开发中</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {task.blockedReason ? `等待：${task.blockedReason}` : '正在生成代码，可通过消息流提供更多上下文。'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Testing workspace ──────────────────────────────────────────────────────
function TestingWorkspace({ task }: { task: Task }) {
  const advanceStage = useTaskStore((s) => s.advanceStage)
  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <Loader2 className="w-4 h-4 text-green-500 animate-spin flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-green-800 dark:text-green-300">测试 Agent 运行中</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              单元测试覆盖率 87%，集成测试进行中，性能测试 P99 = 340ms（达标）。
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[['覆盖率','87%','text-green-600'],['P99 响应','340ms','text-green-600'],['失败用例','2','text-red-500']].map(([label, val, color]) => (
          <div key={label} className="bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-3 text-center">
            <div className={cn('text-lg font-bold', color)}>{val}</div>
            <div className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => advanceStage(task.id)}
        className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-sm font-medium hover:bg-violet-600 transition-colors flex items-center justify-center gap-2"
      >
        <Rocket className="w-4 h-4" />
        确认测试通过，进入发布
      </button>
    </div>
  )
}

// ── Deployment workspace ───────────────────────────────────────────────────
function DeploymentWorkspace({ task }: { task: Task }) {
  const advanceStage = useTaskStore((s) => s.advanceStage)
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700 rounded-xl p-4">
        <div className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">发布前检查</div>
        {[
          ['代码已合并到 main', true],
          ['所有测试通过', true],
          ['已通知相关团队', true],
          ['回滚方案已确认', true],
        ].map(([label, done]) => (
          <div key={String(label)} className="flex items-center gap-2 py-1.5">
            <CheckCircle2 className={cn('w-4 h-4 flex-shrink-0', done ? 'text-teal-500' : 'text-gray-300')} />
            <span className="text-xs text-gray-600 dark:text-zinc-400">{String(label)}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => advanceStage(task.id)}
        className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-sm font-medium hover:bg-violet-600 transition-colors flex items-center justify-center gap-2"
      >
        <Rocket className="w-4 h-4" />
        批准发布上线
      </button>
    </div>
  )
}

// ── Generic pending/done workspace ────────────────────────────────────────
function GenericWorkspace({ task }: { task: Task }) {
  const stageLabel: Record<string, string> = {
    design: '方案设计',
    requirement: '需求分析',
  }
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-purple-lt dark:bg-violet-900/30 flex items-center justify-center mb-3">
        <Loader2 className="w-6 h-6 text-brand-purple animate-spin" />
      </div>
      <div className="text-sm font-medium text-gray-600 dark:text-zinc-400">
        {stageLabel[task.currentStage] ?? '当前阶段'} 进行中
      </div>
      <div className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Agent 正在处理，完成后将通知你</div>
    </div>
  )
}

// ── Done workspace ─────────────────────────────────────────────────────────
function DoneWorkspace() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-3">
        <CheckCircle2 className="w-6 h-6 text-teal-500" />
      </div>
      <div className="text-sm font-medium text-gray-600 dark:text-zinc-400">任务已完成</div>
      <div className="text-xs text-gray-400 dark:text-zinc-500 mt-1">所有阶段已通过，已成功发布</div>
    </div>
  )
}

// ── Blocked workspace ──────────────────────────────────────────────────────
function BlockedWorkspace({ task }: { task: Task }) {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-700 dark:text-red-400">任务已阻塞</div>
            <div className="text-xs text-red-500 dark:text-red-400 mt-1">
              {task.blockedReason ?? '等待外部依赖解除'}
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-4">
        主 Agent 已通知相关团队，阻塞解除后将自动恢复流程。如需手动处理，请通过消息流与团队沟通。
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
interface WorkspacePanelProps {
  task: Task
}

export function WorkspacePanel({ task }: WorkspacePanelProps) {
  let content: React.ReactNode

  if (task.status === 'done') {
    content = <DoneWorkspace />
  } else if (task.status === 'blocked') {
    content = <BlockedWorkspace task={task} />
  } else if (task.currentStage === 'review' && task.status === 'waiting') {
    content = <ReviewWorkspace task={task} />
  } else if (task.currentStage === 'requirement') {
    content = <RequirementWorkspace task={task} />
  } else if (task.currentStage === 'development') {
    content = <DevelopmentWorkspace task={task} />
  } else if (task.currentStage === 'testing') {
    content = <TestingWorkspace task={task} />
  } else if (task.currentStage === 'deployment') {
    content = <DeploymentWorkspace task={task} />
  } else {
    content = <GenericWorkspace task={task} />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-gray-100 dark:border-zinc-800">
        <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">当前阶段工作区</div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
        {content}
      </div>
    </div>
  )
}

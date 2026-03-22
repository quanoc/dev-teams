import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'
import { cn } from '@/lib/utils'

type Trend = 'up' | 'down' | 'stable'

function TrendIcon({ trend, positive }: { trend: Trend; positive: 'up' | 'down' }) {
  const isGood = trend === positive
  const isNeutral = trend === 'stable'
  return (
    <span className={cn('inline-flex items-center',
      isNeutral ? 'text-gray-400' : isGood ? 'text-teal-500' : 'text-red-500'
    )}>
      {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
       trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
       <Minus className="w-3.5 h-3.5" />}
    </span>
  )
}

interface MetricRowProps {
  label: string
  value: string
  trend: Trend
  goodDirection: 'up' | 'down'
  description: string
}

function MetricRow({ label, value, trend, goodDirection, description }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-zinc-800/60 last:border-0">
      <div>
        <div className="text-xs font-medium text-gray-700 dark:text-zinc-300">{label}</div>
        <div className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{value}</span>
        <TrendIcon trend={trend} positive={goodDirection} />
      </div>
    </div>
  )
}

export function DoraMetrics() {
  const m = useAgentStore((s) => s.metrics)

  return (
    <div>
      <MetricRow label="部署频率" value={m.deployFrequency} trend={m.deployFrequencyTrend} goodDirection="up" description="越高越好" />
      <MetricRow label="变更前置时间" value={m.leadTimeForChanges} trend={m.leadTimeTrend} goodDirection="down" description="从提交到上线" />
      <MetricRow label="变更失败率" value={m.changeFailureRate} trend={m.failureRateTrend} goodDirection="down" description="越低越好" />
      <MetricRow label="MTTR" value={m.mttr} trend={m.mttrTrend} goodDirection="down" description="平均恢复时间" />
    </div>
  )
}

import { FileText, Code2, FileBarChart, Settings, Image, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Artifact, StageKey } from '@/types'

const STAGE_LABEL: Record<StageKey, string> = {
  requirement: '需求分析',
  design:      '方案设计',
  development: '代码开发',
  review:      'Code Review',
  testing:     '测试验证',
  deployment:  '发布上线',
}

const ARTIFACT_ICON: Record<string, React.ElementType> = {
  document: FileText,
  code:     Code2,
  report:   FileBarChart,
  config:   Settings,
  image:    Image,
}

const ARTIFACT_COLOR: Record<string, string> = {
  document: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  code:     'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  report:   'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  config:   'bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400',
  image:    'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
}

interface ArtifactPanelProps {
  artifacts: Artifact[]
}

export function ArtifactPanel({ artifacts }: ArtifactPanelProps) {
  // group by stage
  const grouped: Partial<Record<StageKey, Artifact[]>> = {}
  for (const a of artifacts) {
    if (!grouped[a.stage]) grouped[a.stage] = []
    grouped[a.stage]!.push(a)
  }

  const stageOrder: StageKey[] = ['requirement','design','development','review','testing','deployment']

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
        <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">产出物归档</div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0">
        {artifacts.length === 0 && (
          <div className="text-xs text-gray-300 dark:text-zinc-600 text-center py-8">暂无产出物</div>
        )}
        {stageOrder.map((key) => {
          const items = grouped[key]
          if (!items?.length) return null
          return (
            <div key={key}>
              <div className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-2 px-1">
                {STAGE_LABEL[key]}
              </div>
              <div className="space-y-1.5">
                {items.map((a) => {
                  const Icon = ARTIFACT_ICON[a.type] ?? FileText
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer group transition-colors"
                    >
                      <div className={cn('w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0', ARTIFACT_COLOR[a.type])}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 dark:text-zinc-300 truncate">{a.name}</div>
                        {a.size && <div className="text-[10px] text-gray-400 dark:text-zinc-500">{a.size}</div>}
                      </div>
                      <Download className="w-3.5 h-3.5 text-gray-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

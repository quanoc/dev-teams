# OpenClaw 集成使用示例

## 快速开始

### 1. 在 AgentDetailPanel 中集成实时日志

```typescript
import { useOpenClawLogs } from '@/hooks/useOpenClawLogs'
import type { AgentId } from '@/types'

function AgentDetailPanel() {
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId)
  const { logs, isLoading, error, refreshLogs } = useOpenClawLogs(selectedAgentId)

  if (!selectedAgentId) return null

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-line">
        <h3 className="font-semibold">运行日志</h3>
        <button onClick={refreshLogs} disabled={isLoading}>
          刷新
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {logs.map(log => (
          <div key={log.id} className={`p-2 rounded text-sm ${
            log.level === 'error' ? 'bg-red-50 text-red-600' :
            log.level === 'warning' ? 'bg-yellow-50 text-yellow-600' :
            log.level === 'success' ? 'bg-green-50 text-green-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="font-medium">{log.level.toUpperCase()}</span>
            </div>
            <p>{log.message}</p>
            {log.taskTitle && (
              <p className="text-xs text-gray-500 mt-1">
                任务: {log.taskTitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 2. 添加日志过滤功能

```typescript
import { useState } from 'react'
import { useOpenClawLogs } from '@/hooks/useOpenClawLogs'

function AgentLogs({ agentId }: { agentId: AgentId }) {
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const { logs } = useOpenClawLogs(agentId)

  const filteredLogs = levelFilter === 'all'
    ? logs
    : logs.filter(log => log.level === levelFilter)

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setLevelFilter('all')}>全部</button>
        <button onClick={() => setLevelFilter('info')}>信息</button>
        <button onClick={() => setLevelFilter('warning')}>警告</button>
        <button onClick={() => setLevelFilter('error')}>错误</button>
        <button onClick={() => setLevelFilter('success')}>成功</button>
      </div>

      {filteredLogs.map(log => (
        <LogItem key={log.id} log={log} />
      ))}
    </div>
  )
}
```

### 3. 实时日志流显示

```typescript
import { useEffect, useRef } from 'react'
import { useOpenClawLogs } from '@/hooks/useOpenClawLogs'

function LiveLogStream({ agentId }: { agentId: AgentId }) {
  const { logs } = useOpenClawLogs(agentId)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div ref={containerRef} className="h-96 overflow-y-auto">
      {logs.map(log => (
        <div key={log.id} className="font-mono text-xs">
          <span className="text-gray-400">[{log.timestamp}]</span>
          <span className={`ml-2 ${
            log.level === 'error' ? 'text-red-500' :
            log.level === 'warning' ? 'text-yellow-500' :
            'text-gray-300'
          }`}>
            [{log.level.toUpperCase()}]
          </span>
          <span className="ml-2">{log.message}</span>
        </div>
      ))}
    </div>
  )
}
```

### 4. 日志统计面板

```typescript
import { useOpenClawLogs } from '@/hooks/useOpenClawLogs'

function LogStats({ agentId }: { agentId: AgentId }) {
  const { logs } = useOpenClawLogs(agentId)

  const stats = {
    total: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    success: logs.filter(l => l.level === 'success').length,
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      <div className="p-2 bg-gray-100 rounded text-center">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-xs text-gray-500">总计</div>
      </div>
      <div className="p-2 bg-blue-100 rounded text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
        <div className="text-xs text-gray-500">信息</div>
      </div>
      <div className="p-2 bg-yellow-100 rounded text-center">
        <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
        <div className="text-xs text-gray-500">警告</div>
      </div>
      <div className="p-2 bg-red-100 rounded text-center">
        <div className="text-2xl font-bold text-red-600">{stats.error}</div>
        <div className="text-xs text-gray-500">错误</div>
      </div>
      <div className="p-2 bg-green-100 rounded text-center">
        <div className="text-2xl font-bold text-green-600">{stats.success}</div>
        <div className="text-xs text-gray-500">成功</div>
      </div>
    </div>
  )
}
```

## 高级用法

### 1. 自定义 OpenClawService 配置

```typescript
import { OpenClawService } from '@/services/openclaw'

const customService = new OpenClawService({
  baseUrl: 'http://your-openclaw-server:18789',
  apiKey: 'your-api-key',
  pollingInterval: 1000, // 1秒轮询一次
})

export default customService
```

### 2. 直接使用 OpenClawService

```typescript
import { openClawService } from '@/services/openclaw'

async function fetchAndProcessLogs() {
  try {
    const logs = await openClawService.getAgentLogs('requirement', 100)
    
    const processedLogs = logs.map(log => ({
      ...log,
      timestamp: new Date(log.timestamp),
      isRecent: Date.now() - new Date(log.timestamp).getTime() < 60000,
    }))

    return processedLogs
  } catch (error) {
    console.error('Failed to fetch logs:', error)
    return []
  }
}
```

### 3. 日志导出功能

```typescript
import { openClawService } from '@/services/openclaw'

async function exportLogs(agentId: AgentId, format: 'json' | 'csv') {
  const logs = await openClawService.getAgentLogs(agentId, 1000)

  if (format === 'json') {
    const json = JSON.stringify(logs, null, 2)
    downloadFile(json, `logs-${agentId}-${Date.now()}.json`, 'application/json')
  } else {
    const csv = [
      'Timestamp,Level,Message,TaskId',
      ...logs.map(l => `"${l.timestamp}","${l.level}","${l.message}","${l.taskId || ''}"`)
    ].join('\n')
    downloadFile(csv, `logs-${agentId}-${Date.now()}.csv`, 'text/csv')
  }
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

## 注意事项

1. **性能优化**：
   - 使用 `useOpenClawLogs` hook 会自动管理订阅和清理
   - 默认限制日志数量为 100 条，避免内存占用过大
   - 使用 SSE 而不是轮询（如果浏览器支持）

2. **错误处理**：
   - 如果 OpenClaw 服务不可用，会返回模拟数据
   - 检查 `error` 状态来处理连接问题

3. **实时更新**：
   - 日志会自动实时更新
   - 使用 `refreshLogs()` 手动刷新
   - 使用 `clearLogs()` 清空日志

4. **类型安全**：
   - 所有类型都已定义在 `@/types` 中
   - 使用 TypeScript 获得完整的类型提示

## 下一步

1. 将 `useOpenClawLogs` 集成到 `AgentDetailPanel` 组件
2. 添加日志过滤和搜索功能
3. 实现日志导出功能
4. 添加日志统计和可视化图表

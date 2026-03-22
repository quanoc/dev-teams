# OpenClaw 集成指南

## 概述

本项目已集成 OpenClaw Agent 日志系统，可以实时获取和展示 Agent 运行日志。

## OpenClaw 简介

OpenClaw 是一个开源的 AI Agent 框架，专为软件开发场景设计：

- **多 Agent 协同**：支持需求分析、编码、测试、运维等角色分工
- **本地化部署**：支持本地 AI 模型（如 Ollama）
- **模块化扩展**：通过 Skills（技能插件）扩展功能
- **完整的可观测性**：提供日志、监控、审计等能力

## 安装和配置 OpenClaw

### 1. 安装 OpenClaw

```bash
# 使用 npm 安装
npm install -g openclaw

# 或使用 pnpm 安装
pnpm install -g openclaw
```

### 2. 启动 OpenClaw 服务

```bash
# 启动网关服务
openclaw gateway start

# 查看服务状态
openclaw gateway status

# 预期输出：
# Gateway: running
# Agent: running
# Web UI: available at http://localhost:18789
```

### 3. 配置 Agent

```bash
# 配置默认 Agent（绑定本地 phi3:mini）
openclaw agents configure \
  --default \
  --provider ollama \
  --model phi3:mini \
  --endpoint http://127.0.0.1:11434

# 验证配置
openclaw agents show
```

### 4. 安装必要的 Skills

```bash
# 安装文件管理技能
openclaw skills install file-manager

# 安装系统控制技能
openclaw skills install system-control

# 启用技能
openclaw skills enable file-manager
openclaw skills enable system-control

# 查看已安装技能
openclaw skills list
```

## 日志获取方式

### 方式 1：命令行查看

```bash
# 查看 Agent 日志
openclaw agent logs

# 查看特定 Agent 的日志
openclaw agent logs --agent requirement

# 实时跟踪日志
openclaw agent logs --follow
```

### 方式 2：日志文件

OpenClaw 的日志存储在：

```bash
~/.openclaw/logs/
```

日志文件结构：
```
~/.openclaw/logs/
├── gateway.log          # 网关日志
├── agents/              # Agent 日志
│   ├── main.log
│   ├── requirement.log
│   ├── architecture.log
│   ├── code.log
│   ├── review.log
│   ├── test.log
│   └── deploy.log
└── tasks/               # 任务日志
    ├── task-001.log
    └── task-002.log
```

### 方式 3：API 接口

OpenClaw 提供 HTTP API（默认端口 18789）：

```bash
# 获取所有 Agent 日志
curl http://127.0.0.1:18789/api/logs

# 获取特定 Agent 的日志
curl http://127.0.0.1:18789/api/logs?agent_id=requirement

# 获取最近的日志
curl http://127.0.0.1:18789/api/logs?limit=50
```

### 方式 4：SSE 实时流

```javascript
const eventSource = new EventSource('http://127.0.0.1:18789/api/logs/stream')

eventSource.onmessage = (event) => {
  const log = JSON.parse(event.data)
  console.log('New log:', log)
}

eventSource.onerror = (error) => {
  console.error('SSE error:', error)
}
```

## 项目集成使用

### 在项目中使用 OpenClawService

```typescript
import { openClawService } from '@/services/openclaw'
import type { OpenClawLog } from '@/services/openclaw'

// 获取 Agent 日志
const logs = await openClawService.getAgentLogs('requirement', 50)

// 实时订阅日志
const unsubscribe = openClawService.subscribeToLogs((log: OpenClawLog) => {
  console.log('New log:', log)
  // 更新 UI
})

// 取消订阅
unsubscribe()
```

### 在 React 组件中使用

```typescript
import { useEffect, useState } from 'react'
import { openClawService } from '@/services/openclaw'
import type { OpenClawLog } from '@/services/openclaw'

function AgentLogs({ agentId }: { agentId: AgentId }) {
  const [logs, setLogs] = useState<OpenClawLog[]>([])

  useEffect(() => {
    // 获取历史日志
    openClawService.getAgentLogs(agentId).then(initialLogs => {
      setLogs(initialLogs)
    })

    // 订阅实时日志
    const unsubscribe = openClawService.subscribeToLogs((log) => {
      if (log.agentId === agentId) {
        setLogs(prev => [log, ...prev])
      }
    })

    return () => unsubscribe()
  }, [agentId])

  return (
    <div>
      {logs.map(log => (
        <div key={log.id}>
          <span>{log.timestamp}</span>
          <span>{log.message}</span>
        </div>
      ))}
    </div>
  )
}
```

## 配置选项

### 环境变量配置

创建 `.env.local` 文件：

```bash
# OpenClaw 配置
VITE_OPENCLAW_BASE_URL=http://127.0.0.1:18789
VITE_OPENCLAW_API_KEY=your-api-key-here
VITE_OPENCLAW_POLLING_INTERVAL=2000
```

### 代码配置

```typescript
import { OpenClawService } from '@/services/openclaw'

const openClawService = new OpenClawService({
  baseUrl: 'http://127.0.0.1:18789',
  apiKey: 'your-api-key',
  pollingInterval: 2000, // 轮询间隔（毫秒）
})
```

## 日志格式

OpenClaw 日志格式：

```typescript
interface OpenClawLog {
  id: string              // 日志唯一标识
  timestamp: string       // ISO 时间戳
  agentId: AgentId        // Agent ID
  level: 'info' | 'warning' | 'error' | 'success'  // 日志级别
  message: string         // 日志消息
  taskId?: string         // 关联的任务 ID
  taskTitle?: string      // 任务标题
  metadata?: Record<string, unknown>  // 额外元数据
}
```

## 故障排查

### 1. 无法连接到 OpenClaw

```bash
# 检查服务状态
openclaw gateway status

# 如果未运行，启动服务
openclaw gateway start

# 检查端口是否被占用
lsof -i :18789
```

### 2. 日志文件为空

```bash
# 检查日志级别配置
openclaw config get gateway.log_level

# 设置为 debug 级别
openclaw config set gateway.log_level debug

# 重启服务
openclaw gateway restart
```

### 3. Agent 未运行

```bash
# 查看 Agent 状态
openclaw agents list

# 如果 Agent 未运行，检查配置
openclaw agents show

# 重新配置 Agent
openclaw agents configure --default --provider ollama --model phi3:mini
```

## 最佳实践

1. **日志级别设置**：
   - 开发环境：`debug`
   - 生产环境：`info` 或 `warning`

2. **日志轮转**：
   - 定期清理旧日志
   - 设置日志文件大小限制

3. **性能优化**：
   - 使用 SSE 而不是轮询（如果支持）
   - 限制日志数量
   - 实现日志分页

4. **安全考虑**：
   - 不要在日志中记录敏感信息
   - 使用 API Key 进行认证
   - 限制日志访问权限

## 相关资源

- [OpenClaw 官方文档](https://github.com/openclaw/openclaw)
- [OpenClaw API 文档](http://localhost:18789/docs)
- [Ollama 安装指南](https://ollama.ai/)

# AgentTeam 后端服务

这是一个轻量级的 Node.js 后端服务，用于集成 OpenClaw 并提供 API 接口。

## 功能特性

- ✅ **OpenClaw Gateway API 集成**：通过 HTTP API 获取 OpenClaw 信息
- ✅ **日志文件读取**：直接读取 `~/.openclaw/logs/` 目录下的日志文件
- ✅ **实时日志推送**：通过 WebSocket 实时推送日志更新
- ✅ **RESTful API**：提供标准的 REST API 接口
- ✅ **SQLite 数据库**：轻量级数据库，开发环境零配置

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
pnpm install

# 安装后端依赖
cd server && pnpm install && cd ..
```

### 2. 初始化数据库

```bash
# 生成 Prisma Client
pnpm run db:generate

# 运行数据库迁移
pnpm run db:migrate
```

### 3. 配置 OpenClaw

确保 OpenClaw 服务正在运行：

```bash
# 启动 OpenClaw
openclaw gateway start

# 检查状态
openclaw gateway status
```

### 4. 启动开发服务器

```bash
# 同时启动前后端
pnpm run dev

# 或分别启动
pnpm run dev:frontend  # 前端: http://localhost:5173
pnpm run dev:backend   # 后端: http://localhost:3000
```

## API 接口

### Agents API

```
GET /api/agents                    # 获取所有 Agents
GET /api/agents/status             # 获取 OpenClaw 状态
GET /api/agents/:id                # 获取 Agent 详情
GET /api/agents/:id/logs           # 获取 Agent 日志
  Query Parameters:
    - limit: number (default: 50)
    - source: 'gateway' | 'file' (default: 'gateway')
```

### Logs API

```
GET /api/logs/recent               # 获取最近日志
  Query Parameters:
    - limit: number (default: 100)
    - source: 'gateway' | 'file' (default: 'gateway')
```

### WebSocket 事件

```javascript
// 连接 WebSocket
const socket = io('http://localhost:3000')

// 订阅 Agent 日志
socket.emit('subscribe:agent:logs', 'requirement')

// 接收日志
socket.on('log', (log) => {
  console.log('New log:', log)
})

// 取消订阅
socket.emit('unsubscribe:agent:logs', 'requirement')
```

## 日志获取方式

### 方式一：Gateway API（推荐）

通过 OpenClaw 的 HTTP API 获取日志：

```typescript
const logs = await apiClient.getAgentLogs('requirement', 50, 'gateway')
```

**优点：**
- 结构化数据
- 实时性好
- 支持过滤和查询

**缺点：**
- 需要 OpenClaw 服务运行
- 依赖网络连接

### 方式二：文件读取

直接读取 `~/.openclaw/logs/agents/` 目录下的日志文件：

```typescript
const logs = await apiClient.getAgentLogs('requirement', 50, 'file')
```

**优点：**
- 不依赖 OpenClaw 服务
- 可以读取历史日志
- 离线可用

**缺点：**
- 需要文件系统访问权限
- 解析可能不完整

## 项目结构

```
server/
├── src/
│   ├── config/           # 配置文件
│   ├── controllers/      # 控制器
│   ├── services/         # 业务逻辑
│   │   ├── openclaw.gateway.ts    # OpenClaw API 集成
│   │   └── logfile.service.ts     # 日志文件读取
│   ├── routes/           # 路由
│   ├── types/            # 类型定义
│   └── app.ts            # 应用入口
├── prisma/
│   └── schema.prisma     # 数据库模型
├── package.json
└── tsconfig.json
```

## 环境变量

创建 `server/.env` 文件：

```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库
DATABASE_URL="file:./prisma/dev.db"

# OpenClaw
OPENCLAW_URL=http://127.0.0.1:18789
OPENCLAW_API_KEY=

# 日志路径（可选）
OPENCLAW_LOG_PATH=~/.openclaw/logs

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 开发命令

```bash
# 开发
pnpm run dev              # 启动前后端
pnpm run dev:frontend     # 仅启动前端
pnpm run dev:backend      # 仅启动后端

# 构建
pnpm run build            # 构建前后端
pnpm run build:frontend   # 仅构建前端
pnpm run build:backend    # 仅构建后端

# 数据库
pnpm run db:generate      # 生成 Prisma Client
pnpm run db:migrate       # 运行数据库迁移
pnpm run db:studio        # 打开 Prisma Studio

# 生产
pnpm run start            # 启动生产服务器
```

## 故障排查

### 1. 无法连接到 OpenClaw

```bash
# 检查 OpenClaw 状态
openclaw gateway status

# 如果未运行，启动服务
openclaw gateway start

# 检查端口是否被占用
lsof -i :18789
```

### 2. 日志文件读取失败

```bash
# 检查日志目录是否存在
ls -la ~/.openclaw/logs/

# 检查文件权限
chmod -R 755 ~/.openclaw/logs/
```

### 3. 数据库错误

```bash
# 重新生成 Prisma Client
pnpm run db:generate

# 重置数据库
rm server/prisma/dev.db
pnpm run db:migrate
```

## 下一步

- [ ] 添加任务管理 API
- [ ] 添加用户认证
- [ ] 添加日志搜索和过滤
- [ ] 添加数据导出功能
- [ ] 添加性能监控

## 相关文档

- [OpenClaw 集成指南](./OPENCLAW_INTEGRATION.md)
- [后端架构方案](./BACKEND_ARCHITECTURE.md)
- [前后端一体化项目结构](./MONOREPO_STRUCTURE.md)

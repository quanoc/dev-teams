# 后端架构方案

## 概述

为 agentteam 项目添加 Node.js 后端，提供 API 服务、数据持久化、OpenClaw 集成等功能。

## 技术栈选择

### 方案一：轻量级方案（推荐用于快速开发）

```
前端: React + TypeScript + Vite
后端: Express.js + TypeScript
数据库: SQLite (开发) / PostgreSQL (生产)
实时通信: Socket.io
ORM: Prisma
```

**优点：**
- 快速开发，学习成本低
- TypeScript 全栈类型安全
- SQLite 开发环境零配置
- Prisma ORM 类型安全，迁移方便

**缺点：**
- Express.js 相对较老
- 需要手动配置很多中间件

### 方案二：现代化方案（推荐用于生产环境）

```
前端: React + TypeScript + Vite
后端: NestJS + TypeScript
数据库: PostgreSQL
实时通信: Socket.io / WebSocket
ORM: TypeORM / Prisma
```

**优点：**
- 企业级框架，架构清晰
- 内置依赖注入、模块化
- 完善的生态系统
- 更好的可维护性和扩展性

**缺点：**
- 学习曲线较陡
- 开发速度相对较慢

### 方案三：全栈框架方案

```
全栈: Next.js / Remix
数据库: PostgreSQL
实时通信: Server-Sent Events
ORM: Prisma
```

**优点：**
- 前后端一体化开发
- SSR/SSG 支持
- 内置 API 路由
- 部署简单

**缺点：**
- 需要重构现有前端代码
- 框架约束较多

## 推荐方案：Express + TypeScript + Prisma

基于项目现状和快速开发需求，推荐使用**方案一**。

## 项目结构

```
agentteam/
├── src/                    # 前端源码
│   ├── components/
│   ├── pages/
│   ├── stores/
│   ├── services/
│   └── ...
├── server/                 # 后端源码
│   ├── src/
│   │   ├── config/        # 配置文件
│   │   │   ├── database.ts
│   │   │   ├── openclaw.ts
│   │   │   └── index.ts
│   │   ├── controllers/   # 控制器
│   │   │   ├── agents.controller.ts
│   │   │   ├── tasks.controller.ts
│   │   │   ├── logs.controller.ts
│   │   │   └── auth.controller.ts
│   │   ├── services/      # 业务逻辑
│   │   │   ├── agents.service.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── logs.service.ts
│   │   │   └── openclaw.service.ts
│   │   ├── models/        # 数据模型
│   │   │   ├── agent.model.ts
│   │   │   ├── task.model.ts
│   │   │   └── log.model.ts
│   │   ├── routes/        # 路由
│   │   │   ├── agents.routes.ts
│   │   │   ├── tasks.routes.ts
│   │   │   ├── logs.routes.ts
│   │   │   └── index.ts
│   │   ├── middleware/    # 中间件
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── types/         # 类型定义
│   │   │   └── index.ts
│   │   ├── utils/         # 工具函数
│   │   │   ├── logger.ts
│   │   │   └── helpers.ts
│   │   └── app.ts         # 应用入口
│   ├── prisma/            # Prisma schema
│   │   └── schema.prisma
│   ├── tests/             # 测试文件
│   ├── package.json
│   └── tsconfig.json
├── package.json           # 根 package.json
└── README.md
```

## 核心功能模块

### 1. OpenClaw 集成服务

```typescript
// server/src/services/openclaw.service.ts
import axios from 'axios'
import { EventEmitter } from 'events'

export class OpenClawService extends EventEmitter {
  private baseUrl: string
  private apiKey?: string

  constructor(config: { baseUrl: string; apiKey?: string }) {
    super()
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
  }

  async getAgentLogs(agentId: string, limit: number = 50) {
    const response = await axios.get(
      `${this.baseUrl}/api/agents/${agentId}/logs`,
      {
        params: { limit },
        headers: this.getHeaders(),
      }
    )
    return response.data
  }

  async subscribeToLogs() {
    // SSE 或 WebSocket 连接
    const eventSource = new EventSource(`${this.baseUrl}/api/logs/stream`)
    
    eventSource.onmessage = (event) => {
      const log = JSON.parse(event.data)
      this.emit('log', log)
    }

    return eventSource
  }

  private getHeaders() {
    const headers: any = {}
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }
    return headers
  }
}
```

### 2. 任务管理服务

```typescript
// server/src/services/tasks.service.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TasksService {
  async getAllTasks(filters?: {
    status?: string
    type?: string
    agentId?: string
  }) {
    return await prisma.task.findMany({
      where: filters,
      include: {
        agent: true,
        stages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getTaskById(id: string) {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        agent: true,
        stages: {
          include: {
            messages: true,
          },
        },
      },
    })
  }

  async createTask(data: any) {
    return await prisma.task.create({
      data,
    })
  }

  async updateTask(id: string, data: any) {
    return await prisma.task.update({
      where: { id },
      data,
    })
  }
}
```

### 3. 日志服务

```typescript
// server/src/services/logs.service.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class LogsService {
  async getAgentLogs(agentId: string, limit: number = 50) {
    return await prisma.log.findMany({
      where: { agentId },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    })
  }

  async createLog(data: {
    agentId: string
    level: string
    message: string
    taskId?: string
    metadata?: any
  }) {
    return await prisma.log.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    })
  }

  async getRecentLogs(limit: number = 100) {
    return await prisma.log.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      include: {
        agent: true,
        task: true,
      },
    })
  }
}
```

### 4. API 路由

```typescript
// server/src/routes/agents.routes.ts
import { Router } from 'express'
import { AgentsController } from '../controllers/agents.controller'

const router = Router()
const controller = new AgentsController()

router.get('/', controller.getAllAgents)
router.get('/:id', controller.getAgentById)
router.get('/:id/logs', controller.getAgentLogs)
router.get('/:id/tasks', controller.getAgentTasks)
router.get('/:id/skills', controller.getAgentSkills)

export default router
```

```typescript
// server/src/routes/tasks.routes.ts
import { Router } from 'express'
import { TasksController } from '../controllers/tasks.controller'

const router = Router()
const controller = new TasksController()

router.get('/', controller.getAllTasks)
router.get('/:id', controller.getTaskById)
router.post('/', controller.createTask)
router.put('/:id', controller.updateTask)
router.delete('/:id', controller.deleteTask)

export default router
```

### 5. WebSocket 实时通信

```typescript
// server/src/app.ts
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { OpenClawService } from './services/openclaw.service'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

const openClawService = new OpenClawService({
  baseUrl: process.env.OPENCLAW_URL || 'http://127.0.0.1:18789',
})

// WebSocket 连接
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // 订阅特定 Agent 的日志
  socket.on('subscribe:agent:logs', (agentId: string) => {
    socket.join(`agent:${agentId}:logs`)
  })

  // 取消订阅
  socket.on('unsubscribe:agent:logs', (agentId: string) => {
    socket.leave(`agent:${agentId}:logs`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// OpenClaw 日志推送
openClawService.on('log', (log) => {
  io.to(`agent:${log.agentId}:logs`).emit('log', log)
})

export { app, httpServer, io }
```

## 数据库设计

### Prisma Schema

```prisma
// server/prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Agent {
  id          String   @id
  name        String
  type        String
  status      String
  color       String
  icon        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  tasks       Task[]
  logs        Log[]
  skills      AgentSkill[]
}

model Task {
  id          String   @id
  title       String
  type        String
  status      String
  priority    String
  agentId     String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  agent       Agent    @relation(fields: [agentId], references: [id])
  stages      Stage[]
  logs        Log[]
}

model Stage {
  id        String   @id
  taskId    String
  name      String
  status    String
  order     Int
  createdAt DateTime @default(now())
  
  task      Task     @relation(fields: [taskId], references: [id])
  messages  Message[]
}

model Message {
  id        String   @id
  stageId   String
  content   String
  type      String
  createdAt DateTime @default(now())
  
  stage     Stage    @relation(fields: [stageId], references: [id])
}

model Log {
  id        String   @id
  agentId   String
  taskId    String?
  level     String
  message   String
  timestamp DateTime @default(now())
  metadata  Json?
  
  agent     Agent    @relation(fields: [agentId], references: [id])
  task      Task?    @relation(fields: [taskId], references: [id])
}

model AgentSkill {
  id          String   @id
  agentId     String
  name        String
  version     String
  description String?
  enabled     Boolean  @default(true)
  installedAt DateTime @default(now())
  
  agent       Agent    @relation(fields: [agentId], references: [id])
}
```

## API 接口设计

### Agents API

```
GET    /api/agents              # 获取所有 Agents
GET    /api/agents/:id          # 获取 Agent 详情
GET    /api/agents/:id/logs     # 获取 Agent 日志
GET    /api/agents/:id/tasks    # 获取 Agent 任务
GET    /api/agents/:id/skills   # 获取 Agent 技能
```

### Tasks API

```
GET    /api/tasks               # 获取所有任务
GET    /api/tasks/:id           # 获取任务详情
POST   /api/tasks               # 创建任务
PUT    /api/tasks/:id           # 更新任务
DELETE /api/tasks/:id           # 删除任务
```

### Logs API

```
GET    /api/logs                # 获取最近日志
GET    /api/logs/agent/:id      # 获取 Agent 日志
POST   /api/logs                # 创建日志
```

### OpenClaw API

```
GET    /api/openclaw/status     # 获取 OpenClaw 状态
GET    /api/openclaw/agents     # 获取 OpenClaw Agents
GET    /api/openclaw/logs       # 获取 OpenClaw 日志
```

## 环境配置

### .env 文件

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# OpenClaw
OPENCLAW_URL=http://127.0.0.1:18789
OPENCLAW_API_KEY=your-api-key

# JWT (可选，用于认证)
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 部署方案

### 开发环境

```bash
# 安装依赖
pnpm install

# 初始化数据库
cd server
npx prisma migrate dev
npx prisma generate

# 启动开发服务器
pnpm run dev
```

### 生产环境

```bash
# 构建
pnpm run build

# 启动生产服务器
pnpm run start:prod

# 或使用 PM2
pm2 start server/dist/app.js --name agentteam-api
```

## 下一步

1. 初始化后端项目
2. 配置数据库和 ORM
3. 实现核心 API
4. 集成 OpenClaw 服务
5. 添加 WebSocket 支持
6. 前端对接后端 API
7. 添加认证和权限
8. 编写测试
9. 部署上线

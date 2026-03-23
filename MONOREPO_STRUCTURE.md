# 前后端一体化项目结构

## 推荐结构（Monorepo）

```
agentteam/
├── src/                          # 前端源码
│   ├── components/              # React 组件
│   │   ├── agents/
│   │   ├── tasks/
│   │   └── ui/
│   ├── pages/                   # 页面
│   │   ├── Overview.tsx
│   │   └── ...
│   ├── stores/                  # 状态管理
│   │   ├── agentStore.ts
│   │   └── taskStore.ts
│   ├── services/                # 前端服务
│   │   ├── api.ts              # API 客户端
│   │   └── openclaw.ts
│   ├── hooks/                   # React Hooks
│   │   └── useOpenClawLogs.ts
│   ├── lib/                     # 工具库
│   │   ├── utils.ts
│   │   └── mock.ts
│   ├── types/                   # 前端类型
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
│
├── server/                       # 后端源码
│   ├── src/
│   │   ├── config/              # 配置
│   │   │   ├── database.ts
│   │   │   ├── openclaw.ts
│   │   │   └── index.ts
│   │   ├── controllers/         # 控制器
│   │   │   ├── agents.controller.ts
│   │   │   ├── tasks.controller.ts
│   │   │   └── logs.controller.ts
│   │   ├── services/            # 业务逻辑
│   │   │   ├── agents.service.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── openclaw.service.ts
│   │   ├── routes/              # 路由
│   │   │   ├── agents.routes.ts
│   │   │   ├── tasks.routes.ts
│   │   │   └── index.ts
│   │   ├── middleware/          # 中间件
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── utils/               # 工具函数
│   │   │   ├── logger.ts
│   │   │   └── helpers.ts
│   │   └── app.ts               # 应用入口
│   ├── prisma/                  # 数据库
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/                   # 后端测试
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                       # 共享代码
│   ├── types/                   # 共享类型
│   │   ├── agent.ts
│   │   ├── task.ts
│   │   ├── log.ts
│   │   └── index.ts
│   ├── constants/               # 共享常量
│   │   └── index.ts
│   ├── utils/                   # 共享工具
│   │   └── helpers.ts
│   └── package.json
│
├── public/                       # 静态资源
│   └── ...
│
├── package.json                  # 根 package.json
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
├── tsconfig.node.json           # Node TypeScript 配置
├── .env                         # 环境变量
├── .env.example                 # 环境变量示例
└── README.md
```

## 根 package.json 配置

```json
{
  "name": "agentteam",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "concurrently \"pnpm run dev:frontend\" \"pnpm run dev:backend\"",
    "dev:frontend": "vite",
    "dev:backend": "cd server && pnpm run dev",
    "build": "pnpm run build:frontend && pnpm run build:backend",
    "build:frontend": "tsc && vite build",
    "build:backend": "cd server && pnpm run build",
    "preview": "vite preview",
    "start": "cd server && pnpm run start",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "db:generate": "cd server && prisma generate",
    "db:migrate": "cd server && prisma migrate dev",
    "db:studio": "cd server && prisma studio"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.3",
    "zustand": "^4.5.2",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.1.1",
    "@typescript-eslint/parser": "^7.1.1",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "concurrently": "^8.2.2",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.6",
    "vitest": "^1.6.0"
  }
}
```

## server/package.json 配置

```json
{
  "name": "agentteam-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "vitest"
  },
  "dependencies": {
    "@prisma/client": "^5.11.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.3",
    "socket.io": "^4.7.5",
    "axios": "^1.6.7",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.24",
    "prisma": "^5.11.0",
    "tsx": "^4.7.1",
    "typescript": "^5.4.2",
    "vitest": "^1.6.0"
  }
}
```

## shared/package.json 配置

```json
{
  "name": "agentteam-shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.4.2"
  }
}
```

## 共享类型示例

```typescript
// shared/types/agent.ts
export type AgentId = 
  | 'main'
  | 'requirement'
  | 'architecture'
  | 'code'
  | 'review'
  | 'test'
  | 'deploy'

export interface Agent {
  id: AgentId
  name: string
  type: string
  status: 'running' | 'idle' | 'waiting' | 'error'
  color: string
  icon: string
  description?: string
}

export interface AgentLog {
  id: string
  timestamp: string
  agentId: AgentId
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  taskId?: string
  taskTitle?: string
  metadata?: Record<string, unknown>
}
```

```typescript
// shared/types/task.ts
export type TaskType = 'feature' | 'bugfix' | 'refactor' | 'docs' | 'test'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  agentId: AgentId
  description?: string
  createdAt: string
  updatedAt: string
}
```

```typescript
// shared/types/index.ts
export * from './agent'
export * from './task'
export * from './log'
```

## 前端使用共享类型

```typescript
// src/types/index.ts
export * from '@agentteam/shared/types'

// 前端特有类型
export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}
```

## 后端使用共享类型

```typescript
// server/src/types/index.ts
export * from '@agentteam/shared/types'

// 后端特有类型
export interface DatabaseConfig {
  url: string
  poolSize: number
}
```

## 环境变量配置

```bash
# .env

# 前端
VITE_API_URL=http://localhost:3000/api

# 后端
PORT=3000
NODE_ENV=development

# 数据库
DATABASE_URL="file:./server/prisma/dev.db"

# OpenClaw
OPENCLAW_URL=http://127.0.0.1:18789
OPENCLAW_API_KEY=your-api-key

# JWT (可选)
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
```

## 开发流程

### 1. 启动开发环境

```bash
# 安装依赖
pnpm install

# 初始化数据库
pnpm run db:generate
pnpm run db:migrate

# 启动前后端（并发）
pnpm run dev

# 或分别启动
pnpm run dev:frontend  # 前端: http://localhost:5173
pnpm run dev:backend   # 后端: http://localhost:3000
```

### 2. 开发新功能

```bash
# 1. 在 shared/types 添加共享类型
# 2. 在 server 实现后端 API
# 3. 在 src 实现前端界面
# 4. 测试
pnpm run test
```

### 3. 构建生产版本

```bash
# 构建前后端
pnpm run build

# 启动生产服务器
pnpm run start
```

## 部署方案

### 方案一：单服务器部署（推荐）

```bash
# 1. 构建
pnpm run build

# 2. 启动后端（前端静态文件由后端服务）
pnpm run start

# 或使用 PM2
pm2 start server/dist/app.js --name agentteam
```

### 方案二：Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
```

```bash
# 构建镜像
docker build -t agentteam .

# 运行容器
docker run -p 3000:3000 agentteam
```

### 方案三：云平台部署

**Vercel（前端） + Railway（后端）**

```bash
# 前端部署到 Vercel
vercel

# 后端部署到 Railway
railway init
railway up
```

## 优势总结

### 1. 开发效率
- ✅ 一键启动前后端
- ✅ 类型安全，减少错误
- ✅ 代码复用，减少重复

### 2. 维护性
- ✅ 统一的代码仓库
- ✅ 统一的依赖管理
- ✅ 统一的版本控制

### 3. 部署灵活
- ✅ 可以单服务器部署
- ✅ 可以容器化部署
- ✅ 可以云平台部署

### 4. 团队协作
- ✅ 简单的项目结构
- ✅ 清晰的代码组织
- ✅ 易于理解和上手

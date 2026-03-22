# AgentTeam Dashboard - AI智能体团队管理仪表板

## 📋 项目概述

**AgentTeam Dashboard** 是一个现代化的AI智能体团队管理仪表板，专为管理和监控AI智能体工作流程而设计。该应用提供实时的任务跟踪、智能体状态监控、DORA指标分析等功能，帮助团队高效协作和管理AI驱动的开发流程。

### 🎯 核心特性

- **智能体管理**：实时监控多个AI智能体的状态和活动
- **任务跟踪**：完整的任务生命周期管理，从需求到部署
- **DORA指标**：专业的DevOps指标监控和分析
- **活动流**：实时更新的团队协作活动记录
- **响应式设计**：基于Tailwind CSS的现代化UI

## 🛠️ 技术栈

### 核心框架
- **React 18.3.1** - 现代前端框架
- **TypeScript 5.5.3** - 类型安全的JavaScript超集
- **Vite 5.4.1** - 下一代前端构建工具

### 状态管理
- **Zustand 4.5.4** - 轻量级状态管理库
- 基于React hooks的响应式状态管理

### UI组件
- **Tailwind CSS 3.4.10** - 原子化CSS框架
- **Lucide React 0.427.0** - 优雅的图标库
- **clsx 2.1.1** - 条件类名组合工具

### 路由管理
- **React Router DOM 6.26.1** - 声明式路由管理

## 🏗️ 架构设计

### 目录结构

```
src/
├── components/          # 组件目录
│   ├── ui/             # 通用UI组件
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   ├── layout/         # 布局组件
│   │   ├── Shell.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── agents/         # 智能体相关组件
│   │   ├── AgentCard.tsx
│   │   ├── AgentTeamHeader.tsx
│   │   ├── DoraMetrics.tsx
│   │   └── ActivityFeed.tsx
│   └── tasks/          # 任务相关组件
│       ├── TaskRow.tsx
│       ├── StageProgress.tsx
│       ├── MessageStream.tsx
│       ├── WorkspacePanel.tsx
│       └── ArtifactPanel.tsx
├── stores/             # 状态管理
│   ├── agentStore.ts   # 智能体状态
│   ├── taskStore.ts    # 任务状态
│   └── themeStore.ts   # 主题状态
├── pages/              # 页面组件
│   ├── Overview.tsx    # 概览页面
│   ├── Tasks.tsx       # 任务列表
│   └── TaskDetail.tsx  # 任务详情
├── types/              # 类型定义
│   └── index.ts        # 全局类型
├── lib/                # 工具函数
│   ├── utils.ts        # 通用工具
│   └── mock.ts         # 模拟数据
└── App.tsx             # 主应用组件
```

### 状态管理架构

#### Agent Store
管理智能体状态、活动流和DORA指标：

```typescript
interface AgentStore {
  agents: Agent[]           // 智能体列表
  activities: Activity[]    // 活动流
  metrics: DoraMetrics      // DORA指标
  tickAgent: (id: string) => void  // 更新智能体活动状态
}
```

#### Task Store
管理任务列表和筛选状态：

```typescript
interface TaskStore {
  tasks: Task[]                     // 任务列表
  selectedTaskId: string | null     // 选中的任务ID
  activeTab: 'all' | 'waiting' | 'active' | 'done' | 'blocked'  // 当前标签页
  setActiveTab: (tab: TaskStore['activeTab']) => void
  selectTask: (id: string | null) => void
  filteredTasks: () => Task[]       // 筛选后的任务
}
```

## 📊 数据模型

### 核心类型定义

#### Agent（智能体）
```typescript
interface Agent {
  id: AgentId                    // 智能体ID
  name: string                   // 智能体名称
  participatesIn: StageKey[]     // 参与阶段
  status: AgentStatus            // 当前状态
  currentTaskId?: string         // 当前任务ID
  currentTaskTitle?: string      // 当前任务标题
  todayCompleted: number         // 今日完成任务数
  todayProcessedMin: number      // 今日处理时长（分钟）
  lastActiveAt: string          // 最后活动时间
}
```

#### Task（任务）
```typescript
interface Task {
  id: string                     // 任务ID
  title: string                  // 任务标题
  description: string            // 任务描述
  type: TaskType                // 任务类型
  size: TaskSize                // 任务规模
  priority: TaskPriority        // 优先级
  status: TaskStatus            // 任务状态
  currentStage: StageKey        // 当前阶段
  stages: Stage[]               // 阶段列表
  assignee: Member              // 负责人
  createdAt: string             // 创建时间
  updatedAt: string             // 更新时间
  durationEstimateMin: number   // 预估时长
  durationElapsedMin: number    // 已消耗时长
  blockedReason?: string        // 阻塞原因
  tags: string[]                // 标签
  messages: Message[]           // 消息列表
  artifacts: Artifact[]         // 制品列表
}
```

#### Stage（阶段）
```typescript
interface Stage {
  key: StageKey                 // 阶段键
  label: string                 // 阶段标签
  status: StageStatus           // 阶段状态
  agentId: AgentId              // 负责智能体
  startedAt?: string            // 开始时间
  completedAt?: string          // 完成时间
  blockedReason?: string        // 阻塞原因
  artifacts?: Artifact[]        // 阶段制品
}
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd agentteam-dashboard
```

2. **安装依赖**
```bash
pnpm install
```

3. **启动开发服务器**
```bash
pnpm dev
```

4. **构建生产版本**
```bash
pnpm build
```

5. **预览生产版本**
```bash
pnpm preview
```

### 开发环境访问

启动开发服务器后，在浏览器中访问：
- **本地开发**：http://localhost:5173
- **热更新**：自动刷新，无需手动重启

## 📝 开发指南

### 组件开发规范

1. **组件命名**：使用PascalCase命名组件文件
2. **类型定义**：所有组件props必须定义TypeScript接口
3. **状态管理**：使用Zustand进行全局状态管理
4. **样式规范**：使用Tailwind CSS原子化类名

### 状态管理规范

1. **Store拆分**：按业务领域拆分store（agentStore、taskStore等）
2. **选择器优化**：使用computed selectors优化性能
3. **异步操作**：在store中处理异步逻辑

### 路由配置

当前路由结构：
- `/` - 概览页面
- `/tasks` - 任务列表
- `/tasks/:id` - 任务详情
- `/agents` - 智能体管理
- `/metrics` - 指标分析

## 🔧 配置说明

### TypeScript配置
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

### Tailwind CSS配置
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
}
```

## 📈 性能指标

### DORA指标监控
- **部署频率**：监控团队部署频率
- **变更前置时间**：代码提交到部署的时间
- **变更失败率**：部署失败的百分比
- **平均恢复时间**：故障恢复平均时间

### 智能体效率指标
- **今日完成任务数**：每个智能体每日完成任务数量
- **处理时长**：任务处理时间统计
- **活动状态**：实时状态监控

## 🧪 测试策略

### 单元测试
- 组件测试：使用React Testing Library
- 状态管理测试：Zustand store测试
- 工具函数测试：纯函数测试

### 集成测试
- 路由测试：页面导航和参数传递
- 组件交互：用户操作和状态更新
- 数据流测试：全局状态同步

## 📦 部署指南

### Docker部署
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 环境变量
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## 🤝 贡献指南

1. **代码规范**：遵循现有的代码风格
2. **类型安全**：确保所有代码都有适当的类型定义
3. **组件文档**：为新组件添加JSDoc注释
4. **测试覆盖**：确保新功能有相应的测试覆盖

## 📄 许可证

MIT License

---

## 🔄 更新日志

### v0.1.0 (2026-03-22)
- 🎉 初始版本发布
- ✨ 智能体管理功能
- 📋 任务跟踪系统
- 📊 DORA指标监控
- 🎨 现代化UI设计

## 📞 联系方式

- **项目维护者**：[您的姓名]
- **邮箱**：[您的邮箱]
- **项目地址**：[GitHub仓库地址]

---

*AgentTeam Dashboard - 让AI智能体团队协作更高效* 🚀
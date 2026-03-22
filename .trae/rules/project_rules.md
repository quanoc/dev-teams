# AgentTeam Dashboard 项目规则

## 项目概述

AgentTeam Dashboard 是一个基于 React + TypeScript + Tailwind CSS 的 AI 研发团队管理仪表板，采用深色主题设计风格。

---

## 1. 设计系统

### 1.1 颜色系统

#### 背景色阶 (Background Scale)
```
bg-0: #0d0e11  (最深，页面背景)
bg-1: #13151a  (面板背景)
bg-2: #1a1d24  (卡片背景)
bg-3: #22262f  (hover状态)
bg-4: #2a2f3a  (边框高亮)
```

#### 文字色阶 (Text Scale)
```
text-0: #e8eaf0  (主文字，标题)
text-1: #a8adb8  (次要文字)
text-2: #666d7e  (辅助文字)
text-3: #404654  (禁用/占位符)
```

#### 边框颜色
```
line:    #2e3340  (默认边框)
line-2:  #383e4d  (hover边框)
```

#### 主题色
每个主题色都有 `DEFAULT`, `dark`, `bg` 三个变体：

```
Purple: #9b7dff / #3d2e6e / #1a1230  (主品牌色)
Blue:   #4a9eff / #1a3d6e / #0e1e38  (信息/进行中)
Green:  #3dd68c / #1a5c3a / #0a2018  (成功/完成)
Amber:  #f5a623 / #6b4510 / #241600  (警告/等待)
Red:    #ff5c5c / #6b1a1a / #200a0a  (错误/阻塞)
Teal:   #2dd4bf                         (辅助)
```

#### 状态颜色映射
```
Running:   bg: green-bg   / text: green   / border: green-dark
Waiting:   bg: amber-bg  / text: amber   / border: amber-dark
Blocked:   bg: red-bg    / text: red     / border: red-dark
Idle:      bg: bg-2      / text: text-2  / border: line
Analyzing: bg: purple-bg / text: purple  / border: purple-dark
Reviewing: bg: blue-bg   / text: blue    / border: blue-dark
```

### 1.2 字体系统

```
字体族: DM Sans (正文), DM Mono (等宽/数据)
基础字号: 13px
行高: 1.5
```

#### 字号规范
```
页面标题:   text-[13px] font-semibold
面板标题:   text-[11px] font-semibold uppercase tracking-wide
卡片标题:   text-xs font-medium
正文:       text-xs / text-[11px]
辅助文字:   text-[10px]
标签/徽章:  text-[9px]
```

### 1.3 圆角系统
```
默认:  rounded      (6px)
大圆角: rounded-lg   (10px)
```

### 1.4 间距系统
```
紧凑:  p-2, gap-2
默认:  p-3/p-4, gap-3
宽松:  p-5, gap-4
```

---

## 2. 组件规范

### 2.1 面板 (Panel)

```tsx
// 基础面板
<div className="panel">
  <div className="panel-head">
    <span className="panel-title">标题</span>
  </div>
  <div className="panel-body">
    {/* 内容 */}
  </div>
</div>
```

**样式定义:**
```css
.panel {
  @apply bg-bg-1 border border-line rounded-lg;
}
.panel-head {
  @apply px-4 py-3 border-b border-line flex items-center gap-2;
}
.panel-title {
  @apply text-[11px] font-semibold uppercase tracking-wide text-text-1;
}
.panel-body {
  @apply p-4;
}
```

### 2.2 导航项 (NavItem)

```tsx
<NavLink className={cn('nav-item', isActive && 'active')}>
  <Icon className="w-3.5 h-3.5 opacity-60" />
  <span>标签</span>
</NavLink>
```

**样式定义:**
```css
.nav-item {
  @apply flex items-center gap-2 px-2 py-1.5 rounded text-text-1 text-xs 
         transition-all duration-150 cursor-pointer relative;
}
.nav-item:hover {
  @apply bg-bg-3 text-text-0;
}
.nav-item.active {
  @apply bg-bg-3 text-text-0;
}
.nav-item.active::before {
  content: '';
  @apply absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-purple rounded-full;
}
```

### 2.3 任务卡片 (TaskCard)

```tsx
<div className="task-card">
  <div className="text-[11px] text-text-0">标题</div>
  <div className="flex items-center gap-1">
    <span className="type-badge type-feat">feat</span>
    <span className="text-[9px] font-mono text-text-3">5pts</span>
  </div>
</div>
```

**样式定义:**
```css
.task-card {
  @apply bg-bg-1 border border-line rounded p-2 cursor-pointer 
         transition-colors duration-150;
}
.task-card:hover {
  @apply border-line-2;
}
```

### 2.4 状态徽章 (StatusBadge)

```tsx
<span className="status-badge status-running">运行中</span>
```

**样式定义:**
```css
.status-badge {
  @apply text-[9px] font-mono px-1.5 py-0.5 rounded border;
}
.status-running {
  @apply bg-green-bg text-green border-green-dark;
}
.status-waiting {
  @apply bg-amber-bg text-amber border-amber-dark;
}
```

### 2.5 输入框 (Input)

```tsx
<input className="input-field" placeholder="提示文字..." />
```

**样式定义:**
```css
.input-field {
  @apply w-full bg-bg-2 border border-line-2 rounded px-3 py-2 
         text-xs text-text-0 outline-none transition-colors duration-150;
}
.input-field::placeholder {
  @apply text-text-3;
}
.input-field:focus {
  @apply border-purple;
}
```

---

## 3. 布局规范

### 3.1 页面结构

```
┌─────────────────────────────────────────┐
│ Sidebar (200px) │  Main Content         │
│                 │  ┌─────────────────┐  │
│  - Navigation   │  │ TopBar (48px)   │  │
│  - Agent List   │  ├─────────────────┤  │
│                 │  │                 │  │
│                 │  │ Content Area    │  │
│                 │  │ (scrollable)    │  │
│                 │  │                 │  │
│                 │  └─────────────────┘  │
└─────────────────────────────────────────┘
```

### 3.2 布局类

```tsx
// Shell 布局
<div className="flex h-screen overflow-hidden bg-bg-0 font-sans text-text-0">
  <Sidebar />
  <main className="flex-1 flex flex-col overflow-hidden">
    <TopBar />
    <div className="flex-1 overflow-y-auto p-5">
      {/* 内容 */}
    </div>
  </main>
</div>
```

### 3.3 网格系统

```
四列等宽:  grid grid-cols-4 gap-3
三列比例:  grid grid-cols-[1.4fr_1fr_1fr] gap-4
两列等宽:  grid grid-cols-2 gap-4
六列等宽:  grid grid-cols-6 gap-2
```

---

## 4. 动画规范

### 4.1 渐入动画 (Stagger)

```tsx
// 使用 stagger 动画
<div className="animate-stagger-1">...</div>
<div className="animate-stagger-2">...</div>
<div className="animate-stagger-3">...</div>
```

**样式定义:**
```css
.animate-stagger-1 { animation: fadeUp 0.3s 0.05s ease both; }
.animate-stagger-2 { animation: fadeUp 0.3s 0.10s ease both; }
.animate-stagger-3 { animation: fadeUp 0.3s 0.15s ease both; }
.animate-stagger-4 { animation: fadeUp 0.3s 0.20s ease both; }
.animate-stagger-5 { animation: fadeUp 0.3s 0.25s ease both; }
.animate-stagger-6 { animation: fadeUp 0.3s 0.30s ease both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 4.2 脉冲动画

```css
.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}
```

### 4.3 流水线运行动画

```css
.animate-pip-run {
  animation: pipRun 1.8s ease-in-out infinite;
}
@keyframes pipRun {
  0% { width: 20%; }
  50% { width: 75%; }
  100% { width: 20%; }
}
```

---

## 5. 开发规范

### 5.1 文件组织

```
src/
├── components/
│   ├── agents/      # Agent 相关组件
│   ├── layout/      # 布局组件 (Shell, Sidebar, TopBar)
│   ├── tasks/       # 任务相关组件
│   └── ui/          # 基础 UI 组件
├── pages/           # 页面组件
├── stores/          # Zustand 状态管理
├── lib/             # 工具函数
└── types/           # TypeScript 类型定义
```

### 5.2 命名规范

- **组件**: PascalCase (e.g., `AgentTeamHeader.tsx`)
- **工具函数**: camelCase (e.g., `cn.ts`)
- **样式类**: kebab-case (e.g., `agent-row`)
- **常量**: UPPER_SNAKE_CASE (e.g., `MASTER_AGENT`)

### 5.3 导入顺序

```tsx
// 1. React/框架
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

// 2. 第三方库
import { FileText, Cpu } from 'lucide-react'

// 3. 本地组件
import { TopBar } from '@/components/layout/TopBar'

// 4. 工具/存储
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/stores/taskStore'
```

### 5.4 类型定义

```tsx
// 接口定义
interface Agent {
  id: string
  name: string
  status: 'online' | 'busy' | 'idle' | 'offline'
  color: 'purple' | 'blue' | 'green' | 'amber' | 'red' | 'teal'
}

// Props 定义
interface AgentCardProps {
  agent: Agent
  onClick?: (id: string) => void
}
```

---

## 6. Tailwind 配置

### 6.1 自定义颜色

```js
// tailwind.config.js
colors: {
  bg: {
    0: '#0d0e11',
    1: '#13151a',
    2: '#1a1d24',
    3: '#22262f',
    4: '#2a2f3a',
  },
  text: {
    0: '#e8eaf0',
    1: '#a8adb8',
    2: '#666d7e',
    3: '#404654',
  },
  line: {
    DEFAULT: '#2e3340',
    2: '#383e4d',
  },
  // ... 其他颜色
}
```

### 6.2 自定义动画

```js
animation: {
  'pulse-slow': 'pulse 2s ease-in-out infinite',
  'fade-up': 'fadeUp 0.3s ease both',
  'pip-run': 'pipRun 1.8s ease-in-out infinite',
}
```

---

## 7. 最佳实践

### 7.1 颜色使用

- ✅ 使用 `text-text-0` 作为标题文字
- ✅ 使用 `text-text-1` 作为正文文字
- ✅ 使用 `text-text-2` 作为辅助/描述文字
- ✅ 使用 `bg-bg-1` 作为面板背景
- ✅ 使用 `border-line` 作为默认边框
- ❌ 避免直接使用硬编码颜色值
- ❌ 避免使用 Tailwind 默认的 gray/zinc 颜色

### 7.2 间距使用

- ✅ 相关元素使用 `gap-2`
- ✅ 面板内边距使用 `p-3` 或 `p-4`
- ✅ 面板间距使用 `space-y-4` 或 `gap-4`
- ❌ 避免过大的间距 (`gap-8`, `p-8`)

### 7.3 响应式

- 桌面端为主要目标 (1280px+)
- 使用固定宽度 Sidebar (200px)
- 主内容区自适应剩余空间

---

## 8. 示例代码

### 8.1 完整面板示例

```tsx
export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="panel p-4 animate-stagger-1">
      <div className="text-[10px] font-medium uppercase tracking-wider text-text-2 mb-2">
        {label}
      </div>
      <div className="text-[26px] font-mono font-light text-text-0 leading-none">
        {value}
      </div>
      <div className="flex items-center gap-1 text-[11px] mt-1">
        <TrendingUp className="w-3 h-3 text-green" />
        <span className="text-green">{trend}</span>
      </div>
    </div>
  )
}
```

### 8.2 Agent 卡片示例

```tsx
export function AgentStatus({ name, status, color }: AgentProps) {
  const colorCfg = colorConfig[color]
  const statusCfg = statusConfig[status]
  
  return (
    <div className={cn(
      'flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-dashed',
      'bg-bg-2/50 hover:bg-bg-2 hover:border-solid transition-all',
      colorCfg.border
    )}>
      <div className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
      <span className="text-[11px] font-medium text-text-0">{name}</span>
    </div>
  )
}
```

---

*规则版本: 1.0*
*最后更新: 2026-03-22*

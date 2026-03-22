# AgentTeam Dashboard - 组件API文档

## 📚 组件总览

本项目的UI组件采用TypeScript + React技术栈，所有组件都遵循统一的接口规范。以下是核心组件的API文档。

---

## 🎯 智能体相关组件

### AgentCard

智能体卡片组件，用于展示单个智能体的状态和信息。

#### 属性接口

```typescript
interface AgentCardProps {
  /** 智能体唯一标识 */
  id: AgentId
  
  /** 智能体名称 */
  name: string
  
  /** 智能体当前状态 */
  status: AgentStatus
  
  /** 当前任务ID（可选） */
  currentTaskId?: string
  
  /** 当前任务标题（可选） */
  currentTaskTitle?: string
  
  /** 今日完成任务数 */
  todayCompleted: number
  
  /** 今日处理时长（分钟） */
  todayProcessedMin: number
  
  /** 最后活动时间 */
  lastActiveAt: string
  
  /** 智能体头像颜色 */
  avatarColor?: string
  
  /** 智能体头像文本 */
  avatarText?: string
  
  /** 点击事件处理函数 */
  onClick?: (id: AgentId) => void
  
  /** 是否处于选中状态 */
  isSelected?: boolean
  
  /** 额外CSS类名 */
  className?: string
}
```

#### 使用示例

```tsx
<AgentCard
  id="main"
  name="主智能体"
  status="running"
  currentTaskId="task-001"
  currentTaskTitle="开发用户登录功能"
  todayCompleted={5}
  todayProcessedMin={120}
  lastActiveAt="2026-03-22T14:30:00Z"
  avatarColor="bg-blue-500"
  avatarText="MA"
  onClick={(id) => console.log('点击智能体:', id)}
  isSelected={false}
/>
```

---

### DoraMetrics

DORA指标展示组件，显示DevOps四大核心指标。

#### 属性接口

```typescript
interface DoraMetricsProps {
  /** 部署频率 */
  deployFrequency: string
  
  /** 变更前置时间 */
  leadTimeForChanges: string
  
  /** 变更失败率 */
  changeFailureRate: string
  
  /** 平均恢复时间 */
  mttr: string
  
  /** 部署频率趋势 */
  deployFrequencyTrend: 'up' | 'down' | 'stable'
  
  /** 变更前置时间趋势 */
  leadTimeTrend: 'up' | 'down' | 'stable'
  
  /** 失败率趋势 */
  failureRateTrend: 'up' | 'down' | 'stable'
  
  /** 恢复时间趋势 */
  mttrTrend: 'up' | 'down' | 'stable'
  
  /** 标题 */
  title?: string
  
  /** 是否显示加载状态 */
  loading?: boolean
  
  /** 额外CSS类名 */
  className?: string
}
```

#### 使用示例

```tsx
<DoraMetrics
  deployFrequency="5.2次/天"
  leadTimeForChanges="2.5小时"
  changeFailureRate="3.2%"
  mttr="45分钟"
  deployFrequencyTrend="up"
  leadTimeTrend="down"
  failureRateTrend="stable"
  mttrTrend="down"
  title="DORA指标监控"
  loading={false}
/>
```

---

### ActivityFeed

活动流组件，展示团队的最新动态。

#### 属性接口

```typescript
interface ActivityFeedProps {
  /** 活动列表 */
  activities: Activity[]
  
  /** 标题 */
  title?: string
  
  /** 是否显示加载状态 */
  loading?: boolean
  
  /** 最大显示数量 */
  maxItems?: number
  
  /** 是否自动滚动到底部 */
  autoScroll?: boolean
  
  /** 额外CSS类名 */
  className?: string
  
  /** 空状态提示文本 */
  emptyText?: string
}
```

#### 使用示例

```tsx
<ActivityFeed
  activities={activities}
  title="最新动态"
  loading={false}
  maxItems={10}
  autoScroll={true}
  emptyText="暂无活动记录"
/>
```

---

## 📋 任务相关组件

### TaskRow

任务行组件，用于任务列表中的单个任务展示。

#### 属性接口

```typescript
interface TaskRowProps {
  /** 任务数据 */
  task: Task
  
  /** 是否处于选中状态 */
  isSelected?: boolean
  
  /** 点击事件处理函数 */
  onClick?: (taskId: string) => void
  
  /** 双击事件处理函数 */
  onDoubleClick?: (taskId: string) => void
  
  /** 额外CSS类名 */
  className?: string
}
```

#### 使用示例

```tsx
<TaskRow
  task={task}
  isSelected={selectedTaskId === task.id}
  onClick={(id) => setSelectedTaskId(id)}
  onDoubleClick={(id) => navigate(`/tasks/${id}`)}
/>
```

---

### StageProgress

阶段进度组件，展示任务的各个阶段状态。

#### 属性接口

```typescript
interface StageProgressProps {
  /** 阶段列表 */
  stages: Stage[]
  
  /** 当前阶段 */
  currentStage: StageKey
  
  /** 是否垂直显示 */
  vertical?: boolean
  
  /** 是否紧凑模式 */
  compact?: boolean
  
  /** 额外CSS类名 */
  className?: string
  
  /** 阶段点击事件 */
  onStageClick?: (stageKey: StageKey) => void
}
```

#### 使用示例

```tsx
<StageProgress
  stages={task.stages}
  currentStage={task.currentStage}
  vertical={false}
  compact={false}
  onStageClick={(stageKey) => console.log('点击阶段:', stageKey)}
/>
```

---

### MessageStream

消息流组件，展示任务相关的对话记录。

#### 属性接口

```typescript
interface MessageStreamProps {
  /** 消息列表 */
  messages: Message[]
  
  /** 是否自动滚动到底部 */
  autoScroll?: boolean
  
  /** 是否显示加载状态 */
  loading?: boolean
  
  /** 最大显示数量 */
  maxItems?: number
  
  /** 额外CSS类名 */
  className?: string
  
  /** 用户头像映射函数 */
  getUserAvatar?: (sender: MessageSender, agentId?: AgentId) => string
  
  /** 用户名称映射函数 */
  getUserName?: (sender: MessageSender, agentId?: AgentId) => string
}
```

#### 使用示例

```tsx
<MessageStream
  messages={task.messages}
  autoScroll={true}
  loading={false}
  maxItems={50}
  getUserAvatar={(sender, agentId) => {
    // 返回头像URL或组件
    return agentId ? `/avatars/${agentId}.png` : '/avatars/user.png'
  }}
  getUserName={(sender, agentId) => {
    return agentId ? agentNameMap[agentId] : '用户'
  }}
/>
```

---

### ArtifactPanel

制品面板组件，展示任务生成的文件制品。

#### 属性接口

```typescript
interface ArtifactPanelProps {
  /** 制品列表 */
  artifacts: Artifact[]
  
  /** 标题 */
  title?: string
  
  /** 是否显示加载状态 */
  loading?: boolean
  
  /** 是否可以下载 */
  downloadable?: boolean
  
  /** 下载处理函数 */
  onDownload?: (artifact: Artifact) => void
  
  /** 额外CSS类名 */
  className?: string
  
  /** 空状态提示文本 */
  emptyText?: string
}
```

#### 使用示例

```tsx
<ArtifactPanel
  artifacts={task.artifacts}
  title="相关制品"
  loading={false}
  downloadable={true}
  onDownload={(artifact) => {
    console.log('下载制品:', artifact.name)
    // 实现下载逻辑
  }}
  emptyText="暂无制品"
/>
```

---

## 🎨 布局组件

### Shell

主布局外壳组件，提供整体的页面框架。

#### 属性接口

```typescript
interface ShellProps {
  /** 子元素 */
  children: React.ReactNode
  
  /** 是否显示侧边栏 */
  showSidebar?: boolean
  
  /** 是否显示顶部栏 */
  showTopBar?: boolean
  
  /** 页面标题 */
  title?: string
  
  /** 额外CSS类名 */
  className?: string
}
```

#### 使用示例

```tsx
<Shell
  showSidebar={true}
  showTopBar={true}
  title="AgentTeam Dashboard"
>
  <Outlet /> {/* 路由出口 */}
</Shell>
```

---

### Sidebar

侧边导航栏组件。

#### 属性接口

```typescript
interface SidebarProps {
  /** 是否折叠 */
  collapsed?: boolean
  
  /** 导航项列表 */
  navItems?: NavItem[]
  
  /** 折叠状态变更回调 */
  onCollapsedChange?: (collapsed: boolean) => void
  
  /** 额外CSS类名 */
  className?: string
}

interface NavItem {
  /** 导航项ID */
  id: string
  
  /** 导航项标签 */
  label: string
  
  /** 图标组件 */
  icon?: React.ReactNode
  
  /** 路由路径 */
  path?: string
  
  /** 点击事件 */
  onClick?: () => void
  
  /** 是否禁用 */
  disabled?: boolean
}
```

#### 使用示例

```tsx
<Sidebar
  collapsed={isSidebarCollapsed}
  navItems={[
    { id: 'overview', label: '概览', icon: <LayoutDashboardIcon />, path: '/' },
    { id: 'tasks', label: '任务', icon: <TasksIcon />, path: '/tasks' },
    { id: 'agents', label: '智能体', icon: <BotsIcon />, path: '/agents' },
    { id: 'metrics', label: '指标', icon: <ChartIcon />, path: '/metrics' }
  ]}
  onCollapsedChange={(collapsed) => setSidebarCollapsed(collapsed)}
/>
```

---

## 📐 UI组件

### Card

通用卡片组件。

#### 属性接口

```typescript
interface CardProps {
  /** 卡片标题 */
  title?: string
  
  /** 卡片副标题 */
  subtitle?: string
  
  /** 卡片内容 */
  children: React.ReactNode
  
  /** 卡片头部操作 */
  headerAction?: React.ReactNode
  
  /** 是否显示加载状态 */
  loading?: boolean
  
  /** 是否可折叠 */
  collapsible?: boolean
  
  /** 是否处于折叠状态 */
  collapsed?: boolean
  
  /** 折叠状态变更回调 */
  onCollapsedChange?: (collapsed: boolean) => void
  
  /** 额外CSS类名 */
  className?: string
  
  /** 头部额外CSS类名 */
  headerClassName?: string
  
  /** 内容额外CSS类名 */
  contentClassName?: string
}
```

#### 使用示例

```tsx
<Card
  title="任务详情"
  subtitle="查看任务的完整信息"
  headerAction={
    <Button variant="outline" size="sm">
      编辑
    </Button>
  }
  loading={false}
  collapsible={true}
  collapsed={isCardCollapsed}
  onCollapsedChange={(collapsed) => setCardCollapsed(collapsed)}
>
  <TaskDetail task={task} />
</Card>
```

---

### Badge

标签组件，用于状态标记。

#### 属性接口

```typescript
interface BadgeProps {
  /** 标签文本 */
  children: React.ReactNode
  
  /** 颜色变体 */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  
  /** 大小 */
  size?: 'sm' | 'md' | 'lg'
  
  /** 是否显示圆点 */
  dot?: boolean
  
  /** 额外CSS类名 */
  className?: string
}
```

#### 使用示例

```tsx
<Badge variant="success" size="md" dot={true}>
  已完成
</Badge>

<Badge variant="warning" size="sm">
  进行中
</Badge>

<Badge variant="error" size="lg">
  阻塞
</Badge>
```

---

### Avatar

头像组件。

#### 属性接口

```typescript
interface AvatarProps {
  /** 头像URL */
  src?: string
  
  /** 头像替代文本 */
  alt?: string
  
  /** 头像文本（当src不存在时显示） */
  text?: string
  
  /** 大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  
  /** 形状 */
  shape?: 'circle' | 'square'
  
  /** 是否显示在线状态指示器 */
  online?: boolean
  
  /** 是否显示离线状态指示器 */
  offline?: boolean
  
  /** 状态指示器位置 */
  statusPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  
  /** 额外CSS类名 */
  className?: string
}
```

#### 使用示例

```tsx
<Avatar 
  src="/avatars/user-001.png" 
  alt="张三"
  size="md"
  online={true}
  statusPosition="bottom-right"
/>

<Avatar 
  text="MA"
  size="lg"
  shape="circle"
  offline={true}
/>
```

---

## 🎛️ 组件通用属性

### 数据属性

所有组件都支持以下数据属性：

```typescript
interface DataProps {
  /** 测试ID */
  'data-testid'?: string
  
  /** 组件名称 */
  'data-component'?: string
  
  /** 自定义数据属性 */
  [key: `data-${string}`]: string | undefined
}
```

### 事件处理器

建议的事件处理器签名：

```typescript
interface EventHandlers {
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  
  /** 双击事件 */
  onDoubleClick?: (event: React.MouseEvent<HTMLElement>) => void
  
  /** 鼠标进入事件 */
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
  
  /** 鼠标离开事件 */
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void
  
  /** 键盘事件 */
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
  
  /** 焦点事件 */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void
  
  /** 失焦事件 */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void
}
```

---

## 📊 组件状态管理

### Store集成

所有组件都可以通过Zustand store获取状态：

```typescript
// 智能体状态
const { agents, activities, metrics } = useAgentStore()

// 任务状态
const { tasks, selectedTaskId } = useTaskStore()

// 主题状态
const { theme, toggleTheme } = useThemeStore()
```

### 选择器优化

建议使用选择器优化性能：

```typescript
// ✅ 推荐：使用选择器
const runningAgents = useAgentStore(state => 
  state.agents.filter(agent => agent.status === 'running')
)

// ❌ 不推荐：直接访问
const agents = useAgentStore(state => state.agents)
const runningAgents = agents.filter(agent => agent.status === 'running')
```

---

## 🎨 主题系统

### 主题切换

```typescript
import { useThemeStore } from '@/stores/themeStore'

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
```

### 主题变量

```css
/* 在Tailwind配置中使用CSS变量 */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 84.2% 56.3%;
    --primary-foreground: 210 40% 98%;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
  }
}
```

---

## 📱 响应式设计

### 断点系统

```typescript
// Tailwind默认断点
const breakpoints = {
  sm: '640px',   // 小屏幕
  md: '768px',   // 中等屏幕
  lg: '1024px',  // 大屏幕
  xl: '1280px',  // 超大屏幕
  '2xl': '1536px' // 2倍超大屏幕
}
```

### 响应式类名

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 在小屏幕显示1列，中等屏幕2列，大屏幕3列 */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* 响应式字体大小 */}
</div>

<div className="hidden md:block">
  {/* 在中等以上屏幕显示 */}
</div>
```

---

## ♿ 可访问性

### ARIA属性

```tsx
<button
  aria-label="关闭"
  aria-describedby="close-button-description"
>
  ×
</button>
<p id="close-button-description" className="sr-only">
  点击关闭当前弹窗
</p>
```

### 键盘导航

```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  可键盘操作的元素
</div>
```

---

## 🔍 组件调试

### React DevTools

```typescript
// 在组件中添加displayName
const MyComponent: React.FC<MyComponentProps> = (props) => {
  // 组件实现
}

MyComponent.displayName = 'MyComponent'
```

### 性能分析

```typescript
import { Profiler } from 'react'

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`组件 ${id} ${phase} 耗时: ${actualDuration}ms`)
}

<Profiler id="TaskList" onRender={onRenderCallback}>
  <TaskList tasks={tasks} />
</Profiler>
```

---

## 🧪 组件测试

### 单元测试示例

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentCard } from './AgentCard'

test('renders agent card with correct information', () => {
  render(
    <AgentCard
      id="main"
      name="主智能体"
      status="running"
      todayCompleted={5}
      todayProcessedMin={120}
      lastActiveAt="2026-03-22T14:30:00Z"
    />
  )
  
  expect(screen.getByText('主智能体')).toBeInTheDocument()
  expect(screen.getByText('运行中')).toBeInTheDocument()
  expect(screen.getByText('5个')).toBeInTheDocument()
})

test('calls onClick when agent card is clicked', () => {
  const handleClick = jest.fn()
  
  render(
    <AgentCard
      id="main"
      name="主智能体"
      status="running"
      todayCompleted={0}
      todayProcessedMin={0}
      lastActiveAt="2026-03-22T14:30:00Z"
      onClick={handleClick}
    />
  )
  
  fireEvent.click(screen.getByText('主智能体'))
  expect(handleClick).toHaveBeenCalledWith('main')
})
```

---

## 📦 组件导出规范

### 命名导出

```typescript
// ✅ 推荐
export const AgentCard = ({ ...props }: AgentCardProps) => { ... }

// ❌ 不推荐
export default AgentCard
```

### Barrel导出

```typescript
// components/index.ts
export { AgentCard } from './agents/AgentCard'
export { DoraMetrics } from './agents/DoraMetrics'
export { ActivityFeed } from './agents/ActivityFeed'
export { TaskRow } from './tasks/TaskRow'
export { StageProgress } from './tasks/StageProgress'
export { MessageStream } from './tasks/MessageStream'
export { ArtifactPanel } from './tasks/ArtifactPanel'
export { Shell } from './layout/Shell'
export { Sidebar } from './layout/Sidebar'
export { TopBar } from './layout/TopBar'
export { Card } from './ui/Card'
export { Badge } from './ui/Badge'
export { Avatar } from './ui/Avatar'
```

---

## 🔄 组件版本控制

### 变更日志格式

```markdown
## [1.2.0] - 2026-03-22

### 新增
- 添加了`AgentCard`组件的`isSelected`属性
- 新增了`ArtifactPanel`组件

### 变更
- 修复了`StageProgress`组件的垂直布局问题
- 优化了`ActivityFeed`的性能

### 废弃
- 废弃了`TaskRow`的`oldProp`属性（将在2.0版本中移除）
```

---

这份组件API文档为开发者提供了完整的组件使用指南，包括属性接口、使用示例、最佳实践和测试方法。所有组件都遵循统一的规范和约定，确保代码的一致性和可维护性。
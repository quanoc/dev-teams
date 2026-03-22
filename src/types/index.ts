// ─── Enums ────────────────────────────────────────────────────────────────

export type TaskSize = 'small' | 'medium' | 'large'
export type TaskType = 'bug' | 'feature' | 'requirement' | 'tech-debt' | 'refactor'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export type StageKey =
  | 'requirement'
  | 'design'
  | 'development'
  | 'review'
  | 'testing'
  | 'deployment'

export type StageStatus = 'skipped' | 'pending' | 'active' | 'done' | 'blocked'

export type AgentId =
  | 'main'
  | 'requirement'
  | 'architecture'
  | 'code'
  | 'review'
  | 'test'
  | 'deploy'

export type AgentStatus = 'running' | 'idle' | 'waiting' | 'error' | 'analyzing' | 'reviewing'

export type TaskStatus = 'active' | 'waiting' | 'blocked' | 'done' | 'pending'

// ─── Stage ────────────────────────────────────────────────────────────────

export interface Stage {
  key: StageKey
  label: string
  status: StageStatus
  agentId: AgentId
  startedAt?: string   // ISO
  completedAt?: string
  blockedReason?: string
  artifacts?: Artifact[]
}

// ─── Task ─────────────────────────────────────────────────────────────────

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  size: TaskSize
  priority: TaskPriority
  status: TaskStatus
  currentStage: StageKey
  stages: Stage[]
  assignee: Member
  createdAt: string
  updatedAt: string
  durationEstimateMin: number  // minutes
  durationElapsedMin: number
  blockedReason?: string
  tags: string[]
  messages: Message[]
  artifacts: Artifact[]
}

// ─── Agent ────────────────────────────────────────────────────────────────

export interface Agent {
  id: AgentId
  name: string
  participatesIn: StageKey[]
  status: AgentStatus
  currentTaskId?: string
  currentTaskTitle?: string
  todayCompleted: number
  todayProcessedMin: number
  lastActiveAt: string
}

// ─── Message ──────────────────────────────────────────────────────────────

export type MessageSender = 'agent' | 'human'

export interface Message {
  id: string
  taskId: string
  sender: MessageSender
  senderName: string
  agentId?: AgentId
  content: string
  createdAt: string
  stage?: StageKey
}

// ─── Artifact ─────────────────────────────────────────────────────────────

export type ArtifactType = 'document' | 'code' | 'report' | 'config' | 'image'

export interface Artifact {
  id: string
  name: string
  type: ArtifactType
  stage: StageKey
  createdAt: string
  size?: string
  url?: string
}

// ─── Member ───────────────────────────────────────────────────────────────

export interface Member {
  id: string
  name: string
  avatar?: string
  initials: string
  color: string  // tailwind bg color class
}

// ─── Activity ─────────────────────────────────────────────────────────────

export type ActivityType = 'stage_complete' | 'stage_start' | 'human_action' | 'alert' | 'artifact' | 'comment'

export interface Activity {
  id: string
  type: ActivityType
  taskId: string
  taskTitle: string
  agentId?: AgentId
  actorName: string
  content: string
  createdAt: string
}

// ─── Metrics ──────────────────────────────────────────────────────────────

export interface DoraMetrics {
  deployFrequency: string
  leadTimeForChanges: string
  changeFailureRate: string
  mttr: string
  deployFrequencyTrend: 'up' | 'down' | 'stable'
  leadTimeTrend: 'up' | 'down' | 'stable'
  failureRateTrend: 'up' | 'down' | 'stable'
  mttrTrend: 'up' | 'down' | 'stable'
}

// ─── Store Shapes ─────────────────────────────────────────────────────────

export interface TaskStore {
  tasks: Task[]
  selectedTaskId: string | null
  activeTab: 'all' | 'waiting' | 'active' | 'done' | 'blocked'
  setActiveTab: (tab: TaskStore['activeTab']) => void
  selectTask: (id: string | null) => void
  filteredTasks: () => Task[]
}

export interface AgentStore {
  agents: Agent[]
  activities: Activity[]
  metrics: DoraMetrics
}

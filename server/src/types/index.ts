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

export interface Task {
  id: string
  title: string
  type: 'feature' | 'bugfix' | 'refactor' | 'docs' | 'test'
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  agentId: AgentId
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Log {
  id: string
  timestamp: string
  agentId: AgentId
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  taskId?: string
  taskTitle?: string
  metadata?: Record<string, unknown>
}

export interface AgentSkill {
  id: string
  agentId: AgentId
  name: string
  version: string
  description?: string
  enabled: boolean
  installedAt: string
}

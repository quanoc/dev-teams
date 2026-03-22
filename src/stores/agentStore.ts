import { create } from 'zustand'
import type { Agent, Activity, DoraMetrics, AgentId } from '@/types'
import { MOCK_AGENTS, MOCK_ACTIVITIES, MOCK_METRICS, MOCK_AGENT_LOGS, MOCK_AGENT_SKILLS, MOCK_AGENT_RECENT_TASKS } from '@/lib/mock'

interface AgentStore {
  agents: Agent[]
  activities: Activity[]
  metrics: DoraMetrics
  selectedAgentId: AgentId | null
  selectAgent: (id: AgentId | null) => void
  getAgentLogs: (id: AgentId) => typeof MOCK_AGENT_LOGS
  getAgentSkills: (id: AgentId) => typeof MOCK_AGENT_SKILLS[AgentId]
  getAgentRecentTasks: (id: AgentId) => typeof MOCK_AGENT_RECENT_TASKS[AgentId]
  tickAgent: (id: string) => void
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: MOCK_AGENTS,
  activities: MOCK_ACTIVITIES,
  metrics: MOCK_METRICS,
  selectedAgentId: null,
  selectAgent: (id) => set({ selectedAgentId: id }),
  getAgentLogs: (id) => MOCK_AGENT_LOGS.filter(log => log.agentId === id),
  getAgentSkills: (id) => MOCK_AGENT_SKILLS[id] || [],
  getAgentRecentTasks: (id) => MOCK_AGENT_RECENT_TASKS[id] || [],
  tickAgent: (id) => set((s) => ({
    agents: s.agents.map((a) =>
      a.id === id ? { ...a, lastActiveAt: new Date().toISOString() } : a
    ),
  })),
}))

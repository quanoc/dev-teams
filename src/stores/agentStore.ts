import { create } from 'zustand'
import type { Agent, Activity, DoraMetrics } from '@/types'
import { MOCK_AGENTS, MOCK_ACTIVITIES, MOCK_METRICS } from '@/lib/mock'

interface AgentStore {
  agents: Agent[]
  activities: Activity[]
  metrics: DoraMetrics
  // Simulated real-time update
  tickAgent: (id: string) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: MOCK_AGENTS,
  activities: MOCK_ACTIVITIES,
  metrics: MOCK_METRICS,
  tickAgent: (id) => set((s) => ({
    agents: s.agents.map((a) =>
      a.id === id ? { ...a, lastActiveAt: new Date().toISOString() } : a
    ),
  })),
}))

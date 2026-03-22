import { create } from 'zustand'
import type { Task, StageKey, Message } from '@/types'
import { MOCK_TASKS } from '@/lib/mock'

type TabKey = 'all' | 'waiting' | 'active' | 'done' | 'blocked'

interface TaskStore {
  tasks: Task[]
  selectedTaskId: string | null
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
  selectTask: (id: string | null) => void
  selectedTask: () => Task | undefined
  filteredTasks: () => Task[]
  tabCount: (tab: TabKey) => number
  // Actions
  approveReview: (taskId: string) => void
  rejectReview: (taskId: string) => void
  sendMessage: (taskId: string, content: string, senderName: string) => void
  advanceStage: (taskId: string) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: MOCK_TASKS,
  selectedTaskId: null,
  activeTab: 'all',

  setActiveTab: (tab) => set({ activeTab: tab }),
  selectTask: (id) => set({ selectedTaskId: id }),

  selectedTask: () => {
    const { tasks, selectedTaskId } = get()
    return tasks.find((t) => t.id === selectedTaskId)
  },

  filteredTasks: () => {
    const { tasks, activeTab } = get()
    if (activeTab === 'all') return tasks
    if (activeTab === 'waiting') return tasks.filter((t) => t.status === 'waiting')
    if (activeTab === 'active') return tasks.filter((t) => t.status === 'active')
    if (activeTab === 'done') return tasks.filter((t) => t.status === 'done')
    if (activeTab === 'blocked') return tasks.filter((t) => t.status === 'blocked')
    return tasks
  },

  tabCount: (tab) => {
    const { tasks } = get()
    if (tab === 'all') return tasks.length
    return tasks.filter((t) => t.status === tab).length
  },

  approveReview: (taskId) => set((s) => ({
    tasks: s.tasks.map((t) => {
      if (t.id !== taskId) return t
      const stages = t.stages.map((st) => {
        if (st.key === 'review') return { ...st, status: 'done' as const, completedAt: new Date().toISOString() }
        if (st.key === 'testing') return { ...st, status: 'active' as const, startedAt: new Date().toISOString() }
        return st
      })
      return { ...t, status: 'active' as const, currentStage: 'testing' as StageKey, stages, updatedAt: new Date().toISOString() }
    }),
  })),

  rejectReview: (taskId) => set((s) => ({
    tasks: s.tasks.map((t) => {
      if (t.id !== taskId) return t
      const stages = t.stages.map((st) => {
        if (st.key === 'development') return { ...st, status: 'active' as const }
        if (st.key === 'review') return { ...st, status: 'pending' as const }
        return st
      })
      return { ...t, currentStage: 'development' as StageKey, stages, updatedAt: new Date().toISOString() }
    }),
  })),

  sendMessage: (taskId, content, senderName) => set((s) => ({
    tasks: s.tasks.map((t) => {
      if (t.id !== taskId) return t
      const msg: Message = {
        id: `msg-${Date.now()}`,
        taskId,
        sender: 'human',
        senderName,
        content,
        createdAt: new Date().toISOString(),
        stage: t.currentStage,
      }
      return { ...t, messages: [...t.messages, msg] }
    }),
  })),

  advanceStage: (taskId) => set((s) => ({
    tasks: s.tasks.map((t) => {
      if (t.id !== taskId) return t
      const order: StageKey[] = ['requirement','design','development','review','testing','deployment']
      const curIdx = order.indexOf(t.currentStage)
      const nextKey = order[curIdx + 1]
      if (!nextKey) return { ...t, status: 'done' as const }
      // find next non-skipped
      const nextStage = t.stages.find((st) => st.key === nextKey && st.status !== 'skipped')
      if (!nextStage) return t
      const stages = t.stages.map((st) => {
        if (st.key === t.currentStage) return { ...st, status: 'done' as const, completedAt: new Date().toISOString() }
        if (st.key === nextKey) return { ...st, status: 'active' as const, startedAt: new Date().toISOString() }
        return st
      })
      return { ...t, currentStage: nextKey, stages, updatedAt: new Date().toISOString() }
    }),
  })),
}))

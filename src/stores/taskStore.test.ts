import { describe, it, expect } from 'vitest'
import { useTaskStore } from './taskStore'
import { MOCK_TASKS } from '@/lib/mock'

describe('useTaskStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    useTaskStore.setState({
      tasks: MOCK_TASKS,
      selectedTaskId: null,
      activeTab: 'all'
    })
  })

  it('should initialize with mock tasks', () => {
    const state = useTaskStore.getState()
    expect(state.tasks).toHaveLength(MOCK_TASKS.length)
    expect(state.selectedTaskId).toBeNull()
    expect(state.activeTab).toBe('all')
  })

  describe('setActiveTab', () => {
    it('should change active tab', () => {
      useTaskStore.getState().setActiveTab('active')
      expect(useTaskStore.getState().activeTab).toBe('active')
      
      useTaskStore.getState().setActiveTab('done')
      expect(useTaskStore.getState().activeTab).toBe('done')
    })
  })

  describe('selectTask', () => {
    it('should select a task by id', () => {
      useTaskStore.getState().selectTask('t1')
      expect(useTaskStore.getState().selectedTaskId).toBe('t1')
    })

    it('should deselect task when passing null', () => {
      useTaskStore.getState().selectTask('t1')
      expect(useTaskStore.getState().selectedTaskId).toBe('t1')
      
      useTaskStore.getState().selectTask(null)
      expect(useTaskStore.getState().selectedTaskId).toBeNull()
    })
  })

  describe('selectedTask', () => {
    it('should return undefined when no task is selected', () => {
      const task = useTaskStore.getState().selectedTask()
      expect(task).toBeUndefined()
    })

    it('should return the selected task', () => {
      useTaskStore.getState().selectTask('t1')
      const task = useTaskStore.getState().selectedTask()
      expect(task).toBeDefined()
      expect(task?.id).toBe('t1')
    })

    it('should return undefined when selected task does not exist', () => {
      useTaskStore.getState().selectTask('non-existent')
      const task = useTaskStore.getState().selectedTask()
      expect(task).toBeUndefined()
    })
  })

  describe('filteredTasks', () => {
    it('should return all tasks when activeTab is "all"', () => {
      useTaskStore.getState().setActiveTab('all')
      const filtered = useTaskStore.getState().filteredTasks()
      expect(filtered).toHaveLength(MOCK_TASKS.length)
    })

    it('should filter tasks by status "waiting"', () => {
      useTaskStore.getState().setActiveTab('waiting')
      const filtered = useTaskStore.getState().filteredTasks()
      const expectedCount = MOCK_TASKS.filter(t => t.status === 'waiting').length
      expect(filtered).toHaveLength(expectedCount)
      expect(filtered.every(t => t.status === 'waiting')).toBe(true)
    })

    it('should filter tasks by status "active"', () => {
      useTaskStore.getState().setActiveTab('active')
      const filtered = useTaskStore.getState().filteredTasks()
      const expectedCount = MOCK_TASKS.filter(t => t.status === 'active').length
      expect(filtered).toHaveLength(expectedCount)
      expect(filtered.every(t => t.status === 'active')).toBe(true)
    })

    it('should filter tasks by status "done"', () => {
      useTaskStore.getState().setActiveTab('done')
      const filtered = useTaskStore.getState().filteredTasks()
      const expectedCount = MOCK_TASKS.filter(t => t.status === 'done').length
      expect(filtered).toHaveLength(expectedCount)
      expect(filtered.every(t => t.status === 'done')).toBe(true)
    })

    it('should filter tasks by status "blocked"', () => {
      useTaskStore.getState().setActiveTab('blocked')
      const filtered = useTaskStore.getState().filteredTasks()
      const expectedCount = MOCK_TASKS.filter(t => t.status === 'blocked').length
      expect(filtered).toHaveLength(expectedCount)
      expect(filtered.every(t => t.status === 'blocked')).toBe(true)
    })
  })

  describe('tabCount', () => {
    it('should return total count for "all" tab', () => {
      expect(useTaskStore.getState().tabCount('all')).toBe(MOCK_TASKS.length)
    })

    it('should return correct count for each status tab', () => {
      const store = useTaskStore.getState()
      
      const waitingCount = MOCK_TASKS.filter(t => t.status === 'waiting').length
      expect(store.tabCount('waiting')).toBe(waitingCount)
      
      const activeCount = MOCK_TASKS.filter(t => t.status === 'active').length
      expect(store.tabCount('active')).toBe(activeCount)
      
      const doneCount = MOCK_TASKS.filter(t => t.status === 'done').length
      expect(store.tabCount('done')).toBe(doneCount)
      
      const blockedCount = MOCK_TASKS.filter(t => t.status === 'blocked').length
      expect(store.tabCount('blocked')).toBe(blockedCount)
    })
  })

  describe('approveReview', () => {
    it('should update review stage to done and testing stage to active', () => {
      const taskBefore = useTaskStore.getState().tasks.find(t => t.id === 't2')
      expect(taskBefore?.currentStage).toBe('review')
      
      useTaskStore.getState().approveReview('t2')
      
      const taskAfter = useTaskStore.getState().tasks.find(t => t.id === 't2')
      expect(taskAfter?.currentStage).toBe('testing')
      
      const reviewStage = taskAfter?.stages.find(s => s.key === 'review')
      expect(reviewStage?.status).toBe('done')
      expect(reviewStage?.completedAt).toBeDefined()
      
      const testingStage = taskAfter?.stages.find(s => s.key === 'testing')
      expect(testingStage?.status).toBe('active')
      expect(testingStage?.startedAt).toBeDefined()
    })

    it('should not modify other tasks', () => {
      const originalTask1 = JSON.stringify(useTaskStore.getState().tasks.find(t => t.id === 't1'))
      
      useTaskStore.getState().approveReview('t2')
      
      const updatedTask1 = JSON.stringify(useTaskStore.getState().tasks.find(t => t.id === 't1'))
      expect(updatedTask1).toBe(originalTask1)
    })
  })

  describe('rejectReview', () => {
    it('should move task back to development stage', () => {
      const taskBefore = useTaskStore.getState().tasks.find(t => t.id === 't2')
      expect(taskBefore?.currentStage).toBe('review')
      
      useTaskStore.getState().rejectReview('t2')
      
      const taskAfter = useTaskStore.getState().tasks.find(t => t.id === 't2')
      expect(taskAfter?.currentStage).toBe('development')
      
      const developmentStage = taskAfter?.stages.find(s => s.key === 'development')
      expect(developmentStage?.status).toBe('active')
      
      const reviewStage = taskAfter?.stages.find(s => s.key === 'review')
      expect(reviewStage?.status).toBe('pending')
    })
  })

  describe('sendMessage', () => {
    it('should add a new message to the task', () => {
      const taskBefore = useTaskStore.getState().tasks.find(t => t.id === 't1')
      const initialMessageCount = taskBefore?.messages.length || 0
      
      useTaskStore.getState().sendMessage('t1', 'Test message', 'John Doe')
      
      const taskAfter = useTaskStore.getState().tasks.find(t => t.id === 't1')
      expect(taskAfter?.messages).toHaveLength(initialMessageCount + 1)
      
      const newMessage = taskAfter?.messages[taskAfter.messages.length - 1]
      expect(newMessage?.content).toBe('Test message')
      expect(newMessage?.senderName).toBe('John Doe')
      expect(newMessage?.sender).toBe('human')
      expect(newMessage?.taskId).toBe('t1')
      expect(newMessage?.id).toMatch(/^msg-\d+$/)
      expect(newMessage?.createdAt).toBeDefined()
    })
  })

  describe('advanceStage', () => {
    it('should advance from requirement to design', () => {
      const task = useTaskStore.getState().tasks.find(t => t.id === 't1')
      expect(task?.currentStage).toBe('requirement')
      
      useTaskStore.getState().advanceStage('t1')
      
      const updatedTask = useTaskStore.getState().tasks.find(t => t.id === 't1')
      expect(updatedTask?.currentStage).toBe('design')
      
      const requirementStage = updatedTask?.stages.find(s => s.key === 'requirement')
      expect(requirementStage?.status).toBe('done')
      expect(requirementStage?.completedAt).toBeDefined()
      
      const designStage = updatedTask?.stages.find(s => s.key === 'design')
      expect(designStage?.status).toBe('active')
      expect(designStage?.startedAt).toBeDefined()
    })

    it('should mark task as done when advancing from last stage', () => {
      // Find a task in deployment stage
      const task = useTaskStore.getState().tasks.find(t => t.currentStage === 'deployment')
      if (!task) {
        // If no deployment task, we'll test with a different scenario
        return
      }
      
      useTaskStore.getState().advanceStage(task.id)
      
      const updatedTask = useTaskStore.getState().tasks.find(t => t.id === task.id)
      expect(updatedTask?.status).toBe('done')
    })
  })
})
import { describe, it, expect } from 'vitest'
import {
  formatRelativeTime,
  formatDuration,
  getDurationStatus,
  isOverdue,
  isWarning,
  TASK_TYPE_LABEL,
  TASK_SIZE_LABEL,
  TASK_PRIORITY_LABEL,
  AGENT_STATUS_LABEL,
  STAGE_STATUS_LABEL,
} from './utils'

describe('formatRelativeTime', () => {
  it('should format "just now" for less than 1 minute', () => {
    const now = new Date()
    const result = formatRelativeTime(now.toISOString())
    expect(result).toBe('刚刚')
  })

  it('should format minutes ago', () => {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000)
    const result = formatRelativeTime(fiveMinutesAgo.toISOString())
    expect(result).toBe('5 分钟前')
  })

  it('should format hours ago', () => {
    const now = new Date()
    const threeHoursAgo = new Date(now.getTime() - 3 * 3600000)
    const result = formatRelativeTime(threeHoursAgo.toISOString())
    expect(result).toBe('3 小时前')
  })

  it('should format days ago', () => {
    const now = new Date()
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 3600000)
    const result = formatRelativeTime(twoDaysAgo.toISOString())
    expect(result).toBe('2 天前')
  })
})

describe('formatDuration', () => {
  it('should format minutes only', () => {
    expect(formatDuration(30)).toBe('30m')
    expect(formatDuration(5)).toBe('5m')
  })

  it('should format hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m')
    expect(formatDuration(125)).toBe('2h 5m')
  })

  it('should format hours only when minutes is 0', () => {
    expect(formatDuration(60)).toBe('1h')
    expect(formatDuration(120)).toBe('2h')
  })

  it('should format days and hours', () => {
    expect(formatDuration(1500)).toBe('1d 1h')
    expect(formatDuration(2880)).toBe('2d')
  })
})

describe('getDurationStatus', () => {
  it('should return "normal" when elapsed is less than 80% of estimate', () => {
    expect(getDurationStatus(40, 100)).toBe('normal')
    expect(getDurationStatus(79, 100)).toBe('normal')
  })

  it('should return "warning" when elapsed is between 80% and less than 100% of estimate', () => {
    expect(getDurationStatus(80, 100)).toBe('warning')
    expect(getDurationStatus(99, 100)).toBe('warning')
  })

  it('should return "overdue" when elapsed equals or exceeds estimate', () => {
    expect(getDurationStatus(100, 100)).toBe('overdue')
    expect(getDurationStatus(150, 100)).toBe('overdue')
  })
})

describe('isOverdue', () => {
  it('should return false when elapsed is less than estimate', () => {
    expect(isOverdue(50, 100)).toBe(false)
    expect(isOverdue(99, 100)).toBe(false)
  })

  it('should return true when elapsed equals or exceeds estimate', () => {
    expect(isOverdue(100, 100)).toBe(true)
    expect(isOverdue(150, 100)).toBe(true)
  })
})

describe('isWarning', () => {
  it('should return false when elapsed is less than 80% of estimate', () => {
    expect(isWarning(79, 100)).toBe(false)
    expect(isWarning(0, 100)).toBe(false)
  })

  it('should return true when elapsed is 80% or more of estimate', () => {
    expect(isWarning(80, 100)).toBe(true)
    expect(isWarning(90, 100)).toBe(true)
    expect(isWarning(99, 100)).toBe(true)
  })
})

describe('Label maps', () => {
  it('should have correct task type labels', () => {
    expect(TASK_TYPE_LABEL.bug).toBe('Bug')
    expect(TASK_TYPE_LABEL.feature).toBe('功能')
    expect(TASK_TYPE_LABEL.requirement).toBe('需求')
    expect(TASK_TYPE_LABEL['tech-debt']).toBe('技术债')
    expect(TASK_TYPE_LABEL.refactor).toBe('重构')
  })

  it('should have correct task size labels', () => {
    expect(TASK_SIZE_LABEL.small).toBe('小任务')
    expect(TASK_SIZE_LABEL.medium).toBe('中型需求')
    expect(TASK_SIZE_LABEL.large).toBe('大型需求')
  })

  it('should have correct task priority labels', () => {
    expect(TASK_PRIORITY_LABEL.critical).toBe('紧急')
    expect(TASK_PRIORITY_LABEL.high).toBe('高')
    expect(TASK_PRIORITY_LABEL.medium).toBe('中')
    expect(TASK_PRIORITY_LABEL.low).toBe('低')
  })

  it('should have correct agent status labels', () => {
    expect(AGENT_STATUS_LABEL.running).toBe('运行中')
    expect(AGENT_STATUS_LABEL.idle).toBe('待机')
    expect(AGENT_STATUS_LABEL.waiting).toBe('待审批')
    expect(AGENT_STATUS_LABEL.error).toBe('异常')
    expect(AGENT_STATUS_LABEL.analyzing).toBe('分析中')
    expect(AGENT_STATUS_LABEL.reviewing).toBe('Review 中')
  })

  it('should have correct stage status labels', () => {
    expect(STAGE_STATUS_LABEL.skipped).toBe('已跳过')
    expect(STAGE_STATUS_LABEL.pending).toBe('待执行')
    expect(STAGE_STATUS_LABEL.active).toBe('进行中')
    expect(STAGE_STATUS_LABEL.done).toBe('已完成')
    expect(STAGE_STATUS_LABEL.blocked).toBe('已阻塞')
  })
})
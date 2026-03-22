import type { AgentId } from '@/types'

export interface OpenClawLog {
  id: string
  timestamp: string
  agentId: AgentId
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  taskId?: string
  taskTitle?: string
  metadata?: Record<string, unknown>
}

export interface OpenClawAgent {
  id: AgentId
  name: string
  status: 'running' | 'idle' | 'waiting' | 'error'
  currentTask?: string
  lastActiveAt: string
}

export interface OpenClawConfig {
  baseUrl: string
  apiKey?: string
  pollingInterval: number
}

const DEFAULT_CONFIG: OpenClawConfig = {
  baseUrl: 'http://127.0.0.1:18789',
  pollingInterval: 2000,
}

export class OpenClawService {
  private config: OpenClawConfig
  private eventSource: EventSource | null = null
  private pollingInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<OpenClawConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async getAgentLogs(agentId: AgentId, limit: number = 50): Promise<OpenClawLog[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/agents/${agentId}/logs?limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformLogs(data.logs || [])
    } catch (error) {
      console.error('Failed to fetch agent logs:', error)
      return this.getMockLogs(agentId)
    }
  }

  async getRecentLogs(limit: number = 100): Promise<OpenClawLog[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/logs/recent?limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch recent logs: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformLogs(data.logs || [])
    } catch (error) {
      console.error('Failed to fetch recent logs:', error)
      return []
    }
  }

  subscribeToLogs(callback: (log: OpenClawLog) => void): () => void {
    if (typeof EventSource !== 'undefined') {
      return this.subscribeViaSSE(callback)
    } else {
      return this.subscribeViaPolling(callback)
    }
  }

  private subscribeViaSSE(callback: (log: OpenClawLog) => void): () => void {
    const url = `${this.config.baseUrl}/api/logs/stream`
    
    this.eventSource = new EventSource(url, {
      withCredentials: !!this.config.apiKey,
    })

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const log = this.transformLog(data)
        callback(log)
      } catch (error) {
        console.error('Failed to parse SSE log:', error)
      }
    }

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      this.eventSource?.close()
    }

    return () => {
      this.eventSource?.close()
      this.eventSource = null
    }
  }

  private subscribeViaPolling(callback: (log: OpenClawLog) => void): () => void {
    let lastTimestamp = new Date().toISOString()

    this.pollingInterval = setInterval(async () => {
      try {
        const logs = await this.getRecentLogs(10)
        const newLogs = logs.filter(log => log.timestamp > lastTimestamp)
        
        newLogs.forEach(log => callback(log))
        
        if (newLogs.length > 0) {
          lastTimestamp = newLogs[newLogs.length - 1].timestamp
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, this.config.pollingInterval)

    return () => {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    }
  }

  async getAgentStatus(agentId: AgentId): Promise<OpenClawAgent | null> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/agents/${agentId}/status`,
        {
          headers: this.getHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch agent status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch agent status:', error)
        return null
    }
  }

  async getGatewayStatus(): Promise<{ gateway: string; agent: string } | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/status`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch gateway status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch gateway status:', error)
      return null
    }
  }

  async getAgents(): Promise<OpenClawAgent[] | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/agents`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch agents:', error)
      return null
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    return headers
  }

  private transformLogs(logs: any[]): OpenClawLog[] {
    return logs.map(log => this.transformLog(log))
  }

  private transformLog(log: any): OpenClawLog {
    return {
      id: log.id || `log-${Date.now()}-${Math.random()}`,
      timestamp: log.timestamp || log.created_at || new Date().toISOString(),
      agentId: log.agent_id || log.agentId || 'main',
      level: this.mapLogLevel(log.level || log.severity),
      message: log.message || log.content || '',
      taskId: log.task_id || log.taskId,
      taskTitle: log.task_title || log.taskTitle,
      metadata: log.metadata || log.extra,
    }
  }

  private mapLogLevel(level: string): OpenClawLog['level'] {
    const levelMap: Record<string, OpenClawLog['level']> = {
      'INFO': 'info',
      'WARNING': 'warning',
      'WARN': 'warning',
      'ERROR': 'error',
      'SUCCESS': 'success',
      'DEBUG': 'info',
    }

    return levelMap[level.toUpperCase()] || 'info'
  }

  private getMockLogs(agentId: AgentId): OpenClawLog[] {
    const now = Date.now()
    return [
      {
        id: `mock-${now}-1`,
        timestamp: new Date(now - 300000).toISOString(),
        agentId,
        level: 'info',
        message: `[Mock] OpenClaw 连接失败，使用模拟数据`,
      },
      {
        id: `mock-${now}-2`,
        timestamp: new Date(now - 240000).toISOString(),
        agentId,
        level: 'warning',
        message: `[Mock] 请确保 OpenClaw 服务正在运行 (http://127.0.0.1:18789)`,
      },
    ]
  }
}

export const openClawService = new OpenClawService()

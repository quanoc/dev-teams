import axios from 'axios'
import { config } from '../config/index.js'
import type { AgentId } from '../types/index.js'

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

export class OpenClawGatewayService {
  private baseUrl: string
  private apiKey?: string

  constructor() {
    this.baseUrl = config.openclaw.url
    this.apiKey = config.openclaw.apiKey || undefined
  }

  async getStatus(): Promise<{ gateway: string; agent: string } | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/status`, {
        headers: this.getHeaders(),
        timeout: 5000,
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch OpenClaw status:', error)
      return null
    }
  }

  async getAgents(): Promise<OpenClawAgent[] | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/agents`, {
        headers: this.getHeaders(),
        timeout: 5000,
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch OpenClaw agents:', error)
      return null
    }
  }

  async getAgentLogs(agentId: AgentId, limit: number = 50): Promise<OpenClawLog[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/agents/${agentId}/logs`,
        {
          params: { limit },
          headers: this.getHeaders(),
          timeout: 5000,
        }
      )
      return response.data.logs || []
    } catch (error) {
      console.error(`Failed to fetch logs for agent ${agentId}:`, error)
      return []
    }
  }

  async getRecentLogs(limit: number = 100): Promise<OpenClawLog[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/logs/recent`, {
        params: { limit },
        headers: this.getHeaders(),
        timeout: 5000,
      })
      return response.data.logs || []
    } catch (error) {
      console.error('Failed to fetch recent logs:', error)
      return []
    }
  }

  async getAgentStatus(agentId: AgentId): Promise<OpenClawAgent | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/agents/${agentId}/status`,
        {
          headers: this.getHeaders(),
          timeout: 5000,
        }
      )
      return response.data
    } catch (error) {
      console.error(`Failed to fetch status for agent ${agentId}:`, error)
      return null
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }
}

export const openClawGatewayService = new OpenClawGatewayService()

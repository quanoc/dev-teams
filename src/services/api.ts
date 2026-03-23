import { io, Socket } from 'socket.io-client'
import type { AgentId, OpenClawLog, Agent } from '@/types'

const API_BASE_URL = 'http://localhost:3000/api'

class ApiClient {
  private baseUrl: string
  private socket: Socket | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getAgents(): Promise<Agent[]> {
    const response = await fetch(`${this.baseUrl}/agents`)
    const data = await response.json()
    return data.success ? data.data : []
  }

  async getAgentById(id: AgentId): Promise<Agent | null> {
    const response = await fetch(`${this.baseUrl}/agents/${id}`)
    const data = await response.json()
    return data.success ? data.data : null
  }

  async getAgentLogs(
    id: AgentId,
    limit: number = 50,
    source: 'gateway' | 'file' = 'gateway'
  ): Promise<OpenClawLog[]> {
    const response = await fetch(
      `${this.baseUrl}/agents/${id}/logs?limit=${limit}&source=${source}`
    )
    const data = await response.json()
    return data.success ? data.data : []
  }

  async getRecentLogs(
    limit: number = 100,
    source: 'gateway' | 'file' = 'gateway'
  ): Promise<OpenClawLog[]> {
    const response = await fetch(
      `${this.baseUrl}/logs/recent?limit=${limit}&source=${source}`
    )
    const data = await response.json()
    return data.success ? data.data : []
  }

  async getOpenClawStatus(): Promise<{ gateway: string; agent: string }> {
    const response = await fetch(`${this.baseUrl}/agents/status`)
    const data = await response.json()
    return data.success ? data.data : { gateway: 'offline', agent: 'offline' }
  }

  connectWebSocket(): Socket {
    if (!this.socket) {
      const wsUrl = this.baseUrl.replace('/api', '')
      this.socket = io(wsUrl, {
        transports: ['websocket'],
      })

      this.socket.on('connect', () => {
        console.log('WebSocket connected:', this.socket?.id)
      })

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected')
      })
    }

    return this.socket
  }

  subscribeToAgentLogs(
    agentId: AgentId,
    callback: (log: OpenClawLog) => void
  ): () => void {
    const socket = this.connectWebSocket()

    socket.emit('subscribe:agent:logs', agentId)

    socket.on('log', callback)

    return () => {
      socket.emit('unsubscribe:agent:logs', agentId)
      socket.off('log', callback)
    }
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

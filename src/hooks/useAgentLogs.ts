import { useEffect, useState } from 'react'
import { apiClient } from '@/services/api'
import type { AgentId, OpenClawLog } from '@/types'

export function useAgentLogs(agentId: AgentId | null) {
  const [logs, setLogs] = useState<OpenClawLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!agentId) {
      setLogs([])
      return
    }

    let unsubscribe: (() => void) | null = null
    let isMounted = true

    const fetchInitialLogs = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const initialLogs = await apiClient.getAgentLogs(agentId, 50, 'file')
        if (isMounted) {
          setLogs(initialLogs.reverse())
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch logs')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const subscribeToLiveLogs = () => {
      unsubscribe = apiClient.subscribeToAgentLogs(agentId, (newLog) => {
        if (isMounted) {
          setLogs((prev) => [newLog, ...prev].slice(0, 100))
        }
      })
    }

    fetchInitialLogs()
    subscribeToLiveLogs()

    return () => {
      isMounted = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [agentId])

  const clearLogs = () => {
    setLogs([])
  }

  const refreshLogs = async () => {
    if (!agentId) return

    setIsLoading(true)
    setError(null)

    try {
      const freshLogs = await apiClient.getAgentLogs(agentId, 50, 'file')
      setLogs(freshLogs.reverse())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh logs')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    logs,
    isLoading,
    error,
    clearLogs,
    refreshLogs,
  }
}

export function useOpenClawStatus() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkStatus = async () => {
      try {
        const status = await apiClient.getOpenClawStatus()
        if (isMounted) {
          setIsConnected(status?.gateway === 'running')
        }
      } catch {
        if (isMounted) {
          setIsConnected(false)
        }
      }
    }

    checkStatus()

    const interval = setInterval(checkStatus, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { isConnected }
}

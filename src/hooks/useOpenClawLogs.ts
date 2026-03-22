import { useEffect, useState } from 'react'
import { openClawService } from '@/services/openclaw'
import type { OpenClawLog } from '@/types'
import type { AgentId } from '@/types'

export function useOpenClawLogs(agentId: AgentId | null) {
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
        const initialLogs = await openClawService.getAgentLogs(agentId, 50)
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
      unsubscribe = openClawService.subscribeToLogs((log: OpenClawLog) => {
        if (isMounted && log.agentId === agentId) {
          setLogs(prev => [log, ...prev].slice(0, 100))
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
      const freshLogs = await openClawService.getAgentLogs(agentId, 50)
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
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    let isMounted = true

    const checkStatus = async () => {
      try {
        const status = await openClawService.getGatewayStatus()
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

  return { isConnected, agents }
}

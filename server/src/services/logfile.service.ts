import fs from 'fs/promises'
import path from 'path'
import { config } from '../config/index.js'
import type { AgentId, Log } from '../types/index.js'

export class LogFileService {
  private logPath: string

  constructor() {
    this.logPath = config.openclaw.logPath
  }

  async readAgentLogs(agentId: AgentId, limit: number = 50): Promise<Log[]> {
    try {
      const logFile = path.join(this.logPath, 'agents', `${agentId}.log`)
      const exists = await this.fileExists(logFile)
      
      if (!exists) {
        console.log(`Log file not found: ${logFile}`)
        return []
      }

      const content = await fs.readFile(logFile, 'utf-8')
      const lines = content.trim().split('\n').filter(line => line.trim())
      
      const logs: Log[] = lines
        .slice(-limit)
        .map((line, index) => this.parseLogLine(line, agentId, index))
        .filter((log): log is Log => log !== null)
        .reverse()

      return logs
    } catch (error) {
      console.error(`Failed to read log file for agent ${agentId}:`, error)
      return []
    }
  }

  async readRecentLogs(limit: number = 100): Promise<Log[]> {
    try {
      const agentsPath = path.join(this.logPath, 'agents')
      const exists = await this.fileExists(agentsPath)
      
      if (!exists) {
        console.log(`Agents log directory not found: ${agentsPath}`)
        return []
      }

      const files = await fs.readdir(agentsPath)
      const logFiles = files.filter(f => f.endsWith('.log'))

      const allLogs: Log[] = []

      for (const file of logFiles) {
        const agentId = file.replace('.log', '') as AgentId
        const logs = await this.readAgentLogs(agentId, limit / logFiles.length)
        allLogs.push(...logs)
      }

      allLogs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      return allLogs.slice(0, limit)
    } catch (error) {
      console.error('Failed to read recent logs:', error)
      return []
    }
  }

  async watchAgentLogs(
    agentId: AgentId,
    callback: (log: Log) => void
  ): Promise<() => void> {
    const logFile = path.join(this.logPath, 'agents', `${agentId}.log`)
    
    try {
      const exists = await this.fileExists(logFile)
      if (!exists) {
        console.log(`Log file not found for watching: ${logFile}`)
        return () => {}
      }

      const { default: chokidar } = await import('chokidar')
      
      const watcher = chokidar.watch(logFile, {
        persistent: true,
        ignoreInitial: true,
      })

      let lastPosition = 0

      const stats = await fs.stat(logFile)
      lastPosition = stats.size

      watcher.on('change', async () => {
        try {
          const stats = await fs.stat(logFile)
          const newPosition = stats.size

          if (newPosition > lastPosition) {
            const stream = await fs.open(logFile, 'r')
            const buffer = Buffer.alloc(newPosition - lastPosition)
            await stream.read(buffer, 0, buffer.length, lastPosition)
            await stream.close()

            const newContent = buffer.toString('utf-8')
            const newLines = newContent.trim().split('\n').filter(line => line.trim())

            newLines.forEach((line, index) => {
              const log = this.parseLogLine(line, agentId, Date.now() + index)
              if (log) {
                callback(log)
              }
            })

            lastPosition = newPosition
          }
        } catch (error) {
          console.error('Error reading new log content:', error)
        }
      })

      return () => {
        watcher.close()
      }
    } catch (error) {
      console.error(`Failed to watch log file for agent ${agentId}:`, error)
      return () => {}
    }
  }

  private parseLogLine(line: string, agentId: AgentId, index: number): Log | null {
    try {
      const timestampMatch = line.match(/^\[?(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)\]?/)
      
      if (timestampMatch) {
        const timestamp = timestampMatch[1]
        const rest = line.substring(timestampMatch[0].length).trim()
        
        const levelMatch = rest.match(/^\[?(INFO|WARNING|ERROR|SUCCESS|DEBUG)\]?/i)
        const level = levelMatch ? levelMatch[1].toLowerCase() as Log['level'] : 'info'
        const message = levelMatch ? rest.substring(levelMatch[0].length).trim() : rest

        return {
          id: `log-${agentId}-${Date.now()}-${index}`,
          timestamp: new Date(timestamp).toISOString(),
          agentId,
          level,
          message,
        }
      }

      return {
        id: `log-${agentId}-${Date.now()}-${index}`,
        timestamp: new Date().toISOString(),
        agentId,
        level: 'info',
        message: line,
      }
    } catch (error) {
      console.error('Failed to parse log line:', error)
      return null
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }
}

export const logFileService = new LogFileService()

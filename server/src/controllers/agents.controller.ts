import { Request, Response } from 'express'
import { openClawGatewayService } from '../services/openclaw.gateway.js'
import { logFileService } from '../services/logfile.service.js'
import type { AgentId } from '../types/index.js'

export class AgentsController {
  async getAllAgents(req: Request, res: Response) {
    try {
      const agents = await openClawGatewayService.getAgents()
      
      if (!agents) {
        res.json({
          success: false,
          error: 'Failed to fetch agents from OpenClaw',
          data: [],
        })
        return
      }

      res.json({
        success: true,
        data: agents,
      })
    } catch (error) {
      console.error('Error in getAllAgents:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  async getAgentById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const status = await openClawGatewayService.getAgentStatus(id as AgentId)

      if (!status) {
        res.status(404).json({
          success: false,
          error: 'Agent not found',
        })
        return
      }

      res.json({
        success: true,
        data: status,
      })
    } catch (error) {
      console.error('Error in getAgentById:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  async getAgentLogs(req: Request, res: Response) {
    try {
      const { id } = req.params
      const limit = parseInt(req.query.limit as string) || 50
      const source = (req.query.source as string) || 'gateway'

      let logs

      if (source === 'file') {
        logs = await logFileService.readAgentLogs(id as AgentId, limit)
      } else {
        logs = await openClawGatewayService.getAgentLogs(id as AgentId, limit)
      }

      res.json({
        success: true,
        data: logs,
      })
    } catch (error) {
      console.error('Error in getAgentLogs:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  async getOpenClawStatus(req: Request, res: Response) {
    try {
      const status = await openClawGatewayService.getStatus()

      res.json({
        success: true,
        data: status || { gateway: 'offline', agent: 'offline' },
      })
    } catch (error) {
      console.error('Error in getOpenClawStatus:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }
}

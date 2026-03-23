import { Request, Response } from 'express'
import { openClawGatewayService } from '../services/openclaw.gateway.js'
import { logFileService } from '../services/logfile.service.js'

export class LogsController {
  async getRecentLogs(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 100
      const source = (req.query.source as string) || 'gateway'

      let logs

      if (source === 'file') {
        logs = await logFileService.readRecentLogs(limit)
      } else {
        logs = await openClawGatewayService.getRecentLogs(limit)
      }

      res.json({
        success: true,
        data: logs,
      })
    } catch (error) {
      console.error('Error in getRecentLogs:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }
}

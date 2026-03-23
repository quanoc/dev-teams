import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { config } from './config/index.js'
import routes from './routes/index.js'
import { logFileService } from './services/logfile.service.js'
import type { AgentId, Log } from './types/index.js'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
  },
})

app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}))

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.use('/api', routes)

const logWatchers = new Map<AgentId, () => void>()

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('subscribe:agent:logs', async (agentId: AgentId) => {
    console.log(`Client ${socket.id} subscribed to agent ${agentId} logs`)
    socket.join(`agent:${agentId}:logs`)

    if (!logWatchers.has(agentId)) {
      const unsubscribe = await logFileService.watchAgentLogs(
        agentId,
        (log: Log) => {
          io.to(`agent:${agentId}:logs`).emit('log', log)
        }
      )
      logWatchers.set(agentId, unsubscribe)
    }
  })

  socket.on('unsubscribe:agent:logs', (agentId: AgentId) => {
    console.log(`Client ${socket.id} unsubscribed from agent ${agentId} logs`)
    socket.leave(`agent:${agentId}:logs`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

httpServer.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`)
  console.log(`📡 WebSocket server ready`)
  console.log(`🔗 API available at http://localhost:${config.port}/api`)
  console.log(`📊 Health check at http://localhost:${config.port}/health`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  logWatchers.forEach(unsubscribe => unsubscribe())
  logWatchers.clear()
  httpServer.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  logWatchers.forEach(unsubscribe => unsubscribe())
  logWatchers.clear()
  httpServer.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

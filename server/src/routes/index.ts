import { Router } from 'express'
import agentsRoutes from './agents.routes.js'
import logsRoutes from './logs.routes.js'

const router = Router()

router.use('/agents', agentsRoutes)
router.use('/logs', logsRoutes)

export default router

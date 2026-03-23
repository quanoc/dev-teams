import { Router } from 'express'
import { AgentsController } from '../controllers/agents.controller.js'

const router = Router()
const controller = new AgentsController()

router.get('/', controller.getAllAgents.bind(controller))
router.get('/status', controller.getOpenClawStatus.bind(controller))
router.get('/:id', controller.getAgentById.bind(controller))
router.get('/:id/logs', controller.getAgentLogs.bind(controller))

export default router

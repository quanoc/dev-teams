import { Router } from 'express'
import { LogsController } from '../controllers/logs.controller.js'

const router = Router()
const controller = new LogsController()

router.get('/recent', controller.getRecentLogs.bind(controller))

export default router

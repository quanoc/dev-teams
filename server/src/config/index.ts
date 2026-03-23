import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  },
  
  openclaw: {
    url: process.env.OPENCLAW_URL || 'http://127.0.0.1:18789',
    apiKey: process.env.OPENCLAW_API_KEY || '',
    logPath: process.env.OPENCLAW_LOG_PATH || path.join(process.env.HOME || '', '.openclaw', 'logs'),
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
}

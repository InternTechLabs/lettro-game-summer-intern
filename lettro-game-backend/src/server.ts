import { createServer } from 'http'
import { app } from '@/app'
import dotenv from 'dotenv'
import { prisma } from '@/config/prisma'
import { redisClient } from '@/config/redis'
import { env } from '@/config/env'
import { logger } from '@/config/logger'
import { setupWebSocket } from '@/ws/websocket'

const server = createServer(app)
dotenv.config({ path: '.env.development.local' })
console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET)

await redisClient.connect()

// Setup WebSocket
setupWebSocket(server)

async function gracefulShutdown (signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`)

  server.close(async () => {
    logger.info('HTTP server closed')

    try {
      await prisma.$disconnect()
      logger.info('Prisma disconnected')

      await redisClient.quit()
      logger.info('Redis disconnected')

      process.exit(0)
    } catch (error) {
      logger.error('Error during shutdown:', error)
      process.exit(1)
    }
  })

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 30000)
}

process.on('SIGTERM', async () => { await gracefulShutdown('SIGTERM') })
process.on('SIGINT', async () => { await gracefulShutdown('SIGINT') })

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown('unhandledRejection')
})

logger.info('server')
async function startServer () {
  try {
    await redisClient.connect()

    const PORT = process.env.PORT || 3000
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📱 Environment: ${env.NODE_ENV}`)
      logger.info(`🔗 WebSocket available at ws://localhost:${PORT}/ws`)

      if (env.NODE_ENV === 'development') {
        logger.info('📊 Database Studio: npx prisma studio')
        logger.info(`🔍 Health check: http://localhost:${PORT}/health`)
      }
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export { server }

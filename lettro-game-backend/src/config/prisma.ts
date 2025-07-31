import { PrismaClient } from '@prisma/client'
import { env } from './env'
import { logger } from './logger'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
})

prisma
  .$connect()
  .then(() => logger.info('Database connected successfully'))
  .catch((e: Error) => {
    logger.error('Prisma connection error:', e)
    process.exit(1)
  })

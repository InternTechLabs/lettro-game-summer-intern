import { PrismaClient } from '@prisma/client'
import { logger } from '@/config/logger'
// Prisma does not export LogLevel, so we define it here
type LogLevel = 'query' | 'info' | 'warn' | 'error'
// import type { TransactionClient, TransactionIsolationLevel } from '@prisma/client' // Not exported directly
// Locally define QueryEvent since it's not exported by Prisma
interface QueryEvent {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}
// Locally define LogEvent since it's not exported by Prisma
interface LogEvent {
  timestamp: Date
  message: string
  target: string
}
interface DatabaseConfig {
  url: string
  logLevel: LogLevel[]
  errorFormat: 'pretty' | 'colorless' | 'minimal'
  maxConnections: number
  connectionTimeout: number
  queryTimeout: number
}

const getDatabaseConfig = (): DatabaseConfig => {
  const env = process.env.NODE_ENV ?? 'development'

  const baseConfig: DatabaseConfig = {
    url: process.env.DATABASE_URL ?? '',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS ?? '10', 10),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT ?? '10000', 10),
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT ?? '30000', 10),
    errorFormat: 'pretty',
    logLevel: ['error']
  }

  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        logLevel: ['query', 'info', 'warn', 'error'],
        errorFormat: 'pretty'
      }
    case 'test':
      return {
        ...baseConfig,
        url: process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? '',
        logLevel: ['warn', 'error'],
        errorFormat: 'minimal'
      }
    case 'production':
      return {
        ...baseConfig,
        logLevel: ['error'],
        errorFormat: 'minimal'
      }
    default:
      return baseConfig
  }
}

class DatabaseClient extends PrismaClient {
  constructor (config: DatabaseConfig) {
    super({
      datasources: {
        db: {
          url: config.url
        }
      },
      log: config.logLevel.map(level => ({
        level,
        emit: 'event'
      })),
      errorFormat: config.errorFormat
    })
    this.setupEventListeners()
  }

  private setupEventListeners (): void {
    this.$on('query', (e: QueryEvent) => {
      logger.info('Database Query Executed', {
        duration: `${e.duration}ms`
      })
      if ((process.env.NODE_ENV ?? '') === 'development') {
        logger.debug('Database Query', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
          target: e.target
        })
      }
    })

    this.$on('info', (e: LogEvent) => {
      logger.info('Database Info', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
      })
    })

    this.$on('warn', (e: LogEvent) => {
      logger.warn('Database Warning', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
      })
    })

    this.$on('error', (e: LogEvent) => {
      logger.error('Database Error', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
      })
    })
  }

  async connectWithRetry (maxRetries: number = 5, delay: number = 1000): Promise<void> {
    let retries = 0
    while (retries < maxRetries) {
      try {
        await this.$connect()
        logger.info('Database connected successfully', {
          attempt: retries + 1,
          maxRetries
        })
        return
      } catch (error: unknown) {
        retries++
        logger.error('Database connection failed', {
          attempt: retries,
          maxRetries,
          error: error instanceof Error ? error.message : 'Unknown error'
        })

        if (retries === maxRetries) {
          throw new Error(`Failed to connect to database after ${maxRetries} attempts`)
        }

        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retries - 1)))
      }
    }
  }

  async healthCheck (): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`
      return true
    } catch (error: unknown) {
      logger.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return false
    }
  }

  async gracefulDisconnect (): Promise<void> {
    try {
      await this.$disconnect()
      logger.info('Database disconnected gracefully')
    } catch (error: unknown) {
      logger.error('Error during database disconnection', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  async executeTransaction<T>(
    fn: (prisma: PrismaClient['$transaction']) => Promise<T>,
    options?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable'
    }
  ): Promise<T> {
    const startTime = Date.now()
    try {
      logger.debug('Starting database transaction')

      const result = await this.$transaction(fn, {
        maxWait: options?.maxWait ?? 5000,
        timeout: options?.timeout ?? 10000,
        isolationLevel: options?.isolationLevel
      })

      const duration = Date.now() - startTime
      logger.info('Database transaction completed', { duration: `${duration}ms` })
      return result
    } catch (error: unknown) {
      const duration = Date.now() - startTime
      logger.error('Database transaction failed', {
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }
}

const config = getDatabaseConfig()
const database = new DatabaseClient(config)
let isConnected = false

const initializeDatabase = async (): Promise<void> => {
  try {
    await database.connectWithRetry()
    isConnected = true

    const gracefulShutdown = async (): Promise<void> => {
      if (isConnected) {
        await database.gracefulDisconnect()
        isConnected = false
      }
    }

    process.on('SIGINT', gracefulShutdown)
    process.on('SIGTERM', gracefulShutdown)
    process.on('beforeExit', gracefulShutdown)
  } catch (error: unknown) {
    logger.error('Failed to initialize database', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export {
  database,
  initializeDatabase,
  DatabaseClient,
  type DatabaseConfig
}

export const isDatabaseConnected = (): boolean => isConnected

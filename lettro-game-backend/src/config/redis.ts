import { createClient } from 'redis'
import { RedisStore as ConnectRedis } from 'connect-redis'
import { env } from './env'
import { logger } from './logger'

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379
  }
})

redisClient.on('error', (err) => logger.error('Redis Client Error:', err))
redisClient.on('connect', () => logger.info('Connected to Redis'))

// IMPORTANT: connect client manually
await redisClient.connect()

export const RedisStore = new ConnectRedis({
  client: redisClient
})

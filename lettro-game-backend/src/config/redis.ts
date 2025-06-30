import { createClient } from 'redis'
import { RedisStore as ConnectRedis } from 'connect-redis'
import { env } from './env'
import { logger } from './logger'

export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
})

redisClient.on('error', (err) => logger.error('Redis Client Error:', err))
redisClient.on('connect', () => logger.info('Connected to Redis'))

export const RedisStore = new ConnectRedis({
  client: redisClient,
})


// src/services/redis.service.ts
import { redisClient } from '@/config/redis'
import { logger } from '@/config/logger'

export class RedisService {
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:'
  private readonly RATE_LIMIT_PREFIX = 'rate_limit:'
  private readonly SESSION_PREFIX = 'session:'
  private readonly GAME_PREFIX = 'game:'
  private readonly PLAYER_CACHE_PREFIX = 'player:'

  // Refresh Token Management
  async setRefreshToken(playerId: string, token: string, ttl: number = 7 * 24 * 60 * 60): Promise<void> {
    try {
      const key = `${this.REFRESH_TOKEN_PREFIX}${playerId}`
      await redisClient.setEx(key, ttl, token)
    } catch (error) {
      logger.error('Redis setRefreshToken error:', error)
      throw error
    }
  }

  async getRefreshToken(playerId: string): Promise<string | null> {
    try {
      const key = `${this.REFRESH_TOKEN_PREFIX}${playerId}`
      return await redisClient.get(key)
    } catch (error) {
      logger.error('Redis getRefreshToken error:', error)
      throw error
    }
  }

  async deleteRefreshToken(playerId: string): Promise<void> {
    try {
      const key = `${this.REFRESH_TOKEN_PREFIX}${playerId}`
      await redisClient.del(key)
    } catch (error) {
      logger.error('Redis deleteRefreshToken error:', error)
      throw error
    }
  }

  // Rate Limiting
  async incrementRateLimit(
    identifier: string, 
    action: string, 
    windowSeconds: number = 60
  ): Promise<{ count: number; ttl: number }> {
    try {
      const key = `${this.RATE_LIMIT_PREFIX}${action}:${identifier}`
      const pipeline = redisClient.multi()
      
      pipeline.incr(key)
      pipeline.expire(key, windowSeconds)
      pipeline.ttl(key)
      
      const results = await pipeline.exec()
      // Each result is [error, value], so destructure accordingly
      const count = (results && Array.isArray(results[0]) ? results[0][1] as number : 0) || 0
      const ttl = (results && Array.isArray(results[2]) ? results[2][1] as number : 0) || 0
      
      return { count, ttl }
    } catch (error) {
      logger.error('Redis incrementRateLimit error:', error)
      throw error
    }
  }

  async getRateLimit(identifier: string, action: string): Promise<{ count: number; ttl: number }> {
    try {
      const key = `${this.RATE_LIMIT_PREFIX}${action}:${identifier}`
      const pipeline = redisClient.multi()
      
      pipeline.get(key)
      pipeline.ttl(key)
      
      const results = await pipeline.exec()
      const countRaw = Array.isArray(results?.[0]) ? results[0][1] : null
      const ttlRaw = Array.isArray(results?.[1]) ? results[1][1] : null
      const count = parseInt(countRaw ?? '0', 10)
      const ttl = typeof ttlRaw === 'number' ? ttlRaw : 0
      
      return { count, ttl }
    } catch (error) {
      logger.error('Redis getRateLimit error:', error)
      throw error
    }
  }

  async resetRateLimit(identifier: string, action: string): Promise<void> {
    try {
      const key = `${this.RATE_LIMIT_PREFIX}${action}:${identifier}`
      await redisClient.del(key)
    } catch (error) {
      logger.error('Redis resetRateLimit error:', error)
      throw error
    }
  }

  // Session Management
  async setSession(sessionId: string, data: any, ttl: number = 24 * 60 * 60): Promise<void> {
    try {
      const key = `${this.SESSION_PREFIX}${sessionId}`
      await redisClient.setEx(key, ttl, JSON.stringify(data))
    } catch (error) {
      logger.error('Redis setSession error:', error)
      throw error
    }
  }

  async getSession(sessionId: string): Promise<any | null> {
    try {
      const key = `${this.SESSION_PREFIX}${sessionId}`
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      logger.error('Redis getSession error:', error)
      throw error
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const key = `${this.SESSION_PREFIX}${sessionId}`
      await redisClient.del(key)
    } catch (error) {
      logger.error('Redis deleteSession error:', error)
      throw error
    }
  }

  // Player Caching
  async cachePlayer(playerId: string, playerData: any, ttl: number = 15 * 60): Promise<void> {
    try {
      const key = `${this.PLAYER_CACHE_PREFIX}${playerId}`
      await redisClient.setEx(key, ttl, JSON.stringify(playerData))
    } catch (error) {
      logger.error('Redis cachePlayer error:', error)
      throw error
    }
  }

  async getCachedPlayer(playerId: string): Promise<any | null> {
    try {
      const key = `${this.PLAYER_CACHE_PREFIX}${playerId}`
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      logger.error('Redis getCachedPlayer error:', error)
      throw error
    }
  }

  async invalidatePlayerCache(playerId: string): Promise<void> {
    try {
      const key = `${this.PLAYER_CACHE_PREFIX}${playerId}`
      await redisClient.del(key)
    } catch (error) {
      logger.error('Redis invalidatePlayerCache error:', error)
      throw error
    }
  }

  // Game Session Management
  async setGameSession(gameId: string, gameData: any, ttl: number = 60 * 60): Promise<void> {
    try {
      const key = `${this.GAME_PREFIX}${gameId}`
      await redisClient.setEx(key, ttl, JSON.stringify(gameData))
    } catch (error) {
      logger.error('Redis setGameSession error:', error)
      throw error
    }
  }

  async getGameSession(gameId: string): Promise<any | null> {
    try {
      const key = `${this.GAME_PREFIX}${gameId}`
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      logger.error('Redis getGameSession error:', error)
      throw error
    }
  }

  async deleteGameSession(gameId: string): Promise<void> {
    try {
      const key = `${this.GAME_PREFIX}${gameId}`
      await redisClient.del(key)
    } catch (error) {
      logger.error('Redis deleteGameSession error:', error)
      throw error
    }
  }

  // Generic Cache Operations
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      if (ttl) {
        await redisClient.setEx(key, ttl, serializedValue)
      } else {
        await redisClient.set(key, serializedValue)
      }
    } catch (error) {
      logger.error('Redis set error:', error)
      throw error
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      logger.error('Redis get error:', error)
      throw error
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key)
    } catch (error) {
      logger.error('Redis del error:', error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key)
      return result === 1
    } catch (error) {
      logger.error('Redis exists error:', error)
      throw error
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await redisClient.expire(key, ttl)
    } catch (error) {
      logger.error('Redis expire error:', error)
      throw error
    }
  }

  // Pub/Sub for real-time features
  async publish(channel: string, message: any): Promise<void> {
    try {
      await redisClient.publish(channel, JSON.stringify(message))
    } catch (error) {
      logger.error('Redis publish error:', error)
      throw error
    }
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    try {
      const subscriber = redisClient.duplicate()
      await subscriber.connect()
      
      await subscriber.subscribe(channel, (message) => {
        try {
          const parsedMessage = JSON.parse(message)
          callback(parsedMessage)
        } catch (parseError) {
          logger.error('Redis message parse error:', parseError)
          callback(message)
        }
      })
    } catch (error) {
      logger.error('Redis subscribe error:', error)
      throw error
    }
  }

  // Bulk operations
  async mget(keys: string[]): Promise<(any | null)[]> {
    try {
      const values = await redisClient.mGet(keys)
      return values.map(value => value ? JSON.parse(value) : null)
    } catch (error) {
      logger.error('Redis mget error:', error)
      throw error
    }
  }

  async mset(keyValuePairs: Record<string, any>, ttl?: number): Promise<void> {
    try {
      const pipeline = redisClient.multi()
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = JSON.stringify(value)
        if (ttl) {
          pipeline.setEx(key, ttl, serializedValue)
        } else {
          pipeline.set(key, serializedValue)
        }
      }
      
      await pipeline.exec()
    } catch (error) {
      logger.error('Redis mset error:', error)
      throw error
    }
  }

  // Cleanup operations
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern)
      if (keys.length === 0) return 0
      
      return await redisClient.del(keys)
    } catch (error) {
      logger.error('Redis deletePattern error:', error)
      throw error
    }
  }

  async flushdb(): Promise<void> {
    try {
      await redisClient.flushDb()
    } catch (error) {
      logger.error('Redis flushdb error:', error)
      throw error
    }
  }
}
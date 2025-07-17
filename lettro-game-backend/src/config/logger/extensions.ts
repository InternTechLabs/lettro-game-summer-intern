// Adds custom log helpers (like HTTP logs)
import type winston from 'winston'
import type {
  RequestLogData,
  WebSocketLogData,
  DatabaseLogData,
  MorganStream
} from '@/types/logs'

export class LoggerExtensions {
  constructor (private readonly logger: winston.Logger) {}

  logRequest = (req: any, res: any, responseTime?: number): void => {
    const logData: RequestLogData = {
      method: req.method,
      url: req.originalUrl ?? req.url,
      ip: req.ip ?? req.connection?.remoteAddress ?? 'unknown',
      userAgent: req.get?.('User-Agent') ?? 'unknown',
      requestId: req.headers?.['x-request-id'],
      statusCode: res.statusCode,
      responseTime: responseTime != null ? `${responseTime}ms` : undefined,
      userId: req.user?.id ?? 'guest'
    }

    if (typeof res.statusCode === 'number' && res.statusCode >= 400) {
      this.logger.warn('HTTP Request', logData)
    } else {
      this.logger.info('HTTP Request', logData)
    }
  }

  logWebSocket = (event: string, clientId: string, data?: any): void => {
    const logData: WebSocketLogData = {
      event,
      clientId,
      data: data ? JSON.stringify(data) : undefined,
      timestamp: new Date().toISOString()
    }

    this.logger.info('WebSocket Event', logData)
  }

  logDatabase = (
    operation: string,
    table?: string,
    duration?: number,
    error?: any
  ): void => {
    const logData: DatabaseLogData = {
      operation,
      table,
      duration: typeof duration === 'number' && !isNaN(duration)
        ? `${duration}ms`
        : undefined,
      timestamp: new Date().toISOString()
    }

    if (error instanceof Error) {
      this.logger.error('Database Error', {
        ...logData,
        error: error.message,
        stack: error.stack
      })
    } else {
      this.logger.debug('Database Operation', logData)
    }
  }

  getMorganStream (): MorganStream {
    return {
      write: (message: string): void => {
        this.logger.http(message.substring(0, message.lastIndexOf('\n')))
      }
    }
  }
}

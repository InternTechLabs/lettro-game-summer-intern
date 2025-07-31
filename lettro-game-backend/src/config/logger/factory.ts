// Standardizes logger creation

import winston from 'winston'
import path from 'path'
import { LoggerExtensions } from './extensions'
import type { LoggerConfig } from '@/types/logs'
import { LoggerConfigurationService } from './config'

export class LoggerFactory {
  static createLogger (serviceName: string = 'summer-intern'): {
    logger: winston.Logger
    morganStream: { write: (message: string) => void }
  } {
    const config: LoggerConfig = {
      serviceName,
      environment: process.env.NODE_ENV ?? 'development',
      logsDirectory: path.join(process.cwd(), 'logs')
    }

    const configService = new LoggerConfigurationService(config)

    const logger = winston.createLogger({
      level: configService.getLogLevel(),
      levels: configService.getLevels(),
      format: configService.createFileFormat(),
      defaultMeta: configService.getDefaultMeta(),
      transports: [
        new winston.transports.Console({
          format: configService.createConsoleFormat()
        }),
        configService.createFileRotateTransport(),
        configService.createErrorFileRotateTransport(),
        configService.createCombinedFileRotateTransport()
      ],
      exceptionHandlers: [configService.createExceptionsTransport()],
      rejectionHandlers: [configService.createRejectionsTransport()],
      exitOnError: false
    })

    const extensions = new LoggerExtensions(logger);

    // Extend logger with custom methods
    (logger as any).logRequest = extensions.logRequest;
    (logger as any).logWebSocket = extensions.logWebSocket;
    (logger as any).logDatabase = extensions.logDatabase

    return {
      logger,
      morganStream: extensions.getMorganStream()
    }
  }
}

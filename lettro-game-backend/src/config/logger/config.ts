// Centralizes log formats & rules
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'
import { LOG_LEVELS, LOG_COLORS, LOG_CONFIG, FILE_NAMES } from '@/constants/logs'
import type { LogLevel, LoggerConfig } from '@/types/logs'

export class LoggerConfigurationService {
  private readonly config: LoggerConfig

  constructor (config: LoggerConfig) {
    this.config = config
    winston.addColors(LOG_COLORS)
  }

  getLogLevel (): LogLevel {
    const isDevelopment = this.config.environment === 'development'
    return isDevelopment ? 'debug' : 'warn'
  }

  createConsoleFormat (): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: LOG_CONFIG.timestampFormat }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${String(info.message)}`
      )
    )
  }

  createFileFormat (): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: LOG_CONFIG.timestampFormat }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  }

  createFileRotateTransport (): DailyRotateFile {
    return new DailyRotateFile({
      filename: path.join(this.config.logsDirectory, FILE_NAMES.application),
      datePattern: LOG_CONFIG.datePattern,
      zippedArchive: true,
      maxSize: LOG_CONFIG.maxFileSize,
      maxFiles: LOG_CONFIG.maxFiles,
      format: this.createFileFormat()
    })
  }

  createErrorFileRotateTransport (): DailyRotateFile {
    return new DailyRotateFile({
      filename: path.join(this.config.logsDirectory, FILE_NAMES.error),
      datePattern: LOG_CONFIG.datePattern,
      level: 'error',
      zippedArchive: true,
      maxSize: LOG_CONFIG.maxFileSize,
      maxFiles: LOG_CONFIG.errorMaxFiles,
      format: this.createFileFormat()
    })
  }

  createCombinedFileRotateTransport (): DailyRotateFile {
    return new DailyRotateFile({
      filename: path.join(this.config.logsDirectory, FILE_NAMES.combined),
      datePattern: LOG_CONFIG.datePattern,
      zippedArchive: true,
      maxSize: LOG_CONFIG.maxFileSize,
      maxFiles: LOG_CONFIG.combinedMaxFiles,
      format: this.createFileFormat()
    })
  }

  createExceptionsTransport (): winston.transports.FileTransportInstance {
    return new winston.transports.File({
      filename: path.join(this.config.logsDirectory, FILE_NAMES.exceptions),
      format: this.createFileFormat()
    })
  }

  createRejectionsTransport (): winston.transports.FileTransportInstance {
    return new winston.transports.File({
      filename: path.join(this.config.logsDirectory, FILE_NAMES.rejections),
      format: this.createFileFormat()
    })
  }

  getDefaultMeta () {
    return {
      service: this.config.serviceName,
      environment: this.config.environment
    }
  }

  getLevels () {
    return LOG_LEVELS
  }
}

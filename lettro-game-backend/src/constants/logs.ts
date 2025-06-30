export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
} as const;

export const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
} as const;

export const LOG_CONFIG = {
  maxFileSize: '20m',
  maxFiles: '14d',
  errorMaxFiles: '30d',
  combinedMaxFiles: '30d',
  datePattern: 'YYYY-MM-DD',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss:ms'
} as const;

export const FILE_NAMES = {
  application: 'application-%DATE%.log',
  error: 'error-%DATE%.log',
  combined: 'combined-%DATE%.log',
  exceptions: 'exceptions.log',
  rejections: 'rejections.log'
} as const;
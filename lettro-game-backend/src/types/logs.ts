
import { LOG_LEVELS } from "@/constants";

export type LogLevel = keyof typeof LOG_LEVELS;

export interface RequestLogData {
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  requestId?: string;
  statusCode: number;
  responseTime?: string;
  userId: string;
}

export interface WebSocketLogData {
  event: string;
  clientId: string;
  data?: string;
  timestamp: string;
}

export interface DatabaseLogData {
  operation: string;
  table?: string;
  duration?: string;
  timestamp: string;
  error?: string;
  stack?: string;
}

export interface LoggerConfig {
  serviceName: string;
  environment: string;
  logsDirectory: string;
}

export interface MorganStream {
  write: (message: string) => void;
}
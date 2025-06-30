import { type PrismaClient } from '@prisma/client'

// Prisma runtime types (copied from @prisma/client/runtime/library)
type LogLevel = 'info' | 'query' | 'warn' | 'error'
type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

interface QueryEvent {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

interface LogEvent {
  timestamp: Date
  message: string
  target: string
}

type TransactionIsolationLevel = 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable'

type TransactionClient = PrismaClient

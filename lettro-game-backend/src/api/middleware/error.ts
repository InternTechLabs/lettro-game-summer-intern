/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { AppError, ValidationError, DatabaseError, TokenError, NotFoundError, ConflictError } from '@/utils/errorsUtils'
import { HTTP_STATUS, MESSAGES, ERROR_CODES } from '@/constants'
import { logger } from '@/config/logger'
import { env } from '@/config/env'
const { JsonWebTokenError, TokenExpiredError } = jwt
interface ErrorResponse {
  success: false
  error: {
    message: string
    code: string
    statusCode: number
    timestamp: string
    path?: string
    details?: any
    stack?: string
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let appError: AppError

  // Convert known errors to AppError
  if (error instanceof AppError) {
    appError = error
  } else if (error instanceof ZodError) {
    // Zod validation errors
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }))

    appError = new ValidationError(
      'Validation failed',
      validationErrors
    )
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma database errors
    appError = handlePrismaError(error)
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    appError = new ValidationError('Database validation error')
  } else if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
    // JWT errors
    appError = new TokenError(
      error.message,
      error instanceof TokenExpiredError
    )
  } else {
    // Unknown errors
    appError = new AppError(
      env.NODE_ENV === 'production'
        ? MESSAGES.ERROR.INTERNAL_SERVER_ERROR
        : error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR,
      false
    )
  }

  // Log error
  logError(appError, req)

  // Send error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      timestamp: appError.timestamp,
      path: req.path,
      ...(appError.details && { details: appError.details }),
      ...(env.NODE_ENV === 'development' && { stack: appError.stack }),
    },
  }

  res.status(appError.statusCode).json(errorResponse)
}

export const notFoundHandler = (req: Request, res: Response): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`)

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      path: req.path,
    },
  })
}

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Helper functions
function handlePrismaError (error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (error.meta?.target as string[])?.join(', ') || 'field'
      return new ConflictError(`${field} already exists`)

    case 'P2025':
      // Record not found
      return new NotFoundError('Record not found')

    case 'P2003':
      // Foreign key constraint violation
      return new ValidationError('Invalid reference to related record')

    case 'P2011':
      // Null constraint violation
      const nullField = error.meta?.column_name || 'field'
      return new ValidationError(`${nullField} is required`)

    case 'P2012':
      // Missing required value
      const missingField = error.meta?.column_name || 'field'
      return new ValidationError(`${missingField} is missing`)

    case 'P2000':
      // Value too long
      const longField = error.meta?.column_name || 'field'
      return new ValidationError(`${longField} value is too long`)

    case 'P2001':
      // Record does not exist
      return new NotFoundError('Record does not exist')

    case 'P2004':
      // Constraint failed
      return new ValidationError('Database constraint failed')

    default:
      return new DatabaseError(`Database error: ${error.message}`)
  }
}

function logError (error: AppError, req: Request): void {
  const errorLog = {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: error.timestamp,
  }

  if (error.statusCode >= 500) {
    logger.error('Server Error:', errorLog)
  } else if (error.statusCode >= 400) {
    logger.warn('Client Error:', errorLog)
  } else {
    logger.info('Error:', errorLog)
  }
}

// Global exception handlers
export const setupGlobalErrorHandlers = (): void => {
  process.on('uncaughtException', (error: Error) => {
    logger.alert('Uncaught Exception:', error)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.alert('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
  })
}

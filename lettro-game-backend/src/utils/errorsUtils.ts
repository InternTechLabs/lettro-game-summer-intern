import { HTTP_STATUS, ERROR_CODES, MESSAGES } from '@/constants'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational: boolean
  public readonly timestamp: string
  public readonly details?: any

  constructor (
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor (message: string, details?: any) {
    super(
      message || MESSAGES.ERROR.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      true,
      details
    )
  }
}

export class AuthenticationError extends AppError {
  constructor (message: string = MESSAGES.ERROR.UNAUTHORIZED) {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      true
    )
  }
}

export class AuthorizationError extends AppError {
  constructor (message: string = MESSAGES.ERROR.FORBIDDEN) {
    super(
      message,
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      true
    )
  }
}

export class NotFoundError extends AppError {
  constructor (message: string = MESSAGES.ERROR.NOT_FOUND) {
    super(
      message,
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND,
      true
    )
  }
}

export class ConflictError extends AppError {
  constructor (message: string, details?: any) {
    super(
      message,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.CONFLICT,
      true,
      details
    )
  }
}

export class DatabaseError extends AppError {
  constructor (message: string = MESSAGES.ERROR.DATABASE_ERROR, details?: any) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.DATABASE_ERROR,
      true,
      details
    )
  }
}

export class RateLimitError extends AppError {
  constructor (message: string = MESSAGES.ERROR.TOO_MANY_REQUESTS) {
    super(
      message,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.TOO_MANY_REQUESTS,
      true
    )
  }
}

export class TokenError extends AppError {
  constructor (message: string, expired: boolean = false) {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      expired ? ERROR_CODES.TOKEN_EXPIRED : ERROR_CODES.TOKEN_INVALID,
      true
    )
  }
}

export class AccountError extends AppError {
  constructor (message: string, code: string) {
    super(
      message,
      HTTP_STATUS.FORBIDDEN,
      code,
      true
    )
  }
}

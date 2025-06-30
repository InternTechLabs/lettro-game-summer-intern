import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import { env } from '@/config/env'
import { morganStream } from '@/config/logger'
import { RedisStore } from '@/config/redis'
import { apiRateLimiter } from '@/config/rateLimiter'
import { helmetMiddleware, corsMiddleware, hppMiddleware } from '@/config/security'

import morgan from 'morgan'
// import { errorHandler, notFoundHandler } from './middleware/error'

const app = express()
// Security middlewares
app.use(helmetMiddleware)
app.use(hppMiddleware)
app.use(corsMiddleware)

// Basic middlewares
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser(env.COOKIE_SECRET))

// Logging
app.use(morgan('combined', { stream: morganStream }))

// Rate limiting for API routes
app.use('/api/', apiRateLimiter)

// Session handling
app.use(
  session({
    store: RedisStore,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  }),
)

// Optional: health check endpoint, error handlers, etc.
// app.get('/health', ...)
// app.use(notFoundHandler)
// app.use(errorHandler)

export { app }
import { z } from 'zod'
import { validateEnv as validateEnvFn } from '@/config/envValidator'

const envSchema = z.object({
  ENV: z.enum(['development', 'production', 'test']).default('development'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BUILD_TARGET: z.string().default('development'),

  APP_PORT: z.coerce.number().default(3000),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().url(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.coerce.number().default(5432),

  REDIS_URL: z.string().url(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_CONFIG: z.string().nullable().optional().or(z.literal('')),

  VOLUME_MOUNT: z.string().optional(),
  NODE_MODULES_VOLUME: z.string().optional(),

  SESSION_SECRET: z.string().min(10),
  COOKIE_SECRET: z.string().min(10),
  ALLOWED_ORIGINS: z.string().optional(),

  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
  ENCRYPTION_KEY: z.string(),

  // SMTP
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().email()
}).passthrough()

export function validateEnv () {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const formattedErrors = parsed.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join('\n')
    throw new Error(`❌ Invalid environment variables:\n${formattedErrors}`)
  }

  return parsed.data
}

// Export the validated environment variables
export const env = validateEnv()

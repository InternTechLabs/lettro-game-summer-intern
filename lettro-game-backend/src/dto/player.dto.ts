// src/dto/player.dto.ts
import { z } from 'zod'

// Create Player DTOs
export const CreatePlayerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore and dash'),
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase, lowercase, number and special character'
    ),
  firstName: z.string().max(100, 'First name too long').optional(),
  lastName: z.string().max(100, 'Last name too long').optional()
})

export const LoginPlayerSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'), // Can be username or email
  password: z.string().min(1, 'Password is required')
})

// Update Player DTOs
export const UpdatePlayerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore and dash')
    .optional(),
  email: z.string().email('Invalid email format').max(255, 'Email too long').optional(),
  firstName: z.string().max(100, 'First name too long').optional(),
  lastName: z.string().max(100, 'Last name too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  avatar: z.string().url('Invalid avatar URL').max(500, 'Avatar URL too long').optional()
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase, lowercase, number and special character'
    )
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
})

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase, lowercase, number and special character'
    )
})

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
})

// Query DTOs
export const GetPlayersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['username', 'totalScore', 'gamesPlayed', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  isActive: z.coerce.boolean().optional()
})

// Response DTOs
export const PublicPlayerSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  totalScore: z.number(),
  gamesPlayed: z.number(),
  gamesWon: z.number(),
  longestWord: z.string().nullable(),
  averageScore: z.number(),
  createdAt: z.date()
})

export const PrivatePlayerSchema = PublicPlayerSchema.extend({
  email: z.string(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  lastLogin: z.date().nullable(),
  updatedAt: z.date()
})

// Type exports
export type CreatePlayerDto = z.infer<typeof CreatePlayerSchema>
export type LoginPlayerDto = z.infer<typeof LoginPlayerSchema>
export type UpdatePlayerDto = z.infer<typeof UpdatePlayerSchema>
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>
export type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>
export type GetPlayersQueryDto = z.infer<typeof GetPlayersQuerySchema>
export type PublicPlayerDto = z.infer<typeof PublicPlayerSchema>
export type PrivatePlayerDto = z.infer<typeof PrivatePlayerSchema>

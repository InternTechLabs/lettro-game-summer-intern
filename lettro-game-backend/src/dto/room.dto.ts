// src/dto/room.dto.ts
import { z } from 'zod'
import { Difficulty, RoomStatus } from '@prisma/client'
// Create Room DTOs
export const CreateRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Room name is required')
    .max(100, 'Room name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Room name can only contain letters, numbers, underscore and dash'),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional(),
  maxPlayers: z
    .number()
    .min(2, 'Minimum 2 players required')
    .max(20, 'Maximum 20 players allowed')
    .default(6),
  isPrivate: z.boolean().default(false),
  requiresAuth: z.boolean().default(false),
  maxRounds: z
    .number()
    .min(1, 'At least 1 round')
    .max(20, 'Too many rounds')
    .default(3),
  roundDuration: z
    .number()
    .min(10, 'Minimum 10 seconds per round')
    .max(300, 'Maximum 300 seconds per round')
    .default(60),
  drawingTime: z
    .number()
    .min(10, 'Minimum 10 seconds drawing time')
    .max(300, 'Maximum 300 seconds drawing time')
    .default(60),
  wordHints: z.boolean().default(true),
  allowCustomWords: z.boolean().default(false),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM)
})

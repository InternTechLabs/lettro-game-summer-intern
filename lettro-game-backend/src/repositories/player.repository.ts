import { Prisma, Player } from '@prisma/client'
import { prisma } from '@/config/prisma'
import { GetPlayersQueryDto } from '@/dto/player.dto'

export class PlayerRepository {
  async create(data: Prisma.PlayerCreateInput): Promise<Player> {
    return await prisma.player.create({
      data,
    })
  }

  async findById(id: string): Promise<Player | null> {
    return await prisma.player.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<Player | null> {
    return await prisma.player.findUnique({
      where: { email: email.toLowerCase() },
    })
  }

  async findByUsername(username: string): Promise<Player | null> {
    return await prisma.player.findUnique({
      where: { username },
    })
  }

  async findByEmailOrUsername(identifier: string): Promise<Player | null> {
    return await prisma.player.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
    })
  }

  async findByEmailVerificationToken(token: string): Promise<Player | null> {
    return await prisma.player.findFirst({
      where: { emailVerificationToken: token },
    })
  }

  async findByPasswordResetToken(token: string): Promise<Player | null> {
    return await prisma.player.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    })
  }

  async findMany(query: GetPlayersQueryDto): Promise<{
    players: Player[]
    total: number
    totalPages: number
  }> {
    const { page, limit, search, sortBy, sortOrder, isActive } = query
    const skip = (page - 1) * limit

    const where: Prisma.PlayerWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const orderBy: Prisma.PlayerOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.player.count({ where }),
    ])

    return {
      players,
      total,
      totalPages: Math.ceil(total / limit),
    }
  }

  async update(id: string, data: Prisma.PlayerUpdateInput): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  async updatePassword(id: string, hashedPassword: string): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      },
    })
  }

  async updateLoginAttempts(id: string, attempts: number, lockUntil?: Date): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        loginAttempts: attempts,
        lockUntil,
        updatedAt: new Date(),
      },
    })
  }

  async updateLastLogin(id: string): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        lastLogin: new Date(),
        loginAttempts: 0,
        lockUntil: null,
        updatedAt: new Date(),
      },
    })
  }

  async verifyEmail(id: string): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        updatedAt: new Date(),
      },
    })
  }

  async setPasswordResetToken(id: string, token: string, expires: Date): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
        updatedAt: new Date(),
      },
    })
  }

  async setEmailVerificationToken(id: string, token: string): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        emailVerificationToken: token,
        updatedAt: new Date(),
      },
    })
  }

  async softDelete(id: string): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    })
  }

  async hardDelete(id: string): Promise<Player> {
    return await prisma.player.delete({
      where: { id },
    })
  }

  async updateGameStats(
    id: string,
    stats: {
      totalScore?: number
      gamesPlayed?: number
      gamesWon?: number
      longestWord?: string
      averageScore?: number
    }
  ): Promise<Player> {
    return await prisma.player.update({
      where: { id },
      data: {
        ...stats,
        updatedAt: new Date(),
      },
    })
  }

  async getLeaderboard(limit: number = 10): Promise<Player[]> {
    return await prisma.player.findMany({
      where: { isActive: true },
      orderBy: [
        { totalScore: 'desc' },
        { averageScore: 'desc' },
        { gamesWon: 'desc' },
      ],
      take: limit,
    })
  }

  async checkUsernameExists(username: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.player.count({
      where: {
        username,
        ...(excludeId && { id: { not: excludeId } }),
      },
    })
    return count > 0
  }

  async checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.player.count({
      where: {
        email: email.toLowerCase(),
        ...(excludeId && { id: { not: excludeId } }),
      },
    })
    return count > 0
  }
}
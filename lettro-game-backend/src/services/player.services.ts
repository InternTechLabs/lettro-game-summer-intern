// src/services/player.service.ts
import { type Player } from '@prisma/client'
import { PlayerRepository } from '@/repositories/player.repository'
import { SecurityUtils } from '@/utils/securityUtils'
import { RedisService } from '@/services/redis.service'
import { EmailService } from '@/services/email.service'
import {
  type CreatePlayerDto,
  type LoginPlayerDto,
  type UpdatePlayerDto,
  type ChangePasswordDto,
  type GetPlayersQueryDto,
  type PublicPlayerDto,
  type PrivatePlayerDto
} from '@/dto/player.dto'
import { AppError } from '@/utils/errorsUtils'
import { logger } from '@/config/logger'

export class PlayerService {
  private readonly playerRepository: PlayerRepository
  private readonly redisService: RedisService
  private readonly emailService: EmailService

  constructor () {
    this.playerRepository = new PlayerRepository()
    this.redisService = new RedisService()
    this.emailService = new EmailService()
  }

  async register (data: CreatePlayerDto): Promise<{
    player: PublicPlayerDto
    accessToken: string
    refreshToken: string
  }> {
    try {
      // Check if username already exists
      const existingUsername = await this.playerRepository.findByUsername(data.username)
      if (existingUsername) {
        throw new AppError('Username already exists', 409)
      }

      // Check if email already exists
      const existingEmail = await this.playerRepository.findByEmail(data.email)
      if (existingEmail) {
        throw new AppError('Email already exists', 409)
      }

      // Validate password strength
      const passwordValidation = SecurityUtils.validatePasswordStrength(data.password)
      if (!passwordValidation.isValid) {
        throw new AppError(`Weak password: ${passwordValidation.feedback.join(', ')}`, 400)
      }

      // Hash password
      const hashedPassword = await SecurityUtils.hashPassword(data.password)

      // Generate email verification token
      const emailVerificationToken = SecurityUtils.generateSecureToken()

      // Create player
      const player = await this.playerRepository.create({
        username: data.username,
        email: SecurityUtils.sanitizeEmail(data.email),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        emailVerificationToken
      })

      // Send verification email
      await this.emailService.sendVerificationEmail(player.email, emailVerificationToken)

      // Generate tokens
      const accessToken = SecurityUtils.generateAccessToken({
        id: player.id,
        username: player.username,
        email: player.email
      })

      const refreshToken = SecurityUtils.generateRefreshToken({ id: player.id })

      // Store refresh token in Redis
      await this.redisService.setRefreshToken(player.id, refreshToken)

      logger.info(`Player registered: ${player.username}`)

      return {
        player: this.toPublicPlayer(player),
        accessToken,
        refreshToken
      }
    } catch (error) {
      logger.error('Registration error:', error)
      throw error
    }
  }

  async login (data: LoginPlayerDto, clientIP: string): Promise<{
    player: PrivatePlayerDto
    accessToken: string
    refreshToken: string
  }> {
    try {
      // Find player by email or username
      const player = await this.playerRepository.findByEmailOrUsername(data.identifier)
      if (!player) {
        throw new AppError('Invalid credentials', 401)
      }

      // Check if account is active
      if (!player.isActive) {
        throw new AppError('Account is deactivated', 401)
      }

      // Check if account is locked
      if (SecurityUtils.isAccountLocked(player.lockUntil)) {
        const lockTime = Math.ceil((player.lockUntil!.getTime() - Date.now()) / (1000 * 60))
        throw new AppError(`Account locked for ${lockTime} minutes`, 429)
      }

      // Verify password
      const isPasswordValid = await SecurityUtils.comparePassword(data.password, player.password)
      if (!isPasswordValid) {
        // Increment login attempts
        const newAttempts = player.loginAttempts + 1
        let lockUntil: Date | undefined

        if (newAttempts >= 5) {
          const lockDuration = SecurityUtils.calculateLockoutDuration(newAttempts)
          lockUntil = new Date(Date.now() + lockDuration)
        }

        await this.playerRepository.updateLoginAttempts(player.id, newAttempts, lockUntil)
        throw new AppError('Invalid credentials', 401)
      }

      // Update last login and reset attempts
      await this.playerRepository.updateLastLogin(player.id)

      // Generate tokens
      const accessToken = SecurityUtils.generateAccessToken({
        id: player.id,
        username: player.username,
        email: player.email
      })

      const refreshToken = SecurityUtils.generateRefreshToken({ id: player.id })

      // Store refresh token in Redis
      await this.redisService.setRefreshToken(player.id, refreshToken)

      // Log successful login
      logger.info(`Player logged in: ${player.username} from IP: ${clientIP}`)

      return {
        player: this.toPrivatePlayer(player),
        accessToken,
        refreshToken
      }
    } catch (error) {
      logger.error('Login error:', error)
      throw error
    }
  }

  async logout (playerId: string): Promise<void> {
    try {
      // Remove refresh token from Redis
      await this.redisService.deleteRefreshToken(playerId)
      logger.info(`Player logged out: ${playerId}`)
    } catch (error) {
      logger.error('Logout error:', error)
      throw error
    }
  }

  async refreshToken (refreshToken: string): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    try {
      // Verify refresh token
      const decoded = SecurityUtils.verifyRefreshToken(refreshToken)

      // Check if token exists in Redis
      const storedToken = await this.redisService.getRefreshToken(decoded.id)
      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401)
      }

      // Get player
      const player = await this.playerRepository.findById(decoded.id)
      if (!player?.isActive) {
        throw new AppError('Player not found or inactive', 401)
      }

      // Generate new tokens
      const newAccessToken = SecurityUtils.generateAccessToken({
        id: player.id,
        username: player.username,
        email: player.email
      })

      const newRefreshToken = SecurityUtils.generateRefreshToken({ id: player.id })

      // Update refresh token in Redis
      await this.redisService.setRefreshToken(player.id, newRefreshToken)

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      logger.error('Token refresh error:', error)
      throw error
    }
  }

  async getPlayerById (id: string, includePrivate: boolean = false): Promise<PublicPlayerDto | PrivatePlayerDto> {
    try {
      const player = await this.playerRepository.findById(id)
      if (!player) {
        throw new AppError('Player not found', 404)
      }

      return includePrivate ? this.toPrivatePlayer(player) : this.toPublicPlayer(player)
    } catch (error) {
      logger.error('Get player by ID error:', error)
      throw error
    }
  }

  async getPlayerByUsername (username: string): Promise<PublicPlayerDto> {
    try {
      const player = await this.playerRepository.findByUsername(username)
      if (!player) {
        throw new AppError('Player not found', 404)
      }

      return this.toPublicPlayer(player)
    } catch (error) {
      logger.error('Get player by username error:', error)
      throw error
    }
  }

  async updatePlayer (id: string, data: UpdatePlayerDto): Promise<PrivatePlayerDto> {
    try {
      // Check if username is being updated and if it exists
      if (data.username) {
        const usernameExists = await this.playerRepository.checkUsernameExists(data.username, id)
        if (usernameExists) {
          throw new AppError('Username already exists', 409)
        }
      }

      // Check if email is being updated and if it exists
      if (data.email) {
        const emailExists = await this.playerRepository.checkEmailExists(data.email, id)
        if (emailExists) {
          throw new AppError('Email already exists', 409)
        }
        data.email = SecurityUtils.sanitizeEmail(data.email)
      }

      const updatedPlayer = await this.playerRepository.update(id, {
        ...data,
        ...(data.email && { isVerified: false }) // Reset verification if email changed
      })

      // Send new verification email if email was changed
      if (data.email) {
        const verificationToken = SecurityUtils.generateSecureToken()
        await this.playerRepository.setEmailVerificationToken(id, verificationToken)
        await this.emailService.sendVerificationEmail(data.email, verificationToken)
      }

      logger.info(`Player updated: ${updatedPlayer.username}`)
      return this.toPrivatePlayer(updatedPlayer)
    } catch (error) {
      logger.error('Update player error:', error)
      throw error
    }
  }

  async changePassword (id: string, data: ChangePasswordDto): Promise<void> {
    try {
      const player = await this.playerRepository.findById(id)
      if (!player) {
        throw new AppError('Player not found', 404)
      }

      // Verify current password
      const isCurrentPasswordValid = await SecurityUtils.comparePassword(
        data.currentPassword,
        player.password
      )
      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400)
      }

      // Validate new password strength
      const passwordValidation = SecurityUtils.validatePasswordStrength(data.newPassword)
      if (!passwordValidation.isValid) {
        throw new AppError(`Weak password: ${passwordValidation.feedback.join(', ')}`, 400)
      }

      // Hash new password
      const hashedPassword = await SecurityUtils.hashPassword(data.newPassword)

      // Update password
      await this.playerRepository.updatePassword(id, hashedPassword)

      // Invalidate all refresh tokens
      await this.redisService.deleteRefreshToken(id)

      logger.info(`Password changed for player: ${player.username}`)
    } catch (error) {
      logger.error('Change password error:', error)
      throw error
    }
  }

  async forgotPassword (email: string): Promise<void> {
    try {
      const player = await this.playerRepository.findByEmail(email)
      if (!player) {
        // Don't reveal if email exists - return success anyway for security
        return
      }

      // Generate reset token
      const resetToken = SecurityUtils.generateSecureToken()
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Save reset token
      await this.playerRepository.setPasswordResetToken(player.id, resetToken, resetExpires)

      // Send reset email
      await this.emailService.sendPasswordResetEmail(player.email, resetToken)

      logger.info(`Password reset requested for: ${player.email}`)
    } catch (error) {
      logger.error('Forgot password error:', error)
      throw error
    }
  }

  async resetPassword (token: string, newPassword: string): Promise<void> {
    try {
      const player = await this.playerRepository.findByPasswordResetToken(token)
      if (!player) {
        throw new AppError('Invalid or expired reset token', 400)
      }

      // Validate password strength
      const passwordValidation = SecurityUtils.validatePasswordStrength(newPassword)
      if (!passwordValidation.isValid) {
        throw new AppError(`Weak password: ${passwordValidation.feedback.join(', ')}`, 400)
      }

      // Hash new password
      const hashedPassword = await SecurityUtils.hashPassword(newPassword)

      // Update password and clear reset token
      await this.playerRepository.updatePassword(player.id, hashedPassword)

      // Invalidate all refresh tokens
      await this.redisService.deleteRefreshToken(player.id)

      logger.info(`Password reset completed for: ${player.email}`)
    } catch (error) {
      logger.error('Reset password error:', error)
      throw error
    }
  }

  async verifyEmail (token: string): Promise<void> {
    try {
      const player = await this.playerRepository.findByEmailVerificationToken(token)
      if (!player) {
        throw new AppError('Invalid verification token', 400)
      }

      await this.playerRepository.verifyEmail(player.id)

      logger.info(`Email verified for: ${player.email}`)
    } catch (error) {
      logger.error('Verify email error:', error)
      throw error
    }
  }

  async resendVerificationEmail (playerId: string): Promise<void> {
    try {
      const player = await this.playerRepository.findById(playerId)
      if (!player) {
        throw new AppError('Player not found', 404)
      }

      if (player.isVerified) {
        throw new AppError('Email already verified', 400)
      }

      // Generate new verification token
      const verificationToken = SecurityUtils.generateSecureToken()
      await this.playerRepository.setEmailVerificationToken(playerId, verificationToken)

      // Send verification email
      await this.emailService.sendVerificationEmail(player.email, verificationToken)

      logger.info(`Verification email resent to: ${player.email}`)
    } catch (error) {
      logger.error('Resend verification error:', error)
      throw error
    }
  }

  async getPlayers (query: GetPlayersQueryDto): Promise<{
    players: PublicPlayerDto[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const result = await this.playerRepository.findMany(query)

      return {
        players: result.players.map(player => this.toPublicPlayer(player)),
        pagination: {
          page: query.page,
          limit: query.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      }
    } catch (error) {
      logger.error('Get players error:', error)
      throw error
    }
  }

  async getLeaderboard (limit: number): Promise<PublicPlayerDto[]> {
    try {
      const players = await this.playerRepository.getLeaderboard(limit)
      return players.map(player => this.toPublicPlayer(player))
    } catch (error) {
      logger.error('Get leaderboard error:', error)
      throw error
    }
  }

  async deleteAccount (id: string, password: string): Promise<void> {
    try {
      const player = await this.playerRepository.findById(id)
      if (!player) {
        throw new AppError('Player not found', 404)
      }

      // Verify password before deletion
      const isPasswordValid = await SecurityUtils.comparePassword(password, player.password)
      if (!isPasswordValid) {
        throw new AppError('Invalid password', 400)
      }

      // Soft delete (deactivate account)
      await this.playerRepository.softDelete(id)

      // Clear all sessions
      await this.redisService.deleteRefreshToken(id)

      logger.info(`Account deleted for player: ${player.username}`)
    } catch (error) {
      logger.error('Delete account error:', error)
      throw error
    }
  }

  // Helper methods to transform Player to DTOs
  private toPublicPlayer (player: Player): PublicPlayerDto {
    return {
      id: player.id,
      username: player.username,
      firstName: player.firstName,
      lastName: player.lastName,
      avatar: player.avatar,
      bio: player.bio,
      totalScore: player.totalScore,
      gamesPlayed: player.gamesPlayed,
      gamesWon: player.gamesWon,
      longestWord: player.longestWord,
      averageScore: player.averageScore,
      createdAt: player.createdAt
    }
  }

  private toPrivatePlayer (player: Player): PrivatePlayerDto {
    return {
      ...this.toPublicPlayer(player),
      email: player.email,
      isActive: player.isActive,
      isVerified: player.isVerified,
      lastLogin: player.lastLogin,
      updatedAt: player.updatedAt
    }
  }
}

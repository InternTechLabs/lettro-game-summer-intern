import { type Request, type Response, NextFunction } from 'express'
import { SecurityUtils } from '@/utils/securityUtils'
import {
  CreatePlayerSchema,
  LoginPlayerSchema,
  UpdatePlayerSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema
} from '@/dto/player.dto'
import { HTTP_STATUS, MESSAGES } from '@/constants'
import { ValidationError, AuthenticationError } from '@/utils/errorsUtils'
import { PlayerService } from '@/services/player.services'
import { asyncHandler } from '../middleware/error'

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      id: string
      // add other user properties if needed
    }
    interface Request {
      user?: User
    }
  }
}

export class PlayerController {
  private readonly playerService: PlayerService

  constructor () {
    this.playerService = new PlayerService()
  }

  // POST /api/players/register
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = CreatePlayerSchema.parse(req.body)

    const result = await this.playerService.register(validatedData)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.PLAYER_CREATED,
      data: {
        player: result.player,
        accessToken: result.accessToken
      }
    })
  })

  // POST /api/players/login
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = LoginPlayerSchema.parse(req.body)
    const clientIP = SecurityUtils.extractClientIP(req)

    const result = await this.playerService.login(validatedData, clientIP)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
      data: {
        player: result.player,
        accessToken: result.accessToken
      }
    })
  })

  // POST /api/players/logout
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user?.id

    if (playerId) {
      await this.playerService.logout(playerId)
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGOUT_SUCCESS
    })
  })

  // POST /api/players/refresh-token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required')
    }

    const result = await this.playerService.refreshToken(refreshToken)

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.TOKEN_REFRESHED,
      data: {
        accessToken: result.accessToken
      }
    })
  })

  // GET /api/players/profile
  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id

    const player = await this.playerService.getPlayerById(playerId, true)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: { player }
    })
  })

  // PUT /api/players/profile
  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    const validatedData = UpdatePlayerSchema.parse(req.body)

    const player = await this.playerService.updatePlayer(playerId, validatedData)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PLAYER_UPDATED,
      data: { player }
    })
  })

  // POST /api/players/change-password
  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    const validatedData = ChangePasswordSchema.parse(req.body)

    await this.playerService.changePassword(playerId, validatedData)

    // Clear all refresh tokens to force re-login on all devices
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_CHANGED
    })
  })

  // POST /api/players/forgot-password
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = ForgotPasswordSchema.parse(req.body)

    await this.playerService.forgotPassword(validatedData.email)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_RESET_SENT
    })
  })

  // POST /api/players/reset-password
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = ResetPasswordSchema.parse(req.body)

    await this.playerService.resetPassword(validatedData.token, validatedData.newPassword)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_RESET_SUCCESS
    })
  })

  // POST /api/players/verify-email
  verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = VerifyEmailSchema.parse(req.body)

    await this.playerService.verifyEmail(validatedData.token)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.EMAIL_VERIFIED
    })
  })

  // POST /api/players/resend-verification
  resendVerification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id

    await this.playerService.resendVerificationEmail(playerId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.EMAIL_VERIFICATION_SENT
    })
  })

  // GET /api/players/username/:username
  getPlayerByUsername = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params

    // Basic username validation
    if (!username || username.length < 3 || username.length > 30) {
      throw new ValidationError('Invalid username format')
    }

    const player = await this.playerService.getPlayerByUsername(username)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: { player }
    })
  })
}

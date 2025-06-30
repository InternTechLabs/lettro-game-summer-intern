
import { Request, Response, NextFunction } from 'express'

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      id: string;
      // add other user properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}
import { SecurityUtils } from '@/utils/securityUtils'
import { 
  CreatePlayerSchema,
  LoginPlayerSchema,
  UpdatePlayerSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  GetPlayersQuerySchema,
  DeleteAccountSchema
} from '@/dto/player.dto'
import { HTTP_STATUS, MESSAGES } from '@/constants'
import { ValidationError, NotFoundError, AuthenticationError } from '@/utils/errorsUtils'
import { PlayerService } from '@/services/player.services';
import { asyncHandler } from '../middleware/error';

export class PlayerController {
  private playerService: PlayerService

  constructor() {
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.PLAYER_CREATED,
      data: {
        player: result.player,
        accessToken: result.accessToken,
      },
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
      data: {
        player: result.player,
        accessToken: result.accessToken,
      },
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
      sameSite: 'strict',
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGOUT_SUCCESS,
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.TOKEN_REFRESHED,
      data: {
        accessToken: result.accessToken,
      },
    })
  })

  // GET /api/players/profile
  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    
    const player = await this.playerService.getPlayerById(playerId, true)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: { player },
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
      data: { player },
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
      sameSite: 'strict',
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_CHANGED,
    })
  })

  // POST /api/players/forgot-password
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = ForgotPasswordSchema.parse(req.body)
    
    await this.playerService.forgotPassword(validatedData.email)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_RESET_SENT,
    })
  })

  // POST /api/players/reset-password
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = ResetPasswordSchema.parse(req.body)
    
    await this.playerService.resetPassword(validatedData.token, validatedData.newPassword)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_RESET_SUCCESS,
    })
  })

  // POST /api/players/verify-email
  verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = VerifyEmailSchema.parse(req.body)
    
    await this.playerService.verifyEmail(validatedData.token)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.EMAIL_VERIFIED,
    })
  })

  // POST /api/players/resend-verification
  resendVerification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    
    await this.playerService.resendVerificationEmail(playerId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.EMAIL_VERIFICATION_SENT,
    })
  })

  // GET /api/players
  getPlayers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = GetPlayersQuerySchema.parse(req.query)
    
    const result = await this.playerService.getPlayers(query)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: result,
    })
  })

  // GET /api/players/:id
  getPlayerById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    
    // Validate ID format (assuming UUID)
    if (!SecurityUtils.isValidUUID(id)) {
      throw new ValidationError('Invalid player ID format')
    }
    
    const isOwnProfile = req.user?.id === id
    const player = await this.playerService.getPlayerById(id, isOwnProfile)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: { player },
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
      data: { player },
    })
  })

  // GET /api/players/leaderboard
  getLeaderboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100) // Cap at 100
    const sortBy = (req.query.sortBy as string) || 'totalScore'
    
    // Validate sortBy parameter
    const allowedSortFields = ['totalScore', 'gamesWon', 'averageScore', 'longestWord']
    if (!allowedSortFields.includes(sortBy)) {
      throw new ValidationError('Invalid sort field')
    }
    
    const leaderboard = await this.playerService.getLeaderboard(limit, sortBy)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: { leaderboard },
    })
  })

  // GET /api/players/search
  searchPlayers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { query: searchQuery, limit = 10, page = 1 } = req.query
    
    if (!searchQuery || typeof searchQuery !== 'string') {
      throw new ValidationError('Search query is required')
    }
    
    if (searchQuery.length < 2) {
      throw new ValidationError('Search query must be at least 2 characters')
    }
    
    const searchLimit = Math.min(parseInt(limit as string), 50) // Cap at 50
    const searchPage = Math.max(parseInt(page as string), 1)
    
    const result = await this.playerService.searchPlayers(searchQuery, {
      limit: searchLimit,
      page: searchPage
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: result,
    })
  })

  // GET /api/players/stats
  getPlayerStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    
    const stats = await this.playerService.getPlayerStats(playerId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: { stats },
    })
  })

  // POST /api/players/upload-avatar
  uploadAvatar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    
    if (!req.file) {
      throw new ValidationError('Avatar file is required')
    }
    
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new ValidationError('Invalid file type. Only JPEG, PNG, and WebP are allowed')
    }
    
    if (req.file.size > maxSize) {
      throw new ValidationError('File size too large. Maximum 5MB allowed')
    }
    
    const avatarUrl = await this.playerService.uploadAvatar(playerId, req.file)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.AVATAR_UPLOADED,
      data: { avatarUrl },
    })
  })

  // DELETE /api/players/avatar
  deleteAvatar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    
    await this.playerService.deleteAvatar(playerId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.AVATAR_DELETED,
    })
  })

  // DELETE /api/players/profile
  deleteAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    const validatedData = DeleteAccountSchema.parse(req.body)

    if (!validatedData.password) {
      throw new ValidationError('Password is required to delete account')
    }

    // Additional confirmation check
    if (validatedData.confirmation !== 'DELETE') {
      throw new ValidationError('Please type DELETE to confirm account deletion')
    }

    await this.playerService.deleteAccount(playerId, validatedData.password)

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.ACCOUNT_DELETED,
    })
  })

  // POST /api/players/deactivate
  deactivateAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    const { password } = req.body

    if (!password) {
      throw new ValidationError('Password is required to deactivate account')
    }

    await this.playerService.deactivateAccount(playerId, password)

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.ACCOUNT_DEACTIVATED,
    })
  })

  // POST /api/players/reactivate
  reactivateAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ValidationError('Email and password are required')
    }

    const result = await this.playerService.reactivateAccount(email, password)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.ACCOUNT_REACTIVATED,
      data: {
        player: result.player,
        accessToken: result.accessToken,
      },
    })
  })

  // GET /api/players/activity-log
  getActivityLog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    const { limit = 20, page = 1 } = req.query
    
    const activityLimit = Math.min(parseInt(limit as string), 100)
    const activityPage = Math.max(parseInt(page as string), 1)
    
    const result = await this.playerService.getActivityLog(playerId, {
      limit: activityLimit,
      page: activityPage
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: result,
    })
  })

  // POST /api/players/report
  reportPlayer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reporterId = req.user!.id
    const { reportedPlayerId, reason, description } = req.body

    if (!reportedPlayerId || !reason) {
      throw new ValidationError('Reported player ID and reason are required')
    }

    if (reporterId === reportedPlayerId) {
      throw new ValidationError('Cannot report yourself')
    }

    const allowedReasons = ['harassment', 'cheating', 'inappropriate_content', 'spam', 'other']
    if (!allowedReasons.includes(reason)) {
      throw new ValidationError('Invalid report reason')
    }

    await this.playerService.reportPlayer(reporterId, reportedPlayerId, reason, description)

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.REPORT_SUBMITTED,
    })
  })

  // POST /api/players/block
  blockPlayer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const blockerId = req.user!.id
    const { blockedPlayerId } = req.body

    if (!blockedPlayerId) {
      throw new ValidationError('Player ID to block is required')
    }

    if (blockerId === blockedPlayerId) {
      throw new ValidationError('Cannot block yourself')
    }

    await this.playerService.blockPlayer(blockerId, blockedPlayerId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PLAYER_BLOCKED,
    })
  })

  // DELETE /api/players/block/:blockedPlayerId
  unblockPlayer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const blockerId = req.user!.id
    const { blockedPlayerId } = req.params

    if (!blockedPlayerId) {
      throw new ValidationError('Player ID to unblock is required')
    }

    await this.playerService.unblockPlayer(blockerId, blockedPlayerId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PLAYER_UNBLOCKED,
    })
  })

  // GET /api/players/blocked
  getBlockedPlayers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const playerId = req.user!.id
    
    const blockedPlayers = await this.playerService.getBlockedPlayers(playerId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_RETRIEVED,
      data: { blockedPlayers },
    })
  })
}
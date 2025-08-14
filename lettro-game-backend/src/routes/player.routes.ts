import { Router } from 'express'
import { PlayerController } from '@/api/controllers/player.controller'

const router = Router()
const playerController = new PlayerController()

router.post('/register', playerController.register)
router.post('/login', playerController.login)
router.post('/logout', playerController.logout)
router.post('/refresh-token', playerController.refreshToken)
router.get('/profile', playerController.getProfile)
router.put('/profile', playerController.updateProfile)
router.post('/change-password', playerController.changePassword)
router.post('/forgot-password', playerController.forgotPassword)
router.post('/reset-password', playerController.resetPassword)
router.post('/verify-email', playerController.verifyEmail)
router.post('/resend-verification', playerController.resendVerification)
router.get('/username/:username', playerController.getPlayerByUsername)

export default router

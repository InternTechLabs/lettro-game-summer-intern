import nodemailer from 'nodemailer'
import { env } from '@/config/env'
import { logger } from '@/config/logger'
import { emailTemplates } from '@/templates/emailTemplates'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: env.NODE_ENV === 'production'
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14
    })

    this.verifyConnection()
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify()
      logger.info('SMTP connection verified successfully')
    } catch (error) {
      logger.error('SMTP connection verification failed:', error)
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`
    const mailOptions = {
      from: `"Lettro Game" <${env.SMTP_FROM}>`,
      to: email,
      subject: 'Verify Your Email - Lettro Game',
      html: emailTemplates.verification(verificationUrl),
      text: `Verify your email here: ${verificationUrl}`,
    }

    await this.send(mailOptions, 'verification')
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`
    const mailOptions = {
      from: `"Lettro Game" <${env.SMTP_FROM}>`,
      to: email,
      subject: 'Password Reset - Lettro Game',
      html: emailTemplates.reset(resetUrl),
      text: `Reset your password here: ${resetUrl}`,
    }

    await this.send(mailOptions, 'password reset')
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const mailOptions = {
      from: `"Lettro Game" <${env.SMTP_FROM}>`,
      to: email,
      subject: 'Welcome to Lettro Game!',
      html: emailTemplates.welcome(username, `${env.FRONTEND_URL}/dashboard`, `${env.FRONTEND_URL}/guide`),
      text: `Welcome to Lettro Game, ${username}!`,
    }

    await this.send(mailOptions, 'welcome', false)
  }

  async sendAccountDeactivationEmail(email: string, username: string): Promise<void> {
    const mailOptions = {
      from: `"Lettro Game" <${env.SMTP_FROM}>`,
      to: email,
      subject: 'Account Deactivated - Lettro Game',
      html: emailTemplates.deactivation(username),
      text: `Your account is deactivated, ${username}.`,
    }

    await this.send(mailOptions, 'deactivation')
  }

  private async send(mailOptions: nodemailer.SendMailOptions, type: string, throwOnError = true): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions)
      logger.info(`${type[0].toUpperCase() + type.slice(1)} email sent to: ${mailOptions.to}`)
    } catch (error) {
      logger.error(`Failed to send ${type} email:`, error)
      if (throwOnError) throw new Error(`Failed to send ${type} email`)
    }
  }
}
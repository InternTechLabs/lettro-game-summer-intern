// src/utils/security.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '@/config/env';

export class SecurityUtils {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // JWT token generation and verification
  static generateAccessToken(payload: { id: string; username: string; email: string }): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      issuer: 'lettro-game',
      audience: 'lettro-players',
      algorithm: 'HS256',
    });
  }

  static generateRefreshToken(payload: { id: string }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'lettro-game',
      audience: 'lettro-players',
      algorithm: 'HS256',
    });
  }

  static verifyAccessToken(token: string): { id: string; username: string; email: string } {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        issuer: 'lettro-game',
        audience: 'lettro-players',
      }) as { id: string; username: string; email: string };
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  static getUserFromAccessToken(req: { headers: { authorization?: string } }): {
    id: string;
    username: string;
    email: string;
  } {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No access token provided');
    }

    const token = authHeader.split(' ')[1];
    return this.verifyAccessToken(token);
  }

  static verifyRefreshToken(token: string): { id: string } {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        issuer: 'lettro-game',
        audience: 'lettro-players',
      }) as { id: string };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Random token generation
  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Data encryption/decryption (for sensitive data at rest)
  static encrypt(text: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    cipher.setAAD(Buffer.from('lettro-game', 'utf8'));

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  static decrypt(encryptedData: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(env.ENCRYPTION_KEY, 'hex');

    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAAD(Buffer.from('lettro-game', 'utf8'));
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes to prevent injection
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  // Rate limiting helpers
  static generateRateLimitKey(identifier: string, action: string): string {
    return `rate_limit:${action}:${identifier}`;
  }

  // Session security
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // CSRF protection
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  static verifyCSRFToken(token: string, sessionToken: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'base64'),
      Buffer.from(sessionToken, 'base64'),
    );
  }

  // Password strength validation
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password should contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password should contain uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Password should contain numbers');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Password should contain special characters');

    // Common patterns to avoid
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Avoid repeating characters');
    }

    if (/123|abc|qwe/i.test(password)) {
      score -= 1;
      feedback.push('Avoid common sequences');
    }

    return {
      isValid: score >= 4,
      score: Math.max(0, Math.min(5, score)),
      feedback,
    };
  }

  // Account lockout helpers
  static calculateLockoutDuration(attempts: number): number {
    // Exponential backoff: 5min, 15min, 30min, 1hr, 2hr, etc.
    const baseMinutes = 5;
    return baseMinutes * Math.pow(2, Math.min(attempts - 5, 6)) * 60 * 1000;
  }

  static isAccountLocked(lockUntil: Date | null): boolean {
    return lockUntil !== null && lockUntil > new Date();
  }

  // IP address validation and extraction
  static extractClientIP(req: any): string {
    return (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown'
    );
  }

  static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
}

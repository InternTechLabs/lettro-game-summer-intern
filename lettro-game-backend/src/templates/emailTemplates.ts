const baseStyles = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
  .content { padding: 30px 20px; }
  .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; background: #f9f9f9; }
`;

export const emailTemplates = {
  verification: (url: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
      <style>
        ${baseStyles}
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🎮 Lettro Game</h1></div>
        <div class="content">
          <h2>Verify Your Email</h2>
          <p>Please click the button below to verify your email:</p>
          <p><a href="${url}" class="button">Verify Email</a></p>
          <div class="warning">This link will expire in 24 hours.</div>
          <p>If the button doesn't work, copy and paste this URL:</p>
          <p style="word-break: break-all;">${url}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Lettro Game</p>
        </div>
      </div>
    </body>
    </html>
  `,

  reset: (url: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Password</title>
      <style>
        ${baseStyles}
        .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
        .button { display: inline-block; padding: 12px 30px; background: #DC2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fee2e2; border: 1px solid #fecaca; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🔐 Reset Password</h1></div>
        <div class="content">
          <p>Click the button below to reset your password:</p>
          <p><a href="${url}" class="button">Reset Password</a></p>
          <div class="warning">This link will expire in 1 hour.</div>
          <p>If the button doesn't work, copy and paste this URL:</p>
          <p style="word-break: break-all;">${url}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Lettro Game</p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcome: (username: string, dashboardUrl: string, guideUrl: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome</title>
      <style>
        ${baseStyles}
        .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 30px; text-align: center; }
        .button { display: inline-block; padding: 15px 35px; background: #4F46E5; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🎉 Welcome, ${username}!</h1></div>
        <div class="content">
          <p>Get started with the Lettro Game experience:</p>
          <ul>
            <li>Play word puzzles</li>
            <li>Compete with friends</li>
            <li>Track your progress</li>
          </ul>
          <p><a href="${dashboardUrl}" class="button">Go to Dashboard</a></p>
          <p>Need help? <a href="${guideUrl}">Check our guide</a></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Lettro Game</p>
        </div>
      </div>
    </body>
    </html>
  `,

  deactivation: (username: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Account Deactivated</title>
      <style>
        ${baseStyles}
        .header { background: #6B7280; color: white; padding: 20px; text-align: center; }
        .info-box { background: #f3f4f6; border-left: 4px solid #6B7280; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Account Deactivated</h1></div>
        <div class="content">
          <p>Hello ${username},</p>
          <p>Your account has been deactivated. If this was a mistake, contact support within 30 days.</p>
          <div class="info-box">
            <p>Your data is preserved. You won’t receive any further emails.</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Lettro Game</p>
        </div>
      </div>
    </body>
    </html>
  `
}
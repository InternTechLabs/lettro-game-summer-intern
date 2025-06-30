export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    PLAYER_CREATED: 'Player created successfully',
    PLAYER_UPDATED: 'Player updated successfully',
    PLAYER_DELETED: 'Player deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
    EMAIL_VERIFICATION_SENT: 'Verification email sent',
    PROFILE_UPDATED: 'Profile updated successfully',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    DATA_RETRIEVED: 'Data retrieved successfully',
    OPERATION_COMPLETED: 'Operation completed successfully',
    PLAYER_BLOCKED: 'Player blocked successfully',
    AVATAR_UPLOADED: 'Avatar uploaded successfully',
    AVATAR_DELETED: 'Avatar deleted successfully',
    ACCOUNT_DELETED: 'Account deleted successfully',
    ACCOUNT_DEACTIVATED: 'Account deactivated successfully',
    ACCOUNT_REACTIVATED: 'Account reactivated successfully',
    REPORT_SUBMITTED: 'Report submitted successfully',
    PLAYER_UNBLOCKED: 'Player unblocked successfully',
  },

  // Error Messages
  ERROR: {
    // General
    INTERNAL_SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    METHOD_NOT_ALLOWED: 'Method not allowed',
    TOO_MANY_REQUESTS: 'Too many requests',
    VALIDATION_ERROR: 'Validation error',
    OPERATION_FAILED: 'Operation failed',

    // Authentication & Authorization
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_LOCKED: 'Account is temporarily locked due to multiple failed login attempts',
    ACCOUNT_INACTIVE: 'Account is inactive',
    ACCOUNT_NOT_VERIFIED: 'Please verify your email address',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    TOKEN_MISSING: 'Access token is required',
    REFRESH_TOKEN_INVALID: 'Invalid refresh token',
    SESSION_EXPIRED: 'Session has expired',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',

    // Player Related
    PLAYER_NOT_FOUND: 'Player not found',
    PLAYER_ALREADY_EXISTS: 'Player already exists',
    USERNAME_TAKEN: 'Username is already taken',
    EMAIL_TAKEN: 'Email is already registered',
    INVALID_PLAYER_ID: 'Invalid player ID',
    PLAYER_CREATION_FAILED: 'Failed to create player',
    PLAYER_UPDATE_FAILED: 'Failed to update player',
    PLAYER_DELETE_FAILED: 'Failed to delete player',

    // Password Related
    WEAK_PASSWORD: 'Password does not meet security requirements',
    PASSWORD_MISMATCH: 'Passwords do not match',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    PASSWORD_RESET_TOKEN_INVALID: 'Invalid or expired password reset token',
    PASSWORD_RESET_FAILED: 'Failed to reset password',

    // Email Related
    EMAIL_INVALID: 'Invalid email address',
    EMAIL_VERIFICATION_TOKEN_INVALID: 'Invalid or expired email verification token',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',
    EMAIL_SEND_FAILED: 'Failed to send email',

    // Game Related
    GAME_NOT_FOUND: 'Game not found',
    GAME_FULL: 'Game is full',
    GAME_ALREADY_STARTED: 'Game has already started',
    GAME_NOT_STARTED: 'Game has not started yet',
    GAME_FINISHED: 'Game has finished',
    INVALID_GAME_STATE: 'Invalid game state',
    ALREADY_IN_GAME: 'Player is already in this game',
    NOT_IN_GAME: 'Player is not in this game',

    // Validation Related
    REQUIRED_FIELD_MISSING: 'Required field is missing',
    INVALID_FORMAT: 'Invalid format',
    INVALID_LENGTH: 'Invalid length',
    INVALID_CHARACTERS: 'Contains invalid characters',
    INVALID_RANGE: 'Value out of range',

    // Database Related
    DATABASE_ERROR: 'Database operation failed',
    CONSTRAINT_VIOLATION: 'Database constraint violation',
    RECORD_NOT_FOUND: 'Record not found',
    DUPLICATE_ENTRY: 'Duplicate entry',

    // Network Related
    NETWORK_ERROR: 'Network error',
    TIMEOUT_ERROR: 'Request timeout',
    CONNECTION_ERROR: 'Connection error',

    // File Related
    FILE_NOT_FOUND: 'File not found',
    FILE_TOO_LARGE: 'File size exceeds limit',
    INVALID_FILE_TYPE: 'Invalid file type',
    UPLOAD_FAILED: 'File upload failed',
  },

  // Validation Messages
  VALIDATION: {
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_MIN_LENGTH: 'Username must be at least 3 characters',
    USERNAME_MAX_LENGTH: 'Username must be less than 50 characters',
    USERNAME_INVALID_CHARS: 'Username can only contain letters, numbers, underscore and dash',
    
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Invalid email format',
    EMAIL_MAX_LENGTH: 'Email must be less than 255 characters',
    
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    PASSWORD_MAX_LENGTH: 'Password must be less than 128 characters',
    PASSWORD_COMPLEXITY: 'Password must contain uppercase, lowercase, number and special character',
    
    FIRST_NAME_MAX_LENGTH: 'First name must be less than 100 characters',
    LAST_NAME_MAX_LENGTH: 'Last name must be less than 100 characters',
    BIO_MAX_LENGTH: 'Bio must be less than 500 characters',
    
    PAGE_MIN: 'Page must be at least 1',
    LIMIT_MIN: 'Limit must be at least 1',
    LIMIT_MAX: 'Limit must be less than 100',
  },
} as const
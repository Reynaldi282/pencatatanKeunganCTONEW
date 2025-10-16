const { z } = require('zod');

const emailSchema = z.string().trim().toLowerCase().email();

const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().trim().min(1).max(120).optional()
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token is required')
});

const logoutSchema = refreshSchema;

const googleAuthSchema = z.object({
  idToken: z.string().min(10, 'Google ID token is required')
});

const requestPasswordResetSchema = z.object({
  email: emailSchema
});

const confirmPasswordResetSchema = z.object({
  token: z.string().min(10, 'Reset token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long')
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  googleAuthSchema,
  requestPasswordResetSchema,
  confirmPasswordResetSchema
};

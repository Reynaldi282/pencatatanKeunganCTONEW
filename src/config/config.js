const ms = require('ms');

function durationToMs(value, fallback) {
  if (!value) {
    return fallback;
  }
  const parsed = ms(value);
  if (typeof parsed === 'number') {
    return parsed;
  }
  return fallback;
}

const config = {
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000'
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  },
  refreshTokens: {
    expiresInMs: durationToMs(process.env.REFRESH_TOKEN_EXPIRES_IN, ms('7d'))
  },
  passwordReset: {
    expiresInMs: durationToMs(process.env.PASSWORD_RESET_EXPIRES_IN, ms('1h'))
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'test-google-client'
  },
  email: {
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    transport: process.env.EMAIL_TRANSPORT || 'json'
  }
};

module.exports = config;

const { v4: uuid } = require('uuid');
const config = require('../config/config');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { generateTokenValue, hashToken } = require('../utils/tokenUtils');
const {
  AuthenticationError,
  BadRequestError,
  TokenError
} = require('../utils/errors');

class AuthService {
  constructor({
    userService,
    tokenService,
    passwordResetRepository,
    emailService,
    googleAuthService
  }) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.passwordResetRepository = passwordResetRepository;
    this.emailService = emailService;
    this.googleAuthService = googleAuthService;
  }

  async register({ email, password, name = '' }) {
    const passwordHash = await hashPassword(password);
    const user = await this.userService.createUser({
      email,
      passwordHash,
      name,
      provider: 'local'
    });
    const tokens = await this.tokenService.generateTokensForUser(user);
    return { user, tokens };
  }

  async login({ email, password }) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      throw new AuthenticationError('Invalid credentials');
    }
    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
      throw new AuthenticationError('Invalid credentials');
    }
    const publicUser = this.userService.toPublicUser(user);
    const tokens = await this.tokenService.generateTokensForUser(publicUser);
    return { user: publicUser, tokens };
  }

  async logout({ refreshToken }) {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }
    await this.tokenService.revokeRefreshToken(refreshToken, 'logout');
  }

  async refresh({ refreshToken }) {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }
    const { user, accessToken, refreshToken: newRefreshToken } = await this.tokenService.rotateRefreshToken(refreshToken);
    const publicUser = this.userService.toPublicUser(user);
    return {
      user: publicUser,
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    };
  }

  async getProfile(userId) {
    const user = await this.userService.ensureUserById(userId);
    return this.userService.toPublicUser(user);
  }

  async updateProfile(userId, updates) {
    const allowedUpdates = {};
    if (typeof updates.name === 'string') {
      allowedUpdates.name = updates.name;
    }
    const user = await this.userService.updateProfile(userId, allowedUpdates);
    return user;
  }

  async googleAuth({ idToken }) {
    const payload = await this.googleAuthService.verifyIdToken(idToken);
    const googleId = payload.sub;
    const email = payload.email;
    const emailVerified = payload.email_verified ?? payload.emailVerified;
    const name = payload.name || '';

    if (!email) {
      throw new AuthenticationError('Google account does not have an email address');
    }
    if (emailVerified === false) {
      throw new AuthenticationError('Google email address must be verified');
    }
    if (!googleId) {
      throw new AuthenticationError('Google account identifier is missing');
    }

    let user = await this.userService.getUserByGoogleId(googleId);
    if (!user) {
      const existingByEmail = await this.userService.getUserByEmail(email);
      if (existingByEmail) {
        await this.userService.linkGoogleAccount(existingByEmail.id, googleId);
        user = await this.userService.getUserById(existingByEmail.id);
      } else {
        user = await this.userService.createUser({
          email,
          name,
          provider: 'google',
          googleId,
          passwordHash: null
        });
      }
    }

    const publicUser = this.userService.toPublicUser(user);
    const tokens = await this.tokenService.generateTokensForUser(publicUser);
    return { user: publicUser, tokens };
  }

  async requestPasswordReset(email) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      // Avoid user enumeration; respond success regardless
      return;
    }

    const tokenId = uuid();
    const tokenValue = generateTokenValue(32);
    const combined = `${tokenValue}.${config.jwt.refreshSecret}`;
    const tokenHash = hashToken(combined);
    const expiresAt = new Date(Date.now() + config.passwordReset.expiresInMs);

    await this.passwordResetRepository.createToken({
      tokenId,
      userId: user.id,
      tokenHash,
      expiresAt
    });

    const plainToken = `${tokenId}.${tokenValue}`;
    await this.emailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      token: plainToken
    });
  }

  async confirmPasswordReset({ token, newPassword }) {
    const { tokenId, tokenValue } = this._decodePasswordResetToken(token);
    const record = await this.passwordResetRepository.findById(tokenId);
    if (!record) {
      throw new TokenError('Password reset token not found');
    }
    if (record.usedAt) {
      throw new TokenError('Password reset token already used');
    }
    if (record.expiresAt < new Date()) {
      throw new TokenError('Password reset token has expired');
    }

    const expectedHash = hashToken(`${tokenValue}.${config.jwt.refreshSecret}`);
    if (expectedHash !== record.tokenHash) {
      throw new TokenError('Password reset token mismatch');
    }

    const user = await this.userService.getUserById(record.userId);
    if (!user) {
      throw new TokenError('User associated with token no longer exists');
    }

    const passwordHash = await hashPassword(newPassword);
    await this.userService.setPassword(user.id, passwordHash);
    await this.passwordResetRepository.markUsed(tokenId);
  }

  _decodePasswordResetToken(rawToken) {
    if (!rawToken || typeof rawToken !== 'string') {
      throw new TokenError('Invalid token format');
    }
    const parts = rawToken.split('.');
    if (parts.length !== 2) {
      throw new TokenError('Invalid token structure');
    }
    const [tokenId, tokenValue] = parts;
    if (!tokenId || !tokenValue) {
      throw new TokenError('Invalid token payload');
    }
    return { tokenId, tokenValue };
  }
}

module.exports = AuthService;

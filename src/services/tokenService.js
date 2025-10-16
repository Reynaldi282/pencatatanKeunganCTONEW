const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const config = require('../config/config');
const { hashToken, generateTokenValue } = require('../utils/tokenUtils');
const { AuthenticationError, TokenError } = require('../utils/errors');

class TokenService {
  constructor(refreshTokenRepository, userRepository, options = {}) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.userRepository = userRepository;
    this.accessSecret = options.accessSecret || config.jwt.accessSecret;
    this.accessExpiresIn = options.accessExpiresIn || config.jwt.accessExpiresIn;
    this.refreshSecret = options.refreshSecret || config.jwt.refreshSecret;
    this.refreshExpiresInMs = options.refreshExpiresInMs || config.refreshTokens.expiresInMs;
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name
      },
      this.accessSecret,
      { expiresIn: this.accessExpiresIn }
    );
  }

  async generateRefreshToken(user, previousTokenId = null) {
    const tokenId = uuid();
    const tokenValue = generateTokenValue(48);
    const combined = `${tokenValue}.${this.refreshSecret}`;
    const tokenHash = hashToken(combined);
    const expiresAt = new Date(Date.now() + this.refreshExpiresInMs);

    await this.refreshTokenRepository.createToken({
      tokenId,
      userId: user.id,
      tokenHash,
      expiresAt
    });

    if (previousTokenId) {
      await this.refreshTokenRepository.markReplaced(previousTokenId, tokenId);
    }

    const refreshToken = `${tokenId}.${tokenValue}`;
    return refreshToken;
  }

  async generateTokensForUser(user, previousRefreshTokenId = null) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, previousRefreshTokenId);
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessSecret);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  async verifyRefreshToken(rawToken) {
    const { tokenId, tokenValue } = this.decodeRefreshToken(rawToken);
    const record = await this.refreshTokenRepository.findById(tokenId);
    if (!record) {
      throw new TokenError('Refresh token not found');
    }
    if (record.revokedAt) {
      throw new TokenError('Refresh token has been revoked');
    }
    if (record.expiresAt < new Date()) {
      throw new TokenError('Refresh token has expired');
    }

    const expectedHash = hashToken(`${tokenValue}.${this.refreshSecret}`);
    if (expectedHash !== record.tokenHash) {
      throw new TokenError('Refresh token signature mismatch');
    }

    const user = await this.userRepository.findById(record.userId);
    if (!user) {
      throw new TokenError('Associated user not found for token');
    }

    return { record, user, tokenValue };
  }

  decodeRefreshToken(rawToken) {
    if (!rawToken || typeof rawToken !== 'string') {
      throw new TokenError('Invalid refresh token format');
    }
    const parts = rawToken.split('.');
    if (parts.length !== 2) {
      throw new TokenError('Invalid refresh token structure');
    }
    const [tokenId, tokenValue] = parts;
    if (!tokenId || !tokenValue) {
      throw new TokenError('Invalid refresh token payload');
    }
    return { tokenId, tokenValue };
  }

  async rotateRefreshToken(rawToken) {
    const { record, user } = await this.verifyRefreshToken(rawToken);
    const tokens = await this.generateTokensForUser(user, record.tokenId);
    return { user, ...tokens };
  }

  async revokeRefreshToken(rawToken, reason = 'logout') {
    const { record } = await this.verifyRefreshToken(rawToken);
    await this.refreshTokenRepository.revokeToken(record.tokenId, reason);
  }
}

module.exports = TokenService;

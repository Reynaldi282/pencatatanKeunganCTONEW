function clone(record) {
  if (!record) return null;
  return { ...record };
}

class RefreshTokenRepository {
  constructor() {
    this.tokens = new Map();
  }

  async createToken({ tokenId, userId, tokenHash, expiresAt, replacedByTokenId = null, revokedAt = null, revokedReason = null, createdAt = new Date() }) {
    const record = {
      tokenId,
      userId,
      tokenHash,
      expiresAt,
      replacedByTokenId,
      revokedAt,
      revokedReason,
      createdAt
    };
    this.tokens.set(tokenId, record);
    return clone(record);
  }

  async findById(tokenId) {
    return clone(this.tokens.get(tokenId));
  }

  async revokeToken(tokenId, reason = 'revoked') {
    const record = this.tokens.get(tokenId);
    if (!record) return null;
    const updated = {
      ...record,
      revokedAt: new Date(),
      revokedReason: reason
    };
    this.tokens.set(tokenId, updated);
    return clone(updated);
  }

  async markReplaced(tokenId, newTokenId) {
    const record = this.tokens.get(tokenId);
    if (!record) return null;
    const updated = {
      ...record,
      replacedByTokenId: newTokenId,
      revokedAt: new Date(),
      revokedReason: 'replaced'
    };
    this.tokens.set(tokenId, updated);
    return clone(updated);
  }
}

module.exports = RefreshTokenRepository;

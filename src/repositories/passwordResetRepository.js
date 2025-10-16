function clone(record) {
  if (!record) return null;
  return { ...record };
}

class PasswordResetRepository {
  constructor() {
    this.tokens = new Map();
  }

  async createToken({ tokenId, userId, tokenHash, expiresAt, usedAt = null, createdAt = new Date() }) {
    const record = {
      tokenId,
      userId,
      tokenHash,
      expiresAt,
      usedAt,
      createdAt
    };
    this.tokens.set(tokenId, record);
    return clone(record);
  }

  async findById(tokenId) {
    return clone(this.tokens.get(tokenId));
  }

  async markUsed(tokenId) {
    const record = this.tokens.get(tokenId);
    if (!record) return null;
    const updated = {
      ...record,
      usedAt: new Date()
    };
    this.tokens.set(tokenId, updated);
    return clone(updated);
  }

  async deleteToken(tokenId) {
    this.tokens.delete(tokenId);
  }
}

module.exports = PasswordResetRepository;

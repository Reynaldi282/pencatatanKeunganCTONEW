const { v4: uuid } = require('uuid');

function cloneUser(user) {
  if (!user) return null;
  return { ...user };
}

class UserRepository {
  constructor() {
    this.users = new Map();
    this.usersByEmail = new Map();
    this.usersByGoogleId = new Map();
  }

  async createUser({ email, passwordHash = null, name = '', provider = 'local', googleId = null }) {
    const now = new Date();
    const id = uuid();
    const normalizedEmail = email.toLowerCase();
    const user = {
      id,
      email: normalizedEmail,
      passwordHash,
      name,
      provider,
      googleId,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(id, user);
    this.usersByEmail.set(normalizedEmail, id);

    if (googleId) {
      this.usersByGoogleId.set(googleId, id);
    }

    return cloneUser(user);
  }

  async findByEmail(email) {
    if (!email) return null;
    const userId = this.usersByEmail.get(email.toLowerCase());
    if (!userId) return null;
    return cloneUser(this.users.get(userId));
  }

  async findById(id) {
    return cloneUser(this.users.get(id));
  }

  async findByGoogleId(googleId) {
    if (!googleId) return null;
    const userId = this.usersByGoogleId.get(googleId);
    if (!userId) return null;
    return cloneUser(this.users.get(userId));
  }

  async updateUser(id, updates) {
    const existing = this.users.get(id);
    if (!existing) return null;

    const normalizedEmail = updates.email ? updates.email.toLowerCase() : existing.email;
    const now = new Date();

    const updated = {
      ...existing,
      ...updates,
      email: normalizedEmail,
      updatedAt: now
    };

    this.users.set(id, updated);

    if (normalizedEmail !== existing.email) {
      this.usersByEmail.delete(existing.email);
      this.usersByEmail.set(normalizedEmail, id);
    }

    if (updates.googleId !== undefined && updates.googleId !== existing.googleId) {
      if (existing.googleId) {
        this.usersByGoogleId.delete(existing.googleId);
      }
      if (updates.googleId) {
        this.usersByGoogleId.set(updates.googleId, id);
      }
    }

    return cloneUser(updated);
  }

  async setPasswordHash(id, passwordHash) {
    return this.updateUser(id, { passwordHash });
  }

  async linkGoogleAccount(id, googleId) {
    return this.updateUser(id, {
      googleId,
      provider: this._computeProviderAfterLink(id, googleId)
    });
  }

  _computeProviderAfterLink(id, googleId) {
    const user = this.users.get(id);
    if (!user) return 'local';
    if (user.provider === 'google') return 'google';
    if (user.provider === 'local') return googleId ? 'local+google' : 'local';
    return user.provider;
  }
}

module.exports = UserRepository;

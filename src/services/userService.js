const { ConflictError, NotFoundError } = require('../utils/errors');

function mapToPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser({ email, passwordHash = null, name = '', provider = 'local', googleId = null }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email is already registered');
    }
    const user = await this.userRepository.createUser({ email, passwordHash, name, provider, googleId });
    return mapToPublicUser(user);
  }

  async getUserByEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async getUserByGoogleId(googleId) {
    const user = await this.userRepository.findByGoogleId(googleId);
    return user;
  }

  async ensureUserById(id) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(userId, updates) {
    await this.ensureUserById(userId);
    const user = await this.userRepository.updateUser(userId, updates);
    return mapToPublicUser(user);
  }

  async setPassword(userId, passwordHash) {
    await this.ensureUserById(userId);
    const user = await this.userRepository.setPasswordHash(userId, passwordHash);
    return mapToPublicUser(user);
  }

  async linkGoogleAccount(userId, googleId) {
    await this.ensureUserById(userId);
    const user = await this.userRepository.linkGoogleAccount(userId, googleId);
    return mapToPublicUser(user);
  }

  toPublicUser(user) {
    return mapToPublicUser(user);
  }
}

module.exports = UserService;

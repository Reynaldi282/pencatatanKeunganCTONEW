const express = require('express');
const UserRepository = require('./repositories/userRepository');
const RefreshTokenRepository = require('./repositories/refreshTokenRepository');
const PasswordResetRepository = require('./repositories/passwordResetRepository');
const UserService = require('./services/userService');
const TokenService = require('./services/tokenService');
const AuthService = require('./services/authService');
const AuthController = require('./controllers/authController');
const UserController = require('./controllers/userController');
const EmailService = require('./services/emailService');
const GoogleAuthService = require('./services/googleAuthService');
const createAuthRouter = require('./routes/authRoutes');
const createUserRouter = require('./routes/userRoutes');
const createAuthenticationMiddleware = require('./middleware/authenticate');
const errorHandler = require('./middleware/errorHandler');

function createApp(overrides = {}) {
  const userRepository = overrides.userRepository || new UserRepository();
  const refreshTokenRepository = overrides.refreshTokenRepository || new RefreshTokenRepository();
  const passwordResetRepository = overrides.passwordResetRepository || new PasswordResetRepository();
  const emailService = overrides.emailService || new EmailService();
  const googleAuthService = overrides.googleAuthService || new GoogleAuthService();

  const userService = overrides.userService || new UserService(userRepository);
  const tokenService = overrides.tokenService || new TokenService(
    refreshTokenRepository,
    userRepository,
    overrides.tokenServiceOptions || {}
  );

  const authService = overrides.authService || new AuthService({
    userService,
    tokenService,
    passwordResetRepository,
    emailService,
    googleAuthService
  });

  const authController = overrides.authController || new AuthController(authService);
  const userController = overrides.userController || new UserController(authService);
  const authenticate = overrides.authenticateMiddleware || createAuthenticationMiddleware(tokenService, userService);

  const app = express();
  app.use(express.json());

  app.set('dependencies', {
    userRepository,
    refreshTokenRepository,
    passwordResetRepository,
    emailService,
    googleAuthService,
    userService,
    tokenService,
    authService
  });

  app.use('/auth', createAuthRouter(authController));
  app.use('/users', createUserRouter(userController, authenticate));

  app.use((req, res) => {
    res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

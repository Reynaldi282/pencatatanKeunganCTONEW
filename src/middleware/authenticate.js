const { AuthenticationError } = require('../utils/errors');

function createAuthenticationMiddleware(tokenService, userService) {
  return async function authenticate(req, res, next) {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authorization header');
      }
      const token = header.replace('Bearer ', '').trim();
      const payload = tokenService.verifyAccessToken(token);
      const user = await userService.getUserById(payload.sub);
      if (!user) {
        throw new AuthenticationError('User not found for token');
      }
      req.user = user;
      return next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return next(error);
      }
      return next(new AuthenticationError('Invalid or expired token'));
    }
  };
}

module.exports = createAuthenticationMiddleware;

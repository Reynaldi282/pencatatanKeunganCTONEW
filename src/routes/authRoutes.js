const express = require('express');
const validate = require('../middleware/validate');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  googleAuthSchema,
  requestPasswordResetSchema,
  confirmPasswordResetSchema
} = require('./validators/authSchemas');

function createAuthRouter(controller) {
  const router = express.Router();

  router.post('/register', validate(registerSchema), controller.register);
  router.post('/login', validate(loginSchema), controller.login);
  router.post('/logout', validate(logoutSchema), controller.logout);
  router.post('/refresh', validate(refreshSchema), controller.refresh);
  router.post('/google', validate(googleAuthSchema), controller.googleAuth);
  router.post('/password/request-reset', validate(requestPasswordResetSchema), controller.requestPasswordReset);
  router.post('/password/confirm-reset', validate(confirmPasswordResetSchema), controller.confirmPasswordReset);

  return router;
}

module.exports = createAuthRouter;

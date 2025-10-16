const express = require('express');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('./validators/userSchemas');

function createUserRouter(controller, authenticate) {
  const router = express.Router();

  router.get('/me', authenticate, controller.getProfile);
  router.patch('/me', authenticate, validate(updateProfileSchema), controller.updateProfile);

  return router;
}

module.exports = createUserRouter;

const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof AppError) {
    const { statusCode, message, code, details } = err;
    return res.status(statusCode).json({
      error: { message, code, details: details || null }
    });
  }

  console.error(err);
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
}

module.exports = errorHandler;

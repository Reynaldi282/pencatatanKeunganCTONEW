const { ValidationError } = require('../utils/errors');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return next(new ValidationError('Validation failed', details));
    }
    req.body = result.data;
    return next();
  };
}

module.exports = validate;

const crypto = require('crypto');

function generateTokenValue(size = 48) {
  return crypto.randomBytes(size).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  generateTokenValue,
  hashToken
};

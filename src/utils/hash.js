const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return hashAsync(password, SALT_ROUNDS);
}

async function verifyPassword(hash, password) {
  return compareAsync(password, hash);
}

module.exports = {
  hashPassword,
  verifyPassword
};

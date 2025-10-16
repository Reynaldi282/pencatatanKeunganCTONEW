const { OAuth2Client } = require('google-auth-library');
const { AuthenticationError } = require('../utils/errors');
const config = require('../config/config');

class GoogleAuthService {
  constructor(clientId = config.google.clientId, client = null) {
    this.clientId = clientId;
    this.client = client || new OAuth2Client(clientId);
  }

  async verifyIdToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience: this.clientId });
      return ticket.getPayload();
    } catch (error) {
      throw new AuthenticationError('Invalid Google identity token');
    }
  }
}

module.exports = GoogleAuthService;

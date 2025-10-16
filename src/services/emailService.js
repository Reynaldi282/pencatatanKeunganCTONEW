const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor(options = {}) {
    this.from = options.from || config.email.from;
    this.baseUrl = options.baseUrl || config.app.baseUrl;
    this.transportConfig = options.transportConfig || this._resolveTransport(config.email.transport);
    this.transporter = options.transporter || nodemailer.createTransport(this.transportConfig);
    this.sentMessages = [];
  }

  _resolveTransport(transport) {
    if (!transport || transport === 'json') {
      return { jsonTransport: true };
    }
    if (transport === 'test') {
      return { streamTransport: true, newline: 'unix', buffer: true };
    }
    return transport;
  }

  async sendPasswordResetEmail({ email, name, token }) {
    const resetLink = `${this.baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const message = {
      from: this.from,
      to: email,
      subject: 'Password reset request',
      text: `Hello ${name || 'there'},\n\nUse the following link to reset your password: ${resetLink}\n\nIf you did not request a password reset, you can ignore this message.`,
      html: `<p>Hello ${name || 'there'},</p><p>Use the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request a password reset, you can ignore this message.</p>`
    };

    const info = await this.transporter.sendMail(message);
    this.sentMessages.push({ email, name, token, info });
    return info;
  }

  getSentMessages() {
    return [...this.sentMessages];
  }
}

module.exports = EmailService;

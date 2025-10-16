const request = require('supertest');
const { createApp } = require('../app');
const EmailService = require('../services/emailService');
const { AuthenticationError } = require('../utils/errors');

class StubGoogleAuthService {
  constructor() {
    this.payloads = new Map();
  }

  addToken(token, payload) {
    this.payloads.set(token, payload);
  }

  async verifyIdToken(idToken) {
    if (!this.payloads.has(idToken)) {
      throw new AuthenticationError('Stub invalid token');
    }
    return this.payloads.get(idToken);
  }
}

describe('Authentication and user management flows', () => {
  let app;
  let agent;
  let emailService;
  let googleService;

  beforeEach(() => {
    emailService = new EmailService({ transportConfig: { jsonTransport: true } });
    googleService = new StubGoogleAuthService();
    app = createApp({ emailService, googleAuthService: googleService });
    agent = request(app);
  });

  const registerUser = async (overrides = {}) => {
    const payload = {
      email: 'user@example.com',
      password: 'Password123!',
      name: 'Example User',
      ...overrides
    };
    const response = await agent.post('/auth/register').send(payload);
    return response;
  };

  it('registers a user and prevents duplicate registrations', async () => {
    const first = await registerUser();
    expect(first.status).toBe(201);
    expect(first.body.user.email).toBe('user@example.com');
    expect(first.body.tokens.accessToken).toBeDefined();
    expect(first.body.tokens.refreshToken).toBeDefined();

    const duplicate = await registerUser();
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.message).toMatch(/already registered/i);
  });

  it('logs in a registered user and rejects invalid credentials', async () => {
    await registerUser();

    const ok = await agent.post('/auth/login').send({ email: 'user@example.com', password: 'Password123!' });
    expect(ok.status).toBe(200);
    expect(ok.body.tokens.accessToken).toBeDefined();

    const bad = await agent.post('/auth/login').send({ email: 'user@example.com', password: 'wrong' });
    expect(bad.status).toBe(401);
  });

  it('allows accessing and updating the profile with a valid access token', async () => {
    const { body } = await registerUser();
    const accessToken = body.tokens.accessToken;

    const profile = await agent.get('/users/me').set('Authorization', `Bearer ${accessToken}`);
    expect(profile.status).toBe(200);
    expect(profile.body.user.email).toBe('user@example.com');

    const updated = await agent
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Updated Name' });
    expect(updated.status).toBe(200);
    expect(updated.body.user.name).toBe('Updated Name');
  });

  it('rejects profile access without an access token', async () => {
    const res = await agent.get('/users/me');
    expect(res.status).toBe(401);
  });

  it('rotates refresh tokens on refresh and invalidates old refresh token', async () => {
    const registerRes = await registerUser();
    const refreshToken = registerRes.body.tokens.refreshToken;

    const refreshRes = await agent.post('/auth/refresh').send({ refreshToken });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.tokens.refreshToken).not.toBe(refreshToken);

    const reuseRes = await agent.post('/auth/refresh').send({ refreshToken });
    expect(reuseRes.status).toBe(400);
  });

  it('revokes refresh tokens on logout', async () => {
    const registerRes = await registerUser();
    const refreshToken = registerRes.body.tokens.refreshToken;

    const logoutRes = await agent.post('/auth/logout').send({ refreshToken });
    expect(logoutRes.status).toBe(204);

    const refreshRes = await agent.post('/auth/refresh').send({ refreshToken });
    expect(refreshRes.status).toBe(400);
  });

  it('handles password reset flow end-to-end', async () => {
    await registerUser();

    const requestRes = await agent.post('/auth/password/request-reset').send({ email: 'user@example.com' });
    expect(requestRes.status).toBe(204);

    const [message] = emailService.getSentMessages();
    expect(message).toBeDefined();
    const { token } = message;

    const confirmRes = await agent.post('/auth/password/confirm-reset').send({ token, newPassword: 'NewPassword123!' });
    expect(confirmRes.status).toBe(204);

    const oldLogin = await agent.post('/auth/login').send({ email: 'user@example.com', password: 'Password123!' });
    expect(oldLogin.status).toBe(401);

    const newLogin = await agent.post('/auth/login').send({ email: 'user@example.com', password: 'NewPassword123!' });
    expect(newLogin.status).toBe(200);
  });

  it('supports Google OAuth sign-in for new users', async () => {
    const token = 'google-token-new';
    googleService.addToken(token, {
      email: 'googleuser@example.com',
      email_verified: true,
      sub: 'google-sub-123',
      name: 'Google User'
    });

    const res = await agent.post('/auth/google').send({ idToken: token });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('googleuser@example.com');
    expect(res.body.user.provider).toBe('google');
  });

  it('links Google account to existing local user', async () => {
    await registerUser({ email: 'link@example.com' });

    const token = 'google-token-link';
    googleService.addToken(token, {
      email: 'link@example.com',
      email_verified: true,
      sub: 'google-sub-link',
      name: 'Link User'
    });

    const res = await agent.post('/auth/google').send({ idToken: token });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('link@example.com');
    expect(res.body.user.provider).toBe('local+google');
  });
});

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

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

let server;
let baseUrl;
let emailService;
let googleService;

async function startServer() {
  emailService = new EmailService({ transportConfig: { jsonTransport: true } });
  googleService = new StubGoogleAuthService();
  const app = createApp({ emailService, googleAuthService: googleService });
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
}

async function stopServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
}

test.beforeEach(startServer);
test.afterEach(stopServer);

async function apiRequest({ method = 'GET', path = '/', body, headers = {} }) {
  const requestHeaders = { ...headers };
  const options = { method, headers: requestHeaders };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
    requestHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  let parsedBody = null;
  if (text) {
    try {
      parsedBody = JSON.parse(text);
    } catch (error) {
      parsedBody = text;
    }
  }
  return { status: response.status, body: parsedBody };
}

async function registerUser(overrides = {}) {
  const payload = {
    email: 'user@example.com',
    password: 'Password123!',
    name: 'Example User',
    ...overrides
  };
  return apiRequest({ method: 'POST', path: '/auth/register', body: payload });
}

test('registers a user and prevents duplicate registrations', { concurrency: false }, async () => {
  const first = await registerUser();
  assert.strictEqual(first.status, 201);
  assert.strictEqual(first.body.user.email, 'user@example.com');
  assert.ok(first.body.tokens.accessToken);
  assert.ok(first.body.tokens.refreshToken);

  const duplicate = await registerUser();
  assert.strictEqual(duplicate.status, 409);
  assert.match(duplicate.body.error.message, /already registered/i);
});

test('logs in a registered user and rejects invalid credentials', { concurrency: false }, async () => {
  await registerUser();

  const ok = await apiRequest({ method: 'POST', path: '/auth/login', body: { email: 'user@example.com', password: 'Password123!' } });
  assert.strictEqual(ok.status, 200);
  assert.ok(ok.body.tokens.accessToken);

  const bad = await apiRequest({ method: 'POST', path: '/auth/login', body: { email: 'user@example.com', password: 'wrong' } });
  assert.strictEqual(bad.status, 401);
});

test('allows accessing and updating the profile with a valid access token', { concurrency: false }, async () => {
  const registration = await registerUser();
  const accessToken = registration.body.tokens.accessToken;

  const profile = await apiRequest({ method: 'GET', path: '/users/me', headers: { Authorization: `Bearer ${accessToken}` } });
  assert.strictEqual(profile.status, 200);
  assert.strictEqual(profile.body.user.email, 'user@example.com');

  const updated = await apiRequest({
    method: 'PATCH',
    path: '/users/me',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: { name: 'Updated Name' }
  });
  assert.strictEqual(updated.status, 200);
  assert.strictEqual(updated.body.user.name, 'Updated Name');
});

test('rejects profile access without an access token', { concurrency: false }, async () => {
  const res = await apiRequest({ method: 'GET', path: '/users/me' });
  assert.strictEqual(res.status, 401);
});

test('rotates refresh tokens on refresh and invalidates old refresh token', { concurrency: false }, async () => {
  const registerRes = await registerUser();
  const refreshToken = registerRes.body.tokens.refreshToken;

  const refreshRes = await apiRequest({ method: 'POST', path: '/auth/refresh', body: { refreshToken } });
  assert.strictEqual(refreshRes.status, 200);
  assert.notStrictEqual(refreshRes.body.tokens.refreshToken, refreshToken);

  const reuseRes = await apiRequest({ method: 'POST', path: '/auth/refresh', body: { refreshToken } });
  assert.strictEqual(reuseRes.status, 400);
});

test('revokes refresh tokens on logout', { concurrency: false }, async () => {
  const registerRes = await registerUser();
  const refreshToken = registerRes.body.tokens.refreshToken;

  const logoutRes = await apiRequest({ method: 'POST', path: '/auth/logout', body: { refreshToken } });
  assert.strictEqual(logoutRes.status, 204);

  const refreshRes = await apiRequest({ method: 'POST', path: '/auth/refresh', body: { refreshToken } });
  assert.strictEqual(refreshRes.status, 400);
});

test('handles password reset flow end-to-end', { concurrency: false }, async () => {
  await registerUser();

  const requestRes = await apiRequest({ method: 'POST', path: '/auth/password/request-reset', body: { email: 'user@example.com' } });
  assert.strictEqual(requestRes.status, 204);

  const [message] = emailService.getSentMessages();
  assert.ok(message);
  const { token } = message;

  const confirmRes = await apiRequest({ method: 'POST', path: '/auth/password/confirm-reset', body: { token, newPassword: 'NewPassword123!' } });
  assert.strictEqual(confirmRes.status, 204);

  const oldLogin = await apiRequest({ method: 'POST', path: '/auth/login', body: { email: 'user@example.com', password: 'Password123!' } });
  assert.strictEqual(oldLogin.status, 401);

  const newLogin = await apiRequest({ method: 'POST', path: '/auth/login', body: { email: 'user@example.com', password: 'NewPassword123!' } });
  assert.strictEqual(newLogin.status, 200);
});

test('supports Google OAuth sign-in for new users', { concurrency: false }, async () => {
  const token = 'google-token-new';
  googleService.addToken(token, {
    email: 'googleuser@example.com',
    email_verified: true,
    sub: 'google-sub-123',
    name: 'Google User'
  });

  const res = await apiRequest({ method: 'POST', path: '/auth/google', body: { idToken: token } });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.user.email, 'googleuser@example.com');
  assert.strictEqual(res.body.user.provider, 'google');
});

test('links Google account to existing local user', { concurrency: false }, async () => {
  await registerUser({ email: 'link@example.com' });

  const token = 'google-token-link';
  googleService.addToken(token, {
    email: 'link@example.com',
    email_verified: true,
    sub: 'google-sub-link',
    name: 'Link User'
  });

  const res = await apiRequest({ method: 'POST', path: '/auth/google', body: { idToken: token } });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.user.email, 'link@example.com');
  assert.strictEqual(res.body.user.provider, 'local+google');
});

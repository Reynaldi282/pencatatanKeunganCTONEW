import pino from 'pino';

import env from './config/env';

const logger = pino({
  level: env.LOG_LEVEL,
  redact: ['req.headers.authorization'],
});

export default logger;

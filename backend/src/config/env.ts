import { existsSync } from 'fs';
import path from 'path';

import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

const envFileCandidates = (() => {
  if (process.env.ENV_FILE) {
    return [process.env.ENV_FILE];
  }

  const candidates: string[] = [];
  if (process.env.NODE_ENV) {
    candidates.push(`.env.${process.env.NODE_ENV}`);
  }
  candidates.push('.env');
  return candidates;
})();

for (const candidate of envFileCandidates) {
  const resolvedPath = path.resolve(process.cwd(), candidate);
  if (existsSync(resolvedPath)) {
    loadEnv({ path: resolvedPath });
    break;
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

const env = envSchema.parse(process.env);

export default env;

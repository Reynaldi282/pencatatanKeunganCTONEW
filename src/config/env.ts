import dotenv from 'dotenv';

dotenv.config();

export interface AppEnv {
  readonly PORT: number;
  readonly NODE_ENV: 'development' | 'test' | 'production';
  readonly DATABASE_URL: string;
  readonly SWAGGER_VERSION: string;
}

const DEFAULTS: AppEnv = {
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: (process.env.NODE_ENV as AppEnv['NODE_ENV']) ?? 'development',
  DATABASE_URL:
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/finance_sync',
  SWAGGER_VERSION: process.env.SWAGGER_VERSION ?? 'v1'
};

export const env: AppEnv = DEFAULTS;

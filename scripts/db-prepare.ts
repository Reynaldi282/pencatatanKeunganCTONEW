import { Client } from 'pg';

import { env } from '../src/config/env';

function buildAdminConnectionString(databaseUrl: string): { connectionString: string; database: string } {
  const url = new URL(databaseUrl);
  const database = url.pathname.replace(/^\//, '') || 'postgres';
  url.pathname = '/postgres';
  return { connectionString: url.toString(), database };
}

async function ensureDatabase() {
  const databaseUrl = process.env.DATABASE_URL ?? env.DATABASE_URL;
  const { connectionString, database } = buildAdminConnectionString(databaseUrl);

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const existsResult = await client.query<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists',
      [database]
    );

    const exists = existsResult.rows[0]?.exists ?? false;

    if (!exists) {
      await client.query(`CREATE DATABASE ${database} WITH ENCODING 'UTF8'`);
      // eslint-disable-next-line no-console
      console.log(`Database ${database} created.`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Database ${database} already exists.`);
    }
  } finally {
    await client.end();
  }
}

ensureDatabase().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to prepare database', error);
  process.exitCode = 1;
});

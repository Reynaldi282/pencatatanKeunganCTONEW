import fs from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'pg';

import { env } from '../src/config/env';

async function seed() {
  const seedPath = path.resolve(__dirname, '../seeds/seed.sql');
  let sql: string;

  try {
    sql = await fs.readFile(seedPath, 'utf-8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.warn('No seed.sql file found. Skipping data seeding.');
      return;
    }
    throw error;
  }

  if (!sql.trim()) {
    // eslint-disable-next-line no-console
    console.warn('Seed file is empty. Nothing to seed.');
    return;
  }

  const databaseUrl = process.env.DATABASE_URL ?? env.DATABASE_URL;
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    // eslint-disable-next-line no-console
    console.log('Database seeded successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

seed().catch((error) => {
  process.exitCode = 1;
  // eslint-disable-next-line no-console
  console.error('Failed to seed database', error);
});

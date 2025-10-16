import fs from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'pg';

import { env } from '../src/config/env';

const MIGRATIONS_TABLE = 'schema_migrations';

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL ?? env.DATABASE_URL;
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        run_on TIMESTAMP WITH TIME ZONE DEFAULT now()
      )`
    );

    const appliedResult = await client.query<{ name: string }>(
      `SELECT name FROM ${MIGRATIONS_TABLE} ORDER BY run_on ASC`
    );
    const applied = new Set(appliedResult.rows.map((row) => row.name));

    const migrationsDir = path.resolve(__dirname, '../migrations');
    let migrationFiles: string[] = [];

    try {
      migrationFiles = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith('.sql'));
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // eslint-disable-next-line no-console
        console.warn('No migrations directory found. Skipping migrations.');
        return;
      }
      throw error;
    }

    migrationFiles.sort();

    for (const fileName of migrationFiles) {
      if (applied.has(fileName)) {
        continue;
      }

      const filePath = path.join(migrationsDir, fileName);
      const sql = await fs.readFile(filePath, 'utf-8');

      // eslint-disable-next-line no-console
      console.log(`Applying migration ${fileName}...`);

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(`INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`, [fileName]);
        await client.query('COMMIT');
        // eslint-disable-next-line no-console
        console.log(`Migration ${fileName} applied successfully.`);
      } catch (migrationError) {
        await client.query('ROLLBACK');
        // eslint-disable-next-line no-console
        console.error(`Migration ${fileName} failed.`, migrationError);
        throw migrationError;
      }
    }
  } finally {
    await client.end();
  }
}

runMigrations().catch((error) => {
  process.exitCode = 1;
  // eslint-disable-next-line no-console
  console.error('Failed to run migrations', error);
});

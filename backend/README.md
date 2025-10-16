# Backend Service

TypeScript + Express backend for the personal finance platform.

## Tech stack

- [Express](https://expressjs.com/) for HTTP routing and middleware
- [TypeScript](https://www.typescriptlang.org/) for static typing
- [Prisma](https://www.prisma.io/) for PostgreSQL ORM and migrations
- [Pino](https://getpino.io/#/) for structured logging
- [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) for testing

## Getting started

```bash
npm install
cp .env.example .env
# Update DATABASE_URL to match your local PostgreSQL instance
npm run db:migrate:dev
npm run db:seed
npm run dev
```

The development server listens on `PORT` (default: `4000`). A simple health endpoint is available at `GET /health`.

## Available scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the development server with hot reload (tsx) |
| `npm run build` | Compile TypeScript output to `dist/` |
| `npm start` | Run the compiled server |
| `npm run lint` | Run ESLint over the TypeScript source |
| `npm test` | Execute Jest test suites |
| `npm run db:migrate` | Apply prisma migrations in production environments |
| `npm run db:migrate:dev` | Create/apply migrations against a development database |
| `npm run db:seed` | Seed default income/expense categories |

## Environment variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `NODE_ENV` | Runtime environment identifier | `development` |
| `PORT` | HTTP port for the Express server | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | _(required)_ |
| `LOG_LEVEL` | Log verbosity for Pino | `info` |

## Database schema overview

The initial Prisma schema provisions the following entities:

- `User` with authentication providers and refresh tokens
- `Category` for income/expense classification (default data seeded)
- `Transaction` with attachments and audit timestamps
- `Budget` with recurrence information per user and category
- `DeviceSyncMetadata` to track client sync status

Review `prisma/schema.prisma` and `prisma/migrations/0001_init/migration.sql` for details.

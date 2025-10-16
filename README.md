# Personal Finance Platform

This repository is organized as a monorepo that will eventually host the backend services, mobile clients, documentation, and shared configuration for the personal finance platform.

## Repository structure

```
.
├── backend/          # Node.js + TypeScript API service
├── mobile/           # Placeholder for future mobile application(s)
├── docs/             # Project documentation and design assets
├── config/           # Shared environment and configuration resources
└── docker-compose.yml
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18.17 or later
- [npm](https://www.npmjs.com/) (ships with Node.js)
- [Docker](https://www.docker.com/) and Docker Compose (optional, recommended for local development)

## Backend setup (manual)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy the example environment file and adjust values as needed:
   ```bash
   cp .env.example .env
   ```
3. Set up PostgreSQL and update `DATABASE_URL` in `.env` to point at your database.
4. Apply database migrations and seed default data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Run tests or linting when needed:
   ```bash
   npm test
   npm run lint
   ```

## Running with Docker Compose

The repository ships with a Docker Compose configuration that provisions both PostgreSQL and the backend service.

```bash
cp backend/.env.example backend/.env
# Adjust DATABASE_URL if necessary (containers use the `db` hostname)
docker compose up --build
```

Once the containers are running the API is available at <http://localhost:4000>. The Compose file maps PostgreSQL to your host on port `5432`.

## Database migrations & seeding

- Migrations are managed with [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate). The migration history is stored under `backend/prisma/migrations`.
- Default income and expense categories are provisioned by the seeding script (`npm run db:seed`). The seeding operation is idempotent and can be safely re-run.

## Next steps

- Fill out the mobile application under `mobile/` (React Native, Flutter, etc.).
- Extend `/docs` with architecture decision records, API references, and onboarding guides.
- Centralize environment templates and cross-service configuration under `/config` as additional services are introduced.

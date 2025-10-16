# Finance Sync API Documentation

This repository provides API documentation, tooling, and workflows for the Finance Sync Platform. It includes:

- An Express server that serves Swagger UI (`/docs`) and the raw OpenAPI document (`/docs.json`).
- A hand-curated OpenAPI 3.0.3 specification covering authentication, user, transaction, category, budget, and sync domains.
- Automated scripts to regenerate the specification in JSON and YAML formats.
- Postman assets for quick exploration of core workflows.
- Database migration and seeding utilities backed by PostgreSQL.
- Docker Compose for running the API documentation server alongside a Postgres instance.

## Getting started

### Prerequisites

- Node.js v20+
- npm v9+
- Docker (optional but recommended for a reproducible local stack)

### Installation

```bash
npm install
cp .env.example .env
```

Update `.env` as needed. By default it connects to the Postgres container defined in `docker-compose.yml`.

### Running locally

#### Without Docker

```bash
# Generate OpenAPI artefacts (docs/openapi/v1.json & v1.yaml)
npm run generate:swagger

# Start the documentation server in watch mode
npm run dev
```

Visit <http://localhost:3000/docs> for Swagger UI or <http://localhost:3000/docs.json> for the raw document.

#### With Docker Compose

```bash
docker-compose up --build
```

This starts:

- `api`: Runs `npm run dev`, exposing the server on `http://localhost:3000`.
- `db`: PostgreSQL 15 with credentials defined in `docker-compose.yml`.

The first run may take a moment while dependencies install inside the container. Subsequent runs reuse the cached `node_modules` volume.

### Database tasks

All database utility scripts use the `DATABASE_URL` from your environment (see `.env.example`). Typical workflow:

```bash
# Ensure the target database exists
npm run db:prepare

# Apply SQL migrations in ./migrations
npm run db:migrate

# Load representative seed data from ./seeds/seed.sql
npm run db:seed
```

The default migrations create `users`, `transactions`, `categories`, `budgets`, and sync-related tables that mirror the published API schema.

### Quality gates & automation

| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint with TypeScript rules |
| `npm run lint:fix` | Auto-fix supported lint warnings |
| `npm run test` | Runs Vitest unit tests (non-watch mode) |
| `npm run test:watch` | Watches and reruns tests |
| `npm run test:coverage` | Generates test coverage reports |
| `npm run build` | TypeScript build to `dist/` |
| `npm run generate:swagger` | Materialises OpenAPI JSON + YAML under `docs/openapi/` |
| `npm run docs:serve` | Lightweight server hosting Swagger UI on port `3030` |

### Postman collection

Import `docs/postman/finance-sync.postman_collection.json` into Postman (or an equivalent REST client). The collection defines:

- Auth flows (register, login, refresh, logout)
- Profile updates
- CRUD flows for transactions, categories, and budgets
- Sync-related endpoints

Collection variables:

- `baseUrl`: Defaults to `http://localhost:3000`
- `accessToken` / `refreshToken`: Populated after running the **Login** request test script

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port for the Express server | `3000` |
| `NODE_ENV` | Runtime environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:postgres@db:5432/finance_sync` |
| `SWAGGER_VERSION` | Version tag used when generating docs | `v1` |
| `SWAGGER_PORT` | Port used by `npm run docs:serve` | `3030` |

### Typical workflow summary

1. Copy `.env.example` to `.env` and tweak values.
2. Start dependencies with `docker-compose up` (or manage Postgres manually).
3. Prepare and migrate the database: `npm run db:prepare && npm run db:migrate`.
4. Optionally seed baseline data: `npm run db:seed`.
5. Generate documentation artefacts: `npm run generate:swagger`.
6. Explore the API via `npm run dev` + Swagger UI or the bundled Postman collection.

### Updating the API specification

- Modify `src/docs/openapi.ts` to adjust schemas or endpoints.
- Run `npm run generate:swagger` to refresh `docs/openapi/v1.json` and `docs/openapi/v1.yaml`.
- Review `tests/openapi.test.ts` to keep automated validation in sync with specification changes.

## Project structure

```
├── docs/
│   ├── openapi/           # Generated OpenAPI artefacts
│   └── postman/           # Postman collection for quick testing
├── migrations/            # SQL migrations applied by npm run db:migrate
├── scripts/               # Utility scripts (swagger generation, DB tasks)
├── seeds/                 # SQL seed data
├── src/
│   ├── config/            # Environment handling
│   ├── docs/              # Source-of-truth OpenAPI definition
│   └── server.ts          # Express bootstrap
└── tests/                 # Vitest specifications
```

## CI-ready commands

The following commands are safe to integrate into CI pipelines:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run db:migrate`
- `npm run generate:swagger`

They provide deterministic exits and fail fast on issues, making them suitable for automated workflows.

---

Questions or enhancements can be captured by updating `src/docs/openapi.ts`, extending migrations, or adding new Postman requests. The tooling here ensures every change propagates consistently across documentation, automation, and developer environments.

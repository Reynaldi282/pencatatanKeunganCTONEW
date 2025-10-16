# Shared Configuration

The `config` directory is intended for shared settings and environment samples that apply to multiple applications in this monorepo. For example, common environment variable templates, feature flag definitions, or cross-platform configuration files can be stored here.

Current shared resources:
- [`backend/.env.example`](../backend/.env.example) – example environment variables for the backend service.

As new services are added (e.g., mobile clients or web frontends), add their configuration references here to keep setup instructions centralized.

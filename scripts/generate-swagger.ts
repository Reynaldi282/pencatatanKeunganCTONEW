import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

import openApiDocument from '../src/docs/openapi';
import { env } from '../src/config/env';

async function generate() {
  const version = env.SWAGGER_VERSION || `v${openApiDocument.info.version ?? '1'}`;
  const outputDir = path.resolve(__dirname, '../docs/openapi');
  await fs.mkdir(outputDir, { recursive: true });

  const jsonPath = path.join(outputDir, `${version}.json`);
  const yamlPath = path.join(outputDir, `${version}.yaml`);

  await fs.writeFile(jsonPath, JSON.stringify(openApiDocument, null, 2));
  await fs.writeFile(yamlPath, YAML.stringify(openApiDocument));

  // eslint-disable-next-line no-console
  console.log(`OpenAPI documentation generated at ${jsonPath} and ${yamlPath}`);
}

generate().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to generate OpenAPI specification', error);
  process.exitCode = 1;
});

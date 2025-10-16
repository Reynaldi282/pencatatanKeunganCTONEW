import express from 'express';
import swaggerUi from 'swagger-ui-express';

import openApiDocument from '../src/docs/openapi';

const app = express();
const port = Number(process.env.SWAGGER_PORT ?? 3030);

app.get('/docs.json', (_req, res) => {
  res.status(200).json(openApiDocument);
});

app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Swagger UI available at http://localhost:${port}`);
});

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import healthRouter from './routes/health';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import logger from './logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({
  logger,
  customSuccessMessage: (_req, res) => `Request completed with status ${res.statusCode}`,
}));

app.use('/health', healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

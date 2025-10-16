import app from './app';
import env from './config/env';
import { connectDatabase, disconnectDatabase } from './db/client';
import logger from './logger';

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'Backend server listening');
  });

  const shutdown = () => {
    logger.info('Received shutdown signal, closing server...');
    server.close(() => {
      logger.info('HTTP server closed');
      disconnectDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
          logger.error({ err: error }, 'Error during database disconnect');
          process.exit(1);
        });
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((error) => {
  logger.error({ err: error }, 'Failed to start server');
  process.exit(1);
});

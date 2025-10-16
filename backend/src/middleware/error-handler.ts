import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import logger from '../logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    const formatted = err.errors.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      message: 'Invalid request data',
      errors: formatted,
    });
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';

  logger.error({ err, path: req.originalUrl }, message);

  return res.status(statusCode).json({
    message,
    details: err instanceof AppError ? err.details : undefined,
  });
};

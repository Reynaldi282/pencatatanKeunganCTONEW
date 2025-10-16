import { Router } from 'express';

import prisma from '../db/client';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await prisma.$queryRaw`SELECT 1`;
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;

// src/middleware/error.middleware.ts
import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('? ERROR:', err.stack);

  if (res.headersSent) {
    return next(err);
  }

  const isDevMode = process.env.ENABLE_DEV_MODE === 'true';

  res.status(500).json({
    error: 'Internal server error',
    ...(isDevMode && { stack: err.stack }),
  });
};
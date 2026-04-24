import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../utils/httpStatus';
import logger from '../lib/logger';

export function errorHandler(
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.statusCode ? err.message : 'Internal server error';
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(status).json({ error: message });
}

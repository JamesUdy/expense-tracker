import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../utils/httpStatus';
import logger from '../lib/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ error: 'Internal server error' });
}

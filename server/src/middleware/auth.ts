import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../utils/httpStatus';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Server misconfiguration' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { userId: string; email: string };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid or expired token' });
  }
}

import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema } from 'zod';
import { HTTP_STATUS } from '../utils/httpStatus';

type Target = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: result.error.flatten().fieldErrors });
      return;
    }
    req[target] = result.data;
    next();
  };
}

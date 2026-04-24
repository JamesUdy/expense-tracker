import { Router, type Request, type Response, type NextFunction } from 'express';
import { createExpenseSchema, getExpensesSchema } from '../schemas/expense';
import { ExpenseService } from '../services/expense';
import { validate } from '../middleware/validate';
import { HTTP_STATUS } from '../utils/httpStatus';
import logger from '../lib/logger';

const router = Router();
const service = new ExpenseService();

router.get(
  '/',
  validate(getExpensesSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.list(req.userId, req.query as Parameters<typeof service.list>[1]);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (err) {
      logger.error('GET /expenses failed', { error: (err as Error).message });
      next(err);
    }
  }
);

router.post(
  '/',
  validate(createExpenseSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idempotencyKey = req.headers['idempotency-key'];
      if (!idempotencyKey || typeof idempotencyKey !== 'string') {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ error: 'Idempotency-Key header is required' });
        return;
      }

      const { expense, created } = await service.create(req.userId, req.body, idempotencyKey);
      res.status(created ? HTTP_STATUS.CREATED : HTTP_STATUS.OK).json(expense);
    } catch (err) {
      logger.error('POST /expenses failed', { error: (err as Error).message });
      next(err);
    }
  }
);

export default router;

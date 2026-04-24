import { Router, type Request, type Response, type NextFunction } from 'express';
import { RegisterSchema, LoginSchema } from '../schemas/auth';
import { AuthService } from '../services/auth';
import { validate } from '../middleware/validate';
import { HTTP_STATUS } from '../utils/httpStatus';
import logger from '../lib/logger';

const router = Router();
const service = new AuthService();

router.post(
  '/register',
  validate(RegisterSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.register(req.body.email, req.body.password);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err) {
      logger.error('POST /auth/register failed', { error: (err as Error).message });
      next(err);
    }
  }
);

router.post(
  '/login',
  validate(LoginSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.login(req.body.email, req.body.password);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (err) {
      logger.error('POST /auth/login failed', { error: (err as Error).message });
      next(err);
    }
  }
);

export default router;

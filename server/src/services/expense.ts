import { Expense } from '../collections/expense';
import { toCents } from '../utils/money';
import type { CreateExpenseInput, GetExpensesInput } from '../schemas/expense';
import logger from '../lib/logger';

export class ExpenseService {
  async list(query: GetExpensesInput) {
    const filter: Record<string, unknown> = {};
    if (query.category) filter.category = query.category;

    const sortOrder = query.sort === 'date_asc' ? 1 : -1;

    const [expenses, totalResult] = await Promise.all([
      Expense.find(filter).sort({ date: sortOrder, created_at: sortOrder }).lean(),
      Expense.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const total_cents: number = totalResult[0]?.total ?? 0;

    logger.info('Listed expenses', { count: expenses.length, filter });
    return { expenses, total_cents };
  }

  async create(body: CreateExpenseInput, idempotencyKey: string) {
    const existing = await Expense.findOne({ idempotency_key: idempotencyKey }).lean();
    if (existing) {
      logger.info('Idempotent hit — returning existing expense', { idempotencyKey });
      return { expense: existing, created: false };
    }

    try {
      const expense = await Expense.create({
        amount: toCents(body.amount),
        category: body.category,
        description: body.description ?? '',
        date: body.date,
        idempotency_key: idempotencyKey,
      });

      logger.info('Expense created', { id: expense._id.toString(), amount: expense.amount });
      return { expense: expense.toObject(), created: true };
    } catch (err: unknown) {
      //#region duplicate key race-condition fallback
      if (this.isDuplicateKeyError(err)) {
        const race = await Expense.findOne({ idempotency_key: idempotencyKey }).lean();
        if (race) {
          logger.warn('Race-condition idempotent hit', { idempotencyKey });
          return { expense: race, created: false };
        }
      }
      //#endregion

      throw err;
    }
  }

  private isDuplicateKeyError(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: number }).code === 11000
    );
  }
}

import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'amount must be a number' })
    .positive('amount must be greater than 0'),
  category: z.string().min(1, 'category is required').trim(),
  description: z.string().trim().default(''),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format'),
});

export const getExpensesSchema = z.object({
  category: z.string().trim().optional(),
  sort: z.enum(['date_desc', 'date_asc']).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type GetExpensesInput = z.infer<typeof getExpensesSchema>;

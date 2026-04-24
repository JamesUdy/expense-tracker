import type {
  CreateExpensePayload,
  GetExpensesParams,
  GetExpensesResponse,
  Expense,
} from '../types/expense';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      typeof body.error === 'string'
        ? body.error
        : 'Validation failed. Please check your inputs.'
    );
  }
  return res.json() as Promise<T>;
}

class ExpenseService {
  async getExpenses(params: GetExpensesParams = {}): Promise<GetExpensesResponse> {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.sort) query.set('sort', params.sort);

    const url = `${BASE_URL}/expenses${query.toString() ? `?${query}` : ''}`;
    const res = await fetch(url);
    return handleResponse<GetExpensesResponse>(res);
  }

  async createExpense(
    payload: CreateExpensePayload,
    idempotencyKey: string
  ): Promise<Expense> {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<Expense>(res);
  }
}

export const expenseService = new ExpenseService();

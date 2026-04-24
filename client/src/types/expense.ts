export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  idempotency_key: string;
  created_at: string;
}

export interface CreateExpensePayload {
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface GetExpensesParams {
  category?: string;
  sort?: 'date_desc' | 'date_asc';
}

export interface GetExpensesResponse {
  expenses: Expense[];
  total_cents: number;
}

export interface ApiError {
  error: string | Record<string, string[]>;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import type { GetExpensesParams, CreateExpensePayload } from '../types/expense';

const QUERY_KEY = 'expenses';

export function useGetExpenses(params: GetExpensesParams = {}, token?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => expenseService.getExpenses(params, token),
    enabled: !!token,
  });
}

export function useCreateExpense(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: CreateExpensePayload;
      idempotencyKey: string;
    }) => expenseService.createExpense(payload, idempotencyKey, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

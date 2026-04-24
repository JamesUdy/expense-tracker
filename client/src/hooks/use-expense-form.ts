import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateExpense } from './use-expenses';
import { todayISO } from '../lib/utils';
import type { CreateExpensePayload } from '../types/expense';

interface FormState {
  amount: string;
  category: string;
  description: string;
  date: string;
}

const INITIAL_FORM: FormState = {
  amount: '',
  category: '',
  description: '',
  date: todayISO(),
};

export function useExpenseForm(token?: string) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  const { mutate, isPending } = useCreateExpense(token);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: CreateExpensePayload = {
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      date: form.date,
    };

    mutate(
      { payload, idempotencyKey },
      {
        onSuccess: () => {
          toast.success('Expense added!');
          setForm(INITIAL_FORM);
          setIdempotencyKey(crypto.randomUUID());
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Something went wrong.');
        },
      }
    );
  }

  return { form, handleChange, handleSubmit, isPending };
}

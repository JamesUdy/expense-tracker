import { useState, useEffect } from 'react';
import { useGetExpenses } from './hooks/use-expenses';
import { useAuth } from './hooks/use-auth';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { SpendingChart } from './components/SpendingChart';
import { AuthForm } from './components/AuthForm';
import { Button } from './components/ui/Button';
import type { GetExpensesParams } from './types/expense';

//#region dark mode
function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, setDark] as const;
}
//#endregion

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [filters, setFilters] = useState<GetExpensesParams>({ sort: 'date_desc' });
  const { token, email, logout } = useAuth();

  const { data, isPending } = useGetExpenses(filters, token ?? undefined);
  const expenses = data?.expenses ?? [];
  const totalCents = data?.total_cents ?? 0;

  if (!token) {
    return <AuthForm onAuth={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-(--color-background)">
      <header className="border-b border-(--color-border) bg-(--color-card) shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-(--color-foreground)">💸 Expense Tracker</span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-(--color-muted-foreground) sm:block">{email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
              className="flex h-9 w-9 items-center justify-center rounded-[--radius] border border-(--color-border) bg-(--color-background) text-(--color-muted-foreground) transition-colors hover:bg-(--color-accent) hover:text-(--color-foreground)"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="flex flex-col gap-6">
            <ExpenseForm token={token} />
            <ExpenseSummary totalCents={totalCents} expenses={expenses} />
            <SpendingChart expenses={expenses} />
          </div>
          <div className="flex flex-col gap-4">
            <ExpenseFilters filters={filters} setFilters={setFilters} />
            <ExpenseList expenses={expenses} isPending={isPending} />
          </div>
        </div>
      </main>
    </div>
  );
}

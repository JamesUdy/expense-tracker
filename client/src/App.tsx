import { useState, useEffect } from 'react';
import { useGetExpenses } from './hooks/use-expenses';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { SpendingChart } from './components/SpendingChart';
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

  const { data, isPending } = useGetExpenses(filters);
  const expenses = data?.expenses ?? [];
  const totalCents = data?.total_cents ?? 0;

  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Header */}
      <header className="border-b border-(--color-border) bg-(--color-card) shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-bold text-(--color-foreground)">💸 Expense Tracker</span>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-[--radius] border border-(--color-border) bg-(--color-background) text-(--color-muted-foreground) transition-colors hover:bg-(--color-accent) hover:text-(--color-foreground)"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <ExpenseForm />
            <ExpenseSummary totalCents={totalCents} expenses={expenses} />
            <SpendingChart expenses={expenses} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <ExpenseFilters filters={filters} setFilters={setFilters} />
            <ExpenseList expenses={expenses} isPending={isPending} />
          </div>
        </div>
      </main>
    </div>
  );
}

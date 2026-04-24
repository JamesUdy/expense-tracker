import { formatCurrency } from '../lib/utils';
import { Card } from './ui/Card';
import type { Expense } from '../types/expense';

interface ExpenseSummaryProps {
  totalCents: number;
  expenses: Expense[];
}

export function ExpenseSummary({ totalCents, expenses }: ExpenseSummaryProps) {
  //#region category breakdown
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});
  const rows = Object.entries(byCategory).sort(([, a], [, b]) => b - a);
  //#endregion

  return (
    <Card>
      <h2 className="mb-1 text-base font-semibold text-(--color-foreground)">Summary</h2>
      <p className="mb-4 text-2xl font-bold tabular-nums text-(--color-foreground)">
        {formatCurrency(totalCents)}
      </p>
      {rows.length > 0 && (
        <div className="border-t border-(--color-border) pt-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)">
            By Category
          </p>
          <ul className="flex flex-col gap-1.5">
            {rows.map(([category, cents]) => (
              <li key={category} className="flex justify-between text-sm">
                <span className="text-(--color-muted-foreground)">{category}</span>
                <span className="font-medium tabular-nums text-(--color-foreground)">
                  {formatCurrency(cents)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

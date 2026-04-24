import { formatCurrency, formatDate } from '../lib/utils';
import { Card } from './ui/Card';
import type { Expense } from '../types/expense';

//#region skeleton
function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-(--color-muted) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}
//#endregion

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Shopping: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Other: 'bg-(--color-muted) text-(--color-muted-foreground)',
};

interface ExpenseListProps {
  expenses: Expense[] | undefined;
  isPending: boolean;
}

export function ExpenseList({ expenses, isPending }: ExpenseListProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-muted) text-(--color-muted-foreground)">
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {isPending ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : !expenses?.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-(--color-muted-foreground)">
                  No expenses yet. Add one above!
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="hover:bg-(--color-muted)/50 transition-colors"
                >
                  <td className="px-4 py-3 text-(--color-muted-foreground) whitespace-nowrap">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS['Other']
                      }`}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--color-foreground)">{expense.description}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums text-(--color-foreground)">
                    {formatCurrency(expense.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

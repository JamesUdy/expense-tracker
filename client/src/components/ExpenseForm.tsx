import { useExpenseForm } from '../hooks/use-expense-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card } from './ui/Card';

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Other',
] as const;

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select category' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

interface ExpenseFormProps {
  token?: string;
}

export function ExpenseForm({ token }: ExpenseFormProps) {
  const { form, handleChange, handleSubmit, isPending } = useExpenseForm(token);

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-(--color-foreground)">Add Expense</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Amount (₹)"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
          value={form.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
        />
        <Select
          label="Category"
          required
          options={CATEGORY_OPTIONS}
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
        />
        <Input
          label="Description"
          type="text"
          placeholder="What was this for?"
          required
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        <Input
          label="Date"
          type="date"
          required
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
        <Button type="submit" loading={isPending} className="mt-1 w-full">
          {isPending ? 'Adding…' : 'Add Expense'}
        </Button>
      </form>
    </Card>
  );
}

import { CATEGORIES } from './ExpenseForm';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import type { GetExpensesParams } from '../types/expense';

interface ExpenseFiltersProps {
  filters: GetExpensesParams;
  setFilters: React.Dispatch<React.SetStateAction<GetExpensesParams>>;
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function ExpenseFilters({ filters, setFilters }: ExpenseFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[160px] flex-1">
        <Select
          label="Filter by category"
          options={CATEGORY_OPTIONS}
          value={filters.category ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: e.target.value || undefined,
            }))
          }
        />
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            sort: prev.sort === 'date_asc' ? 'date_desc' : 'date_asc',
          }))
        }
      >
        {filters.sort === 'date_asc' ? '↑ Oldest first' : '↓ Newest first'}
      </Button>
    </div>
  );
}

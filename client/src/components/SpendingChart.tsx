import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../lib/utils';
import { Card } from './ui/Card';
import type { Expense } from '../types/expense';

const PALETTE = [
  '#f97316', // Food — orange
  '#3b82f6', // Transport — blue
  '#a855f7', // Shopping — purple
  '#22c55e', // Health — green
  '#ec4899', // Entertainment — pink
  '#94a3b8', // Other — slate
];

interface SpendingChartProps {
  expenses: Expense[];
}

interface TooltipPayload {
  name: string;
  value: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[--radius] border border-(--color-border) bg-(--color-card) px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-(--color-foreground)">{payload[0].name}</p>
      <p className="text-(--color-muted-foreground)">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <Card className="flex items-center justify-center py-10">
        <p className="text-sm text-(--color-muted-foreground)">No data to chart yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-(--color-foreground)">Spending Breakdown</h2>
      <ResponsiveContainer width="100%" height={256}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-(--color-muted-foreground)">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

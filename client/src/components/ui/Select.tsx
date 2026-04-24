import { cn } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-(--color-foreground)">
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          'h-10 w-full rounded-[--radius] border border-(--color-input) bg-(--color-background) px-3 text-sm text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring) disabled:opacity-50',
          error && 'border-(--color-destructive)',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-(--color-destructive)">{error}</p>}
    </div>
  );
}

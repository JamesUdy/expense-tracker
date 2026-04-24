import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-(--color-foreground)">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'h-10 w-full rounded-[--radius] border border-(--color-input) bg-(--color-background) px-3 text-sm text-(--color-foreground) placeholder:text-(--color-muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring) disabled:opacity-50',
          error && 'border-(--color-destructive)',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-(--color-destructive)">{error}</p>}
    </div>
  );
}

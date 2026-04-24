import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[--radius] border border-(--color-border) bg-(--color-card) p-5 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

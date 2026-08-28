import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'info' | 'accent' | 'neutral' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'badge-neutral',
    success: 'badge-success',
    warning: 'badge-warning',
    destructive: 'badge-danger',
    danger: 'badge-danger',
    accent: 'badge-accent',
    neutral: 'badge-neutral',
    outline: 'badge-neutral',
    info: 'badge-accent',
  };

  return (
    <span className={clsx(
      "badge",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

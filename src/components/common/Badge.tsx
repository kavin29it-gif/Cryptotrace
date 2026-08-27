import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-primary/20 text-primary border-primary/30',
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    destructive: 'bg-destructive/20 text-destructive border-destructive/30',
    outline: 'bg-transparent border-white/20 text-muted-foreground',
    info: 'bg-accent/20 text-blue-400 border-accent/30',
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

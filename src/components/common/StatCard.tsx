import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <div className={clsx("glass p-6 rounded-xl relative overflow-hidden group", className)}>
      <div className="absolute -right-6 -top-6 text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-500 pointer-events-none">
        <Icon size={120} strokeWidth={1} />
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 rounded-lg bg-white/5 text-white/80 group-hover:text-primary transition-colors border border-white/5">
          <Icon size={18} />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
        
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={clsx("text-xs font-medium px-1.5 py-0.5 rounded-md", trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

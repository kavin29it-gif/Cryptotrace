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
    <div className={clsx("glass p-6 rounded-xl relative overflow-hidden group aurora-glow-card transition-all duration-300 hover:translate-y-[-2px]", className)}>
      <div className="absolute -right-6 -top-6 text-white/[0.01] group-hover:text-white/[0.03] transition-colors duration-500 pointer-events-none">
        <Icon size={120} strokeWidth={1} />
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</h3>
        {/* Glowing badge around thin-stroke icon */}
        <div className="w-9 h-9 rounded-full bg-white/5 text-white/80 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300 border border-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.02)]">
          <Icon size={16} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-serif font-medium tracking-tight text-white">{value}</div>
        
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-3">
            {trend && (
              <span className={clsx(
                "badge",
                trend.isPositive ? "badge-success" : "badge-danger"
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
            {description && <p className="text-xs text-muted-foreground/80">{description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

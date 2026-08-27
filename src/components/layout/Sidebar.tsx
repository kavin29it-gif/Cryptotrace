"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, FolderSearch, Activity } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Trace', href: '/trace/new', icon: Search },
  { name: 'Cases', href: '/cases', icon: FolderSearch },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col h-full hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
          <Activity size={20} className="animate-pulse-slow" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white">CryptoTrace</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Investigator</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3 mt-4">Menu</div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/cases' || pathname === '/cases' || pathname.startsWith('/cases/'));
          // more precise active state
          const actuallyActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative',
                actuallyActive 
                  ? 'bg-primary/15 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              {actuallyActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <item.icon size={18} className={clsx("transition-colors", actuallyActive ? 'text-primary' : 'group-hover:text-foreground')} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5">
        <div className="glass p-3 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-white/10">
            <span className="text-xs font-bold">OP</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Op. Center</p>
            <p className="text-xs text-muted-foreground">Demo Prototype</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

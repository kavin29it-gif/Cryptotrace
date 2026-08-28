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
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col h-full hidden md:flex shrink-0 z-20">
      <div className="p-6 flex items-center gap-4 border-b border-white/5">
        {/* Glow wrapper around the logo badge */}
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border border-white/10 relative shadow-[0_0_15px_rgba(74,222,128,0.15)] z-10 shrink-0">
          <img src="/logo.png" alt="CryptoTrace Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-lg tracking-tight text-white leading-none">CryptoTrace</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Investigation Suite</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3 px-3 mt-2">Menu</div>
        {navItems.map((item) => {
          const actuallyActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-sm',
                actuallyActive 
                  ? 'bg-white/[0.03] text-primary font-medium border border-white/5' 
                  : 'text-muted-foreground hover:bg-white/[0.02] hover:text-foreground'
              )}
            >
              {actuallyActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-[#4ADE80] to-[#B497D6] rounded-r-full shadow-[0_0_10px_rgba(180,151,214,0.5)]" />
              )}
              <item.icon size={16} className={clsx("transition-colors", actuallyActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5">
        <div className="glass p-3 rounded-lg flex items-center gap-3 bg-white/[0.01]">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-white/10 relative shadow-[0_0_10px_rgba(255,255,255,0.05)]">
            <span className="text-[10px] font-bold text-primary">CT</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-none">CryptoTrace</p>
            <p className="text-[10px] text-muted-foreground mt-1">Enterprise Suite</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { Bell, Search } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search cases, addresses, tx hashes..." 
            className="w-full bg-secondary/50 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background"></span>
        </button>
        <div className="h-6 w-px bg-white/10"></div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">Investigator</p>
            <p className="text-xs text-muted-foreground mt-1">SIH Prototype</p>
          </div>
        </div>
      </div>
    </header>
  );
}

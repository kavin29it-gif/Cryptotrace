"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, ShieldAlert, CheckCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Trace CAS-1042 Completed',
      desc: 'Suspect wallet attributed to Binance Deposit Cluster.',
      time: '10m ago',
      type: 'success',
      read: false,
    },
    {
      id: '2',
      title: 'Alert: Tornado Cash Flow',
      desc: 'High-risk exposure detected on transaction hop 2.',
      time: '1h ago',
      type: 'alert',
      read: false,
    },
    {
      id: '3',
      title: 'SAHYOG Request Filed',
      desc: 'Disclosure request generated for Case CAS-1042.',
      time: '4h ago',
      type: 'info',
      read: true,
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
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
      
      <div className="flex items-center gap-4 relative">
        {/* Bell Button */}
        <button 
          ref={bellRef}
          onClick={() => setShowNotifications(prev => !prev)}
          className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background"></span>
          )}
        </button>

        {/* Notifications Dropdown Panel */}
        {showNotifications && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 top-12 w-80 glass rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-fade-in"
          >
            <div className="p-3.5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <span className="text-xs font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-[10px] text-primary hover:underline font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-3.5 transition-colors hover:bg-white/[0.02] flex gap-3 ${!n.read ? 'bg-white/[0.01]' : ''}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'success' && <CheckCircle size={14} className="text-success" />}
                      {n.type === 'alert' && <ShieldAlert size={14} className="text-destructive" />}
                      {n.type === 'info' && <FileText size={14} className="text-accent" />}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${!n.read ? 'font-semibold text-white' : 'text-white/80'}`}>{n.title}</p>
                        <span className="text-[9px] text-muted-foreground/60 shrink-0 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed truncate">{n.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="h-6 w-px bg-white/10"></div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">Investigator</p>
            <p className="text-[10px] text-muted-foreground/80 mt-1.5 uppercase tracking-widest font-mono">CryptoTrace Enterprise</p>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight, Activity, Database, ShieldAlert, Clock } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import { getLocalCases, LocalCase } from '@/lib/localStorage';

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function Dashboard() {
  const [cases, setCases] = useState<LocalCase[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, highRisk: 0 });

  useEffect(() => {
    const localCases = getLocalCases();
    setCases(localCases);
    
    // Calculate stats
    const total = localCases.length;
    const active = localCases.filter(c => c.status === 'running').length;
    const highRisk = localCases.filter(c => c.attribution?.risk === 'high').length;
    setStats({ total, active, highRisk });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in relative">
      {/* Top Banner Background Glow blob */}
      <div className="absolute top-[-40px] left-[20%] w-[300px] h-[100px] rounded-full bg-primary/5 blur-[80px] pointer-events-none z-0" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Investigation Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Overview of recent tracing activities and active cases.</p>
        </div>
        <Link
          href="/trace/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 aurora-bg-gradient text-[#07090c] font-semibold rounded-full shadow-[0_4px_20px_rgba(74,222,128,0.25)] hover:shadow-[0_4px_30px_rgba(74,222,128,0.4)] transition-all duration-200 active:scale-95 whitespace-nowrap text-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Trace
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <StatCard title="Total Cases" value={stats.total.toLocaleString()} icon={Database} trend={{ value: 12, isPositive: true }} description="vs last month" />
        <StatCard title="Active Traces" value={stats.active} icon={Activity} description="Currently running" className="border-primary/10 bg-primary/5" />
        <StatCard title="High-Risk Attributions" value={stats.highRisk} icon={ShieldAlert} trend={{ value: 4, isPositive: false }} description="Requires review" />
        <StatCard title="Avg Trace Time" value="14s" icon={Clock} description="From input to report" />
      </div>

      {/* Recent Cases */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden relative z-10">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-serif font-semibold text-white">Recent Cases</h2>
          <Link href="/cases" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] text-[10px] uppercase tracking-widest text-muted-foreground/80 border-b border-white/5">
                <th className="px-6 py-4 font-semibold">Case ID</th>
                <th className="px-6 py-4 font-semibold">Wallet Address</th>
                <th className="px-6 py-4 font-semibold">Network</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {cases.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-medium text-white font-mono text-sm">{typeof c.id === 'string' && c.id.length > 10 ? c.id.substring(0, 8) + '...' : c.id}</td>
                  <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                    {c.wallet_address?.length > 15 ? c.wallet_address.substring(0, 8) + '...' + c.wallet_address.slice(-4) : c.wallet_address}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.chain === 'ethereum' ? 'bg-accent' : 'bg-[#eb0029]'}`}></div>
                      <span className="capitalize text-sm text-white/80">{c.chain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.status === 'completed' ? 'success' : c.status === 'failed' ? 'destructive' : 'info'}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70 capitalize">{c.crime_category?.replace('_', ' ') || '-'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{timeAgo(c.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/cases/${c.id}`} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {cases.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-xs text-muted-foreground">
                    No active cases. <Link href="/trace/new" className="text-primary hover:underline">Start a new trace</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

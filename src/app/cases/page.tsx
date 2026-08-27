import Link from 'next/link';
import { Plus, ArrowRight, Download } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { supabaseAdmin } from '@/lib/supabase';
import ExportCsvButton from '@/components/common/ExportCsvButton';

async function getCases() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return mockCases;
  }

  const { data, error } = await supabaseAdmin
    .from('cases')
    .select(`
      id,
      wallet_address,
      chain,
      status,
      crime_category,
      created_at,
      attributions (risk, confidence)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Cases fetch error:', error);
    return mockCases;
  }

  return data || mockCases;
}

// Fallback mock data
const mockCases = [
  { id: 'CAS-1042', wallet_address: '0x7a2...b9f4', chain: 'ethereum', status: 'completed', crime_category: 'fraud', created_at: new Date().toISOString(), attributions: [{ risk: 'high', confidence: 92 }] },
  { id: 'CAS-1041', wallet_address: 'TVJ...9kM2', chain: 'tron', status: 'completed', crime_category: 'ransomware', created_at: new Date().toISOString(), attributions: [{ risk: 'medium', confidence: 55 }] },
  { id: 'CAS-1040', wallet_address: '0x1c3...e2a1', chain: 'ethereum', status: 'running', crime_category: 'investment_scam', created_at: new Date().toISOString(), attributions: [] },
];

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default async function CasesList() {
  const cases = await getCases();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Case Directory</h1>
          <p className="text-muted-foreground mt-1">{cases.length} cases found. Browse and filter all traces.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportCsvButton data={cases} />
          <Link
            href="/trace/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            New Trace
          </Link>
        </div>
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.02] text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5">
                <th className="px-6 py-4 font-semibold">Case ID</th>
                <th className="px-6 py-4 font-semibold">Suspect Wallet</th>
                <th className="px-6 py-4 font-semibold">Network</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cases.map((c: any) => {
                const topAttribution = c.attributions?.[0];
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-medium text-white font-mono text-sm">
                      {typeof c.id === 'string' && c.id.length > 10 ? c.id.substring(0, 8) + '...' : c.id}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                      {c.wallet_address?.length > 20
                        ? c.wallet_address.substring(0, 10) + '...' + c.wallet_address.slice(-4)
                        : c.wallet_address}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${c.chain === 'ethereum' ? 'bg-[#627eea]' : 'bg-[#eb0029]'}`}></div>
                        <span className="capitalize text-sm text-white/80">{c.chain}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70 capitalize">{c.crime_category?.replace('_', ' ') || '-'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={c.status === 'completed' ? 'success' : c.status === 'failed' ? 'destructive' : 'info'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {topAttribution?.risk === 'high' && <Badge variant="destructive">High</Badge>}
                      {topAttribution?.risk === 'medium' && <Badge variant="warning">Medium</Badge>}
                      {topAttribution?.risk === 'low' && <Badge variant="success">Low</Badge>}
                      {!topAttribution && <span className="text-muted-foreground text-sm">-</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{timeAgo(c.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/10 border border-transparent hover:border-white/10"
                      >
                        View <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {cases.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-muted-foreground">
                    No cases yet. <Link href="/trace/new" className="text-primary hover:underline">Start your first trace →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing {cases.length} entries</div>
        </div>
      </div>
    </div>
  );
}

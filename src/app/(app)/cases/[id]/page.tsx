"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Network, ShieldCheck, FileOutput, AlertTriangle, CheckCircle, Copy, Download, Share2, Sparkles, Send, Loader2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

const FundFlowGraph = dynamic(() => import('@/components/graph/FundFlowGraph'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
      <div className="text-center space-y-4">
        <Network size={48} className="mx-auto text-white/20 animate-pulse-slow" />
        <p className="text-muted-foreground">Interactive graph component loading...</p>
      </div>
    </div>
  )
});

export default function CaseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'graph' | 'evidence' | 'report' | 'ai'>('graph');
  const [sahyogAction, setSahyogAction] = useState<'disclosure' | 'freeze'>('disclosure');
  const [sahyogStatus, setSahyogStatus] = useState<{ loading: boolean; result: string | null }>({ loading: false, result: null });
  
  const [dbData, setDbData] = useState<{ case: any; attribution: any } | null>(null);
  const [loading, setLoading] = useState(true);

  // AI Copilot States
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Ask AI Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; sources?: any[] }>>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const generateAIAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch(`/api/ai/cases/${id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        throw new Error('AI analysis is temporarily unavailable.');
      }
      const data = await res.json();
      setAiResponse(data);
    } catch (err: any) {
      setAiError(err.message || 'AI analysis is temporarily unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch(`/api/ai/cases/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      });
      if (!res.ok) {
        throw new Error('Could not get answer from AI.');
      }
      const data = await res.json();
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: data.summary || data.risk_explanation || 'Answer generated.',
        sources: data.sources
      }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: err.message || 'AI is temporarily offline.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    async function loadCaseData() {
      try {
        const res = await fetch(`/api/cases/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDbData(data);
        }
      } catch (err) {
        console.error("Failed to load case data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCaseData();
  }, [id]);

  const triggerDisclosure = async () => {
    setSahyogStatus({ loading: true, result: null });
    try {
      const res = await fetch('/api/sahyog/disclosure-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: id,
          vasp_address: dbData?.attribution?.vasp_address || '0x28C6c06298d514Db089934071355E5743bf21d60',
          vasp_name: dbData?.attribution?.vasp_name || 'Binance Hot Wallet',
          action: sahyogAction
        })
      });
      const data = await res.json();
      setSahyogStatus({ loading: false, result: data.reference_number || 'Submitted successfully' });
    } catch {
      setSahyogStatus({ loading: false, result: 'Error — see console' });
    }
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      caseId: id,
      targetWallet: dbData?.case?.wallet_address,
      blockchain: dbData?.case?.chain,
      status: dbData?.case?.status,
      riskLevel: dbData?.attribution?.risk,
      evidenceSignals: dbData?.attribution?.evidence,
      attribution: dbData?.attribution
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cryptotrace-case-${id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadPdf = async () => {
    try {
      const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');
      
      const styles = StyleSheet.create({
        page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
        header: { borderBottom: '2px solid #ef4444', paddingBottom: 10, marginBottom: 20 },
        title: { fontSize: 24, color: '#111827', fontWeight: 'bold' },
        subtitle: { fontSize: 10, color: '#6b7280', marginTop: 4 },
        section: { marginBottom: 20 },
        sectionTitle: { fontSize: 14, color: '#ef4444', borderBottom: '1px solid #e5e7eb', paddingBottom: 4, marginBottom: 10, fontWeight: 'bold' },
        row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
        label: { fontSize: 10, color: '#374151', fontWeight: 'bold' },
        value: { fontSize: 10, color: '#1f2937' },
        evidenceBox: { backgroundColor: '#f9fafb', padding: 10, borderRadius: 4, border: '1px solid #e5e7eb', marginBottom: 8 },
        evidenceTitle: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
        evidenceDesc: { fontSize: 9, color: '#4b5563', marginTop: 2 }
      });

      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>CryptoTrace Investigation Report</Text>
              <Text style={styles.subtitle}>Generated on {new Date().toLocaleString()}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Case Details</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Case ID:</Text>
                <Text style={styles.value}>{id as string}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Suspect Wallet:</Text>
                <Text style={styles.value}>{dbData?.case?.wallet_address || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Blockchain:</Text>
                <Text style={styles.value}>{(dbData?.case?.chain || '').toUpperCase()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Risk Classification:</Text>
                <Text style={styles.value}>{(dbData?.attribution?.risk || 'N/A').toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>VASP Attribution</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Primary Candidate VASP:</Text>
                <Text style={styles.value}>{dbData?.attribution?.vasp_name || 'Binance'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Confidence Score:</Text>
                <Text style={styles.value}>{dbData?.attribution?.confidence || 92}/100</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attribution Evidence Signals</Text>
              {(dbData?.attribution?.evidence || [
                { signal: 'Direct Deposit', description: 'Funds deposited directly to known Binance deposit wallet cluster.', weight: 'strong' },
                { signal: 'Cluster Match', description: 'Destination wallet is part of a verified Binance deposit cluster.', weight: 'strong' },
              ]).map((e: any, idx: number) => (
                <View key={idx} style={styles.evidenceBox}>
                  <Text style={styles.evidenceTitle}>{e.signal} ({e.weight})</Text>
                  <Text style={styles.evidenceDesc}>{e.description}</Text>
                </View>
              ))}
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cryptotrace-report-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };
  

  const caseData = {
    id: id as string,
    wallet: dbData?.case?.wallet_address || '0x7a2...b9f4',
    chain: dbData?.case?.chain || 'ethereum',
    status: dbData?.case?.status || 'completed',
    risk: dbData?.attribution?.risk || 'high',
    created: dbData?.case?.created_at ? new Date(dbData.case.created_at).toLocaleDateString() : '2 hrs ago'
  };

  const evidenceSignals = [
    { icon: <CheckCircle size={14} className="text-success" />, label: 'Direct Deposit', desc: 'Funds deposited directly to known Binance deposit wallet cluster.', weight: 'Strong' },
    { icon: <CheckCircle size={14} className="text-success" />, label: 'Cluster Match', desc: 'Destination wallet is part of a verified Binance deposit cluster — strongly supports attribution.', weight: 'Strong' },
    { icon: <AlertTriangle size={14} className="text-warning" />, label: 'Peeling Chain Detected', desc: 'Rapid sequential single-output transactions detected — common obfuscation pattern.', weight: 'Moderate' },
    { icon: <AlertTriangle size={14} className="text-warning" />, label: 'Round Amount Transactions', desc: 'Multiple round-number (e.g. 10 ETH, 5 ETH) transfers detected — consistent with structured layering.', weight: 'Moderate' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/cases" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{caseData.id}</h1>
              <Badge variant="destructive">High Risk</Badge>
              <Badge variant="success">Completed</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="font-mono flex items-center gap-1">
                Target: {caseData.wallet}
                <button className="hover:text-white"><Copy size={12} /></button>
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="capitalize">{caseData.chain}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>{caseData.created}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={downloadJson} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary hover:bg-white/10 text-white font-medium rounded-full transition-all duration-200 border border-white/10 text-xs">
            <Download size={14} />
            Export JSON
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 aurora-bg-gradient text-[#07090c] font-semibold rounded-full shadow-[0_4px_15px_rgba(74,222,128,0.2)] transition-all duration-200 hover:shadow-[0_4px_25px_rgba(74,222,128,0.3)] active:scale-95 text-xs">
            <Share2 size={14} />
            Share Case
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-t-xl border-b border-white/5 flex overflow-x-auto hide-scrollbar shrink-0">
        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-xs uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'graph' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
        >
          <Network size={14} />
          Fund-Flow Graph
          {activeTab === 'graph' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4ADE80] to-[#B497D6] rounded-t-full shadow-[0_-2px_10px_rgba(180,151,214,0.5)]"></span>}
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-xs uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'evidence' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
        >
          <ShieldCheck size={14} />
          Evidence &amp; Scoring
          {activeTab === 'evidence' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4ADE80] to-[#B497D6] rounded-t-full shadow-[0_-2px_10px_rgba(180,151,214,0.5)]"></span>}
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-xs uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'report' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
        >
          <FileOutput size={14} />
          Report &amp; Actions
          {activeTab === 'report' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4ADE80] to-[#B497D6] rounded-t-full shadow-[0_-2px_10px_rgba(180,151,214,0.5)]"></span>}
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-xs uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'ai' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
        >
          <Sparkles size={14} />
          AI Analysis
          {activeTab === 'ai' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4ADE80] to-[#B497D6] rounded-t-full shadow-[0_-2px_10px_rgba(180,151,214,0.5)]"></span>}
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass rounded-b-xl border border-t-0 border-white/5 flex-1 relative overflow-hidden min-h-[500px]">

        {/* GRAPH TAB */}
        {activeTab === 'graph' && (
          <div className="absolute inset-0">
            <FundFlowGraph />
          </div>
        )}

        {/* EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <div className="p-6 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-1">VASP Attribution Results</h3>
            <p className="text-sm text-muted-foreground mb-5">Evidence signals used to attribute the suspect wallet to a VASP.</p>
            <div className="space-y-4">
              {/* VASP Candidate 1 — Binance */}
              <div className="bg-secondary/30 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 grid grid-cols-12 gap-4 items-center bg-white/[0.02]">
                  <div className="col-span-3">
                    <div className="font-semibold text-white flex items-center gap-2">
                      {dbData?.attribution?.vasp_name || 'Binance'} 
                      <Badge variant={dbData?.attribution?.risk === 'high' ? 'destructive' : dbData?.attribution?.risk === 'medium' ? 'warning' : 'success'}>
                        {dbData?.attribution?.risk || 'High'} Risk
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      {dbData?.attribution?.vasp_address 
                        ? `${dbData.attribution.vasp_address.substring(0, 8)}...${dbData.attribution.vasp_address.slice(-4)}` 
                        : '0x28C...1d60'}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Distance</div>
                    <Badge variant="outline">1-2 Hops</Badge>
                  </div>
                  <div className="col-span-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Confidence Score</span>
                      <span className="text-white font-bold">{dbData?.attribution?.confidence || 92}/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-destructive h-2 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        style={{ width: `${dbData?.attribution?.confidence || 92}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <Badge variant="accent" className="text-xs">Cluster Match</Badge>
                  </div>
                </div>
                <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evidence Signals</p>
                  {(dbData?.attribution?.evidence || [
                    { signal: 'Direct Deposit', description: 'Funds deposited directly to known Binance deposit wallet cluster.', weight: 'strong' },
                    { signal: 'Cluster Match', description: 'Destination wallet is part of a verified Binance deposit cluster — strongly supports attribution.', weight: 'strong' },
                    { signal: 'Peeling Chain Detected', description: 'Rapid sequential single-output transactions detected — common obfuscation pattern.', weight: 'moderate' },
                    { signal: 'Round Amount Transactions', description: 'Multiple round-number (e.g. 10 ETH, 5 ETH) transfers detected — consistent with structured layering.', weight: 'moderate' },
                  ]).map((e: any, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="mt-0.5 shrink-0">
                        {e.weight === 'penalty' ? <AlertTriangle size={14} className="text-warning" /> : <CheckCircle size={14} className="text-success" />}
                      </span>
                      <div>
                        <span className="text-sm text-white font-medium">{e.signal}</span>
                        <Badge variant={e.weight === 'strong' ? 'success' : e.weight === 'penalty' ? 'destructive' : 'warning'} className="ml-2 capitalize">{e.weight}</Badge>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VASP Candidate 2 — Kraken */}
              <div className="bg-secondary/30 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 grid grid-cols-12 gap-4 items-center bg-white/[0.02]">
                  <div className="col-span-3">
                    <div className="font-semibold text-white flex items-center gap-2">
                      Kraken <Badge variant="warning" className="scale-90 origin-left">Med Risk</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">0x772...8888</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Distance</div>
                    <Badge variant="outline">3+ Hops</Badge>
                  </div>
                  <div className="col-span-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Confidence Score</span>
                      <span className="text-white font-bold">45/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.4)]" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <Badge variant="outline" className="text-xs">Secondary Candidate</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT TAB */}
        {activeTab === 'report' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-full">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Investigation Report</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A finalized PDF report has been generated containing the fund-flow graph, evidence trail, and VASP attributions.
                </p>
                <div className="flex gap-3">
                  <button onClick={downloadPdf} className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10 shadow-sm text-sm">
                    <Download size={16} /> Download PDF
                  </button>
                  <button onClick={downloadJson} className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10 shadow-sm text-sm">
                    <Download size={16} /> Download JSON
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-primary/5">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Needs Review
                </h4>
                <p className="text-sm text-white/80">
                  Multiple high-confidence VASP deposits detected. Disclosure requests can be automated via SAHYOG API.
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-white/10 space-y-5">
              <h3 className="text-lg font-semibold text-white">SAHYOG Action</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Target VASP</label>
                  <div className="p-3 bg-black/30 border border-white/5 rounded-lg text-sm text-white font-medium">
                    {dbData?.attribution?.vasp_name || 'Binance'} ({dbData?.attribution?.confidence || 92}% Confidence)
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Requested Action</label>
                  <select
                    value={sahyogAction}
                    onChange={(e) => setSahyogAction(e.target.value as 'disclosure' | 'freeze')}
                    className="w-full bg-secondary/80 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none text-sm"
                  >
                    <option value="disclosure">Information Disclosure (Sec 94 BNSS)</option>
                    <option value="freeze">Account Freeze (Sec 94 BNSS)</option>
                  </select>
                </div>
                <button
                  onClick={triggerDisclosure}
                  disabled={sahyogStatus.loading}
                  className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-medium rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all active:scale-95 text-sm flex items-center justify-center gap-2 mt-4"
                >
                  <ShieldCheck size={16} />
                  {sahyogStatus.loading ? 'Submitting to SAHYOG...' : 'Trigger Disclosure Request'}
                </button>
                {sahyogStatus.result && (
                  <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-center">
                    <p className="text-xs text-success font-medium">✓ Filed with SAHYOG</p>
                    <p className="text-xs text-muted-foreground mt-1">Ref: {sahyogStatus.result}</p>
                  </div>
                )}
                <p className="text-xs text-center text-muted-foreground">Integrated with SAHYOG Portal API</p>
              </div>
            </div>
          </div>
        )}

        {/* AI ANALYSIS TAB */}
        {activeTab === 'ai' && (
          <div className="p-6 h-full overflow-y-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 gap-4">
              <div>
                <h3 className="text-xl font-serif font-semibold text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                    <Sparkles className="text-primary animate-pulse-slow" size={16} />
                  </span>
                  AI Investigation Copilot
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Grounded cryptocurrency AML evidence interpreter and case explainer.
                </p>
              </div>
              <button
                onClick={generateAIAnalysis}
                disabled={aiLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 aurora-bg-gradient text-[#07090c] font-semibold rounded-full shadow-[0_4px_15px_rgba(74,222,128,0.2)] transition-all duration-200 hover:shadow-[0_4px_25px_rgba(74,222,128,0.3)] active:scale-95 text-xs shrink-0"
              >
                {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {aiResponse ? 'Regenerate Analysis' : 'Generate AI Analysis'}
              </button>
            </div>

            {/* Side-by-Side: Offical Data vs AI Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Official System Data (Source of Truth) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass p-5 rounded-xl border border-white/10 space-y-5 relative">
                  <div className="border-b border-white/5 pb-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Official System Data</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">Source: Deterministic Risk Engine</p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest block mb-1">Risk Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-serif font-bold text-white">{dbData?.attribution?.confidence || 92}</span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest block mb-1.5">Risk Level</span>
                    <Badge variant={dbData?.attribution?.risk === 'high' ? 'destructive' : dbData?.attribution?.risk === 'medium' ? 'warning' : 'success'} className="px-3 py-1 text-xs font-semibold rounded-full">
                      {(dbData?.attribution?.risk || 'HIGH').toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest block mb-1 font-mono">Suspect Wallet</span>
                    <span className="text-xs text-muted-foreground font-mono break-all leading-relaxed block bg-black/10 p-2.5 rounded-lg border border-white/5">{dbData?.case?.wallet_address || caseData.wallet}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest block mb-1.5">Target VASP</span>
                    <div className="p-3 bg-black/10 rounded-lg border border-white/5">
                      <span className="text-sm text-white font-semibold block">{dbData?.attribution?.vasp_name || 'Binance'}</span>
                      <span className="text-xs text-muted-foreground font-mono break-all block mt-1">{dbData?.attribution?.vasp_address || '0x28C...1d60'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Insights & Outputs */}
              <div className="lg:col-span-8 space-y-6">
                {aiError && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {aiError}
                  </div>
                )}

                {!aiResponse && !aiLoading && (
                  <div className="glass p-12 rounded-xl border border-white/5 text-center space-y-4">
                    <Sparkles size={40} className="mx-auto text-muted-foreground/20 animate-pulse-slow" />
                    <div className="max-w-md mx-auto space-y-2">
                      <h4 className="font-serif font-semibold text-lg text-white">Generate Case Explanation</h4>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed">
                        Click the button above to run an AI analysis grounded in transaction evidence and FATF AML typologies.
                      </p>
                    </div>
                  </div>
                )}

                {aiLoading && (
                  <div className="glass p-16 rounded-xl border border-white/5 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <p className="text-xs text-muted-foreground">Generating AI insights & running RAG retrieval...</p>
                  </div>
                )}

                {aiResponse && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Summary */}
                    <div className="glass p-5 rounded-xl border border-white/10 space-y-3 aurora-glow-card">
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Investigation Summary</h4>
                      <p className="text-sm text-white/90 leading-relaxed">{aiResponse.summary}</p>
                    </div>

                    {/* Why High Risk */}
                    <div className="glass p-5 rounded-xl border border-white/10 space-y-3 aurora-glow-card">
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Why is this case {(dbData?.attribution?.risk || 'HIGH').toUpperCase()} Risk?</h4>
                      <p className="text-sm text-white/90 leading-relaxed">{aiResponse.risk_explanation}</p>
                    </div>

                    {/* Fund Flow Explanation */}
                    <div className="glass p-5 rounded-xl border border-white/10 space-y-3 aurora-glow-card">
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Fund Flow Explanation</h4>
                      <p className="text-sm text-white/90 leading-relaxed">{aiResponse.fund_flow_explanation}</p>
                    </div>

                    {/* Indicators & Typologies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass p-5 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Key Risk Indicators</h4>
                        <ul className="space-y-2">
                          {aiResponse.key_indicators?.map((ind: string, idx: number) => (
                            <li key={idx} className="flex gap-2 items-start text-xs text-white/90">
                              <span className="text-success shrink-0 font-bold">✓</span>
                              <span>{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="glass p-5 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">AML Typologies</h4>
                        <ul className="space-y-2">
                          {aiResponse.aml_typologies?.map((typ: string, idx: number) => (
                            <li key={idx} className="flex gap-2 items-start text-xs text-white/90">
                              <span className="text-primary shrink-0 font-bold">•</span>
                              <span>{typ}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommended Next Steps */}
                    <div className="glass p-5 rounded-xl border border-white/10 space-y-3">
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Recommended Next Steps</h4>
                      <ul className="space-y-2">
                        {aiResponse.recommended_next_steps?.map((step: string, idx: number) => (
                          <li key={idx} className="flex gap-2 items-start text-xs text-white/90">
                            <span className="text-warning shrink-0 font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Knowledge Sources */}
                    {aiResponse.sources && aiResponse.sources.length > 0 && (
                      <div className="glass p-5 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Retrieved Knowledge Sources (RAG)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {aiResponse.sources.map((src: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs space-y-1.5 hover:border-primary/20 transition-all duration-200">
                              <span className="font-semibold text-white block truncate">{src.title}</span>
                              <span className="text-[10px] text-muted-foreground block">{src.source}</span>
                              {src.topic && <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-mono mt-1">{src.topic}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Confidence circular SVG meter */}
                    <div className="glass p-5 rounded-xl border border-white/10 flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">AI Reasoning Confidence</h4>
                        <p className="text-xs text-muted-foreground">Probability of correct evidence-knowledge alignment.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Thin circular progress ring */}
                        <div className="relative w-12 h-12">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-white/5" strokeWidth="2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-success" strokeDasharray={`${aiResponse.confidence || 90}, 100`} strokeWidth="2" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-success">
                            {aiResponse.confidence || 90}%
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* Chat Box / Ask AI */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden flex flex-col h-[400px] mt-6">
              <div className="p-4 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm">Ask Investigation Copilot</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Ask questions grounded in case context and AML regulations.</p>
                </div>
                <Badge variant="outline" className="text-xs rounded-full">Grounded Q&amp;A</Badge>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
                    <Sparkles size={24} className="text-muted-foreground/20 animate-pulse-slow" />
                    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                      Ask a question like *"Why is this case high risk?"* or *"Explain the fund flow."*
                    </p>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm space-y-2 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-[#07090c] font-medium rounded-tr-none' 
                        : 'bg-secondary/40 text-white border border-white/10 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="border-t border-white/10 pt-2 mt-2 space-y-1.5">
                          <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">Sources:</p>
                          {msg.sources.map((s: any, idx: number) => (
                            <span key={idx} className="block text-[10px] text-muted-foreground/80">• {s.title} ({s.source})</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/40 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Copilot is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about the case..."
                  disabled={chatLoading}
                  className="flex-1 bg-secondary/60 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground/50"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="p-2.5 bg-primary hover:bg-primary/90 text-[#07090c] rounded-full disabled:opacity-50 transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(74,222,128,0.2)]"
                >
                  <Send size={14} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

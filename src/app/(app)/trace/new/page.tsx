"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, Activity, Database, GitMerge, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

const steps = [
  { id: 'input', label: 'Input validation', icon: Shield },
  { id: 'collect', label: 'Data Collection', icon: Database },
  { id: 'process', label: 'Heuristic Processing', icon: Activity },
  { id: 'graph', label: 'Graph Construction', icon: GitMerge },
  { id: 'report', label: 'Report Generation', icon: FileText },
];

export default function NewTrace() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [caseId, setCaseId] = useState(`CAS-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState('fraud');
  
  const [isTracing, setIsTracing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleTrace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    
    setIsTracing(true);
    setCurrentStep(0);
    
    try {
      // Start the UI progress stepper simulation
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Actually call the API in the background
      const res = await fetch('/api/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chain, caseId, crimeCategory: category })
      });
      
      const data = await res.json();
      clearInterval(interval);
      
      // Make sure UI shows all steps completed
      setCurrentStep(steps.length);
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX
      
      // Redirect to the real case ID returned by the API
      router.push(`/cases/${data.caseId || caseId}`);
    } catch (error) {
      console.error("Trace failed", error);
      alert("Trace failed! See console.");
      setIsTracing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div>
        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">New Wallet Trace</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Initiate a new forensic tracing pipeline for a suspect cryptocurrency address.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleTrace} className="glass p-6 md:p-8 rounded-xl border border-white/5 space-y-6 relative overflow-hidden">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Suspect Wallet Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter 0x or mainnet address..." 
                disabled={isTracing}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent transition-all disabled:opacity-50 placeholder-muted-foreground/40 font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Blockchain Network</label>
                <div className="relative">
                  <select 
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    disabled={isTracing}
                    className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent transition-all appearance-none disabled:opacity-50"
                  >
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="tron">Tron (TRX)</option>
                    <option value="bnb">BNB Chain (BNB)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Crime Category</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isTracing}
                    className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent transition-all appearance-none disabled:opacity-50"
                  >
                    <option value="fraud">Fraud / Scam</option>
                    <option value="ransomware">Ransomware</option>
                    <option value="investment_scam">Investment Scam</option>
                    <option value="darknet">Darknet Market</option>
                    <option value="laundering">Money Laundering</option>
                    <option value="terrorism_financing">Terrorism Financing</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                <span>Case ID</span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">Autogenerated for SAHYOG</span>
              </label>
              <input 
                type="text" 
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                disabled={isTracing}
                className="w-full bg-secondary/20 border border-white/5 rounded-xl p-3.5 text-sm text-muted-foreground focus:outline-none transition-all disabled:opacity-50 font-mono"
              />
            </div>

            <div className="pt-5 flex items-center justify-end gap-3 border-t border-white/5">
              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                disabled={isTracing}
                className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-full transition-all duration-200 text-xs disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isTracing || !address}
                className="px-6 py-2.5 aurora-bg-gradient text-[#07090c] font-bold rounded-full shadow-[0_4px_15px_rgba(74,222,128,0.2)] hover:shadow-[0_4px_25px_rgba(74,222,128,0.3)] hover:scale-[1.01] active:scale-95 transition-all duration-200 text-xs disabled:opacity-50 disabled:active:scale-100 flex items-center gap-1.5"
              >
                {isTracing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Initializing Trace...
                  </>
                ) : (
                  <>
                    Start Tracing Pipeline <ChevronRight size={14} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Progress Stepper Section */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-xl border border-white/5 sticky top-24 space-y-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Pipeline Status</h3>
            
            <div className="space-y-6 relative pl-4 border-l border-white/5 ml-4">
              {steps.map((step, index) => {
                const isCompleted = isTracing && currentStep > index;
                const isActive = isTracing && currentStep === index;
                
                return (
                  <div key={step.id} className="relative flex items-center gap-4 group">
                    {/* Circle badge position */}
                    <div className="absolute -left-[27px] flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 relative ${
                        isCompleted ? 'bg-success border-success text-black' : 
                        isActive ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(74,222,128,0.4)]' : 
                        'bg-secondary border-white/10 text-muted-foreground/60'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <step.icon size={14} className={isActive ? 'animate-pulse-slow' : ''} />}
                      </div>
                    </div>
                    
                    <div className={`pl-4 py-2 w-full rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-primary/5 border border-primary/10' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold text-xs uppercase tracking-wider ${isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-muted-foreground/60'}`}>
                          {step.label}
                        </h4>
                        {isActive && <Badge variant="default" className="animate-pulse text-[9px] px-1.5 py-0.5">Active</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

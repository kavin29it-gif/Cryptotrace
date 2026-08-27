"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, Activity, Database, GitMerge, FileText, CheckCircle2 } from 'lucide-react';
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
    
    // We will do a real fetch call here and simulate the UI steps for UX
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
      
      // Redirect to the real case ID returned by the API (or fallback to the generated one)
      router.push(`/cases/${data.caseId || caseId}`);
    } catch (error) {
      console.error("Trace failed", error);
      alert("Trace failed! See console.");
      setIsTracing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">New Wallet Trace</h1>
        <p className="text-muted-foreground mt-1">Initiate a new tracing pipeline for a suspect wallet.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleTrace} className="glass p-6 md:p-8 rounded-xl border border-white/5 space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Suspect Wallet Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..." 
                disabled={isTracing}
                className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Blockchain Network</label>
                <select 
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  disabled={isTracing}
                  className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none disabled:opacity-50"
                >
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="tron">Tron (TRX)</option>
                  <option value="bnb">BNB Chain (BNB)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Crime Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isTracing}
                  className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none disabled:opacity-50"
                >
                  <option value="fraud">Fraud</option>
                  <option value="ransomware">Ransomware</option>
                  <option value="investment_scam">Investment Scam</option>
                  <option value="darknet">Darknet Market</option>
                  <option value="laundering">Money Laundering</option>
                  <option value="terrorism_financing">Terrorism Financing</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center justify-between">
                <span>Case ID</span>
                <span className="text-xs text-muted-foreground">Auto-generated for SAHYOG</span>
              </label>
              <input 
                type="text" 
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                disabled={isTracing}
                className="w-full bg-secondary/30 border border-white/5 rounded-lg p-3 text-muted-foreground focus:outline-none transition-all disabled:opacity-50 font-mono"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                disabled={isTracing}
                className="px-5 py-2.5 rounded-lg font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isTracing || !address}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              >
                {isTracing ? (
                  <>
                    <Activity size={18} className="animate-pulse" />
                    Initializing Trace...
                  </>
                ) : (
                  <>
                    Start Tracing Pipeline <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Progress Stepper Section */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-xl border border-white/5 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-6">Pipeline Status</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {steps.map((step, index) => {
                const isCompleted = isTracing && currentStep > index;
                const isActive = isTracing && currentStep === index;
                const isPending = !isTracing || currentStep < index;
                
                return (
                  <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors duration-300 ${
                      isCompleted ? 'bg-primary border-primary text-white' : 
                      isActive ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                      'bg-secondary border-white/10 text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : <step.icon size={18} className={isActive ? 'animate-pulse' : ''} />}
                    </div>
                    
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all duration-300 ${
                      isActive ? 'bg-primary/5 border-primary/30' : 'bg-transparent border-transparent'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold text-sm ${isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {step.label}
                        </h4>
                        {isActive && <Badge variant="default" className="animate-pulse">Processing</Badge>}
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

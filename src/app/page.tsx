"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Search, FileText, Send, ArrowRight, Eye, Lightbulb, Shield, Folder } from 'lucide-react';

const valueProps = [
  "Follow the money. Find the truth.",
  "From wallet address to VASP attribution in seconds.",
  "AI-grounded evidence, courtroom-ready reports.",
  "Multi-hop tracing across every major chain.",
  "Automated disclosure requests, zero manual drafting."
];

const steps = [
  {
    num: "01",
    title: "Ingest Wallet Address",
    desc: "Input any suspicious Ethereum, BNB Chain, or TRON wallet. The system automatically pulls live transaction logs from public ledger APIs."
  },
  {
    num: "02",
    title: "Trace Fund Flow",
    desc: "Run multi-hop transaction audits. The system maps the movement of assets across multiple intermediate wallets in a force-directed Sankey diagram."
  },
  {
    num: "03",
    title: "Score & Attribute",
    desc: "Apply the deterministic risk engine. Our clustering algorithms attribute suspect wallets to known exchanges, mixers, and bridges with clear confidence ratings."
  },
  {
    num: "04",
    title: "Generate AI Reports",
    desc: "Use the grounded AI Copilot to generate human-readable investigation summaries, outline observed typologies, and cite FATF compliance sources."
  },
  {
    num: "05",
    title: "Trigger SAHYOG Disclosure",
    desc: "Instantly draft and file information disclosure or account freeze requests to attributed exchanges using our integrated SAHYOG Portal API."
  }
];

export default function LandingPage() {
  const [activePhraseIdx, setActivePhraseIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(2); // Step 3 active by default to match ref

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhraseIdx(prev => (prev + 1) % valueProps.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden relative flex flex-col font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#4ADE80]/3 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[25%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#38BDF8]/4 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-[#F5D0A9]/2 blur-[120px] pointer-events-none z-0" />

      {/* Nav Bar */}
      <nav className="h-18 sticky top-0 w-full bg-[#07090c]/60 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-white/10 relative shadow-[0_0_15px_rgba(74,222,128,0.15)] z-10 shrink-0">
            <img src="/logo.png" alt="CryptoTrace Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-bold text-lg text-white tracking-tight">CryptoTrace</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#platform" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Platform</a>
          <a href="#workflow" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Workflow</a>
          <a href="#why-us" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Solutions</a>
        </div>

        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 aurora-bg-gradient text-[#07090c] font-bold rounded-full shadow-[0_4px_15px_rgba(56,189,248,0.2)] hover:shadow-[0_4px_25px_rgba(56,189,248,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-xs"
          >
            Start Investigating
            <ArrowRight size={12} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="platform" className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 md:py-36 z-10 max-w-5xl mx-auto w-full">
        
        {/* Dotted Constellation Background Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="10%" x2="45%" y2="45%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="90%" y1="10%" x2="55%" y2="45%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="45%" cy="45%" r="3" fill="rgba(56,189,248,0.3)" />
            <circle cx="55%" cy="45%" r="3" fill="rgba(74,222,128,0.3)" />
          </svg>
        </div>

        {/* Floating Icon Orbs */}
        <div className="absolute left-[8%] top-[12%] hidden lg:block z-20">
          <div className="icon-orb w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.15)] animate-float animate-float-delay-1">
            <Eye size={20} className="text-[#38BDF8]" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute right-[8%] top-[18%] hidden lg:block z-20">
          <div className="icon-orb w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-[0_0_24px_rgba(74,222,128,0.15)] animate-float animate-float-delay-2">
            <Lightbulb size={20} className="text-[#4ADE80]" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute left-[12%] bottom-[15%] hidden lg:block z-20">
          <div className="icon-orb w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-[0_0_24px_rgba(245,208,169,0.15)] animate-float animate-float-delay-3">
            <Shield size={20} className="text-[#F5D0A9]" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute right-[12%] bottom-[12%] hidden lg:block z-20">
          <div className="icon-orb w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.15)] animate-float animate-float-delay-4">
            <Folder size={20} className="text-[#38BDF8]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Hero Title */}
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] max-w-4xl">
          Meet the Platform Built for <br className="hidden md:inline" />
          <span className="aurora-gradient-text">On-Chain Truth</span>
        </h2>

        {/* Rotating Value Props Subline */}
        <div className="h-10 relative w-full flex justify-center items-center mt-6 overflow-hidden">
          {valueProps.map((phrase, idx) => (
            <span
              key={idx}
              className={`absolute text-sm md:text-base text-muted-foreground transition-all duration-700 ease-out ${
                idx === activePhraseIdx 
                  ? 'opacity-100 translate-y-0 font-medium text-white/80' 
                  : 'opacity-0 translate-y-4'
              }`}
            >
              {phrase}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 w-full max-w-md">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 aurora-bg-gradient text-[#07090c] font-bold rounded-full shadow-[0_4px_25px_rgba(56,189,248,0.25)] hover:shadow-[0_4px_35px_rgba(56,189,248,0.45)] hover:scale-[1.02] active:scale-95 transition-all text-sm"
          >
            Start Investigating
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
          <a
            href="mailto:analyst@cryptotrace.com"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-full transition-all duration-200 text-sm"
          >
            Talk to an Analyst
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="py-24 md:py-32 border-t border-white/5 bg-[#07090c]/40 relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side Header */}
        <div className="lg:col-span-5 space-y-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">End-to-End Flow</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
            How CryptoTrace Solves On-Chain Crimes
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed max-w-md">
            Our pipeline automates transaction ingestion, scores exposure using deterministic rules, and delivers explainable audit trails.
          </p>
        </div>

        {/* Right Side Accordion Steps */}
        <div className="lg:col-span-7 space-y-4">
          {steps.map((step, idx) => {
            const isOpen = idx === activeStep;
            return (
              <div 
                key={idx} 
                className={`glass p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isOpen ? 'border-[#38BDF8]/30 bg-white/[0.02]' : 'border-white/5'
                }`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                    isOpen ? 'border-[#38BDF8] text-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'border-white/15 text-muted-foreground'
                  }`}>
                    {step.num}
                  </div>
                  <h3 className="font-serif font-semibold text-base md:text-lg text-white">{step.title}</h3>
                </div>
                
                {isOpen && (
                  <div className="mt-3 pl-12 text-xs md:text-sm text-muted-foreground/80 leading-relaxed animate-fade-in">
                    {step.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto border-t border-white/5 bg-[#07090c]/80 relative z-10 px-6 md:px-12 py-16 max-w-7xl mx-auto w-full">
        
        {/* Closing Headline & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-12">
          <div className="lg:col-span-6">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight leading-none">
              Trace With Confidence.
            </h2>
            <p className="text-xs text-muted-foreground mt-2">Join global intelligence teams following the smart money.</p>
          </div>
          <div className="lg:col-span-6 flex gap-2 w-full max-w-md lg:ml-auto">
            <input 
              type="text" 
              placeholder="Enter investigator email" 
              className="flex-1 bg-secondary/50 border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-muted-foreground/50 focus:outline-none"
            />
            <button className="px-5 py-2.5 aurora-bg-gradient text-[#07090c] font-bold rounded-full text-xs shadow-md">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pt-12 text-xs">
          <div className="col-span-2 md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                <img src="/logo.png" alt="CryptoTrace Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-sm text-white">CryptoTrace</span>
            </div>
            <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-xs">
              On-chain intelligence for financial crime investigation, explainable VASP attribution, and automated disclosure requesting.
            </p>
          </div>
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Product</h4>
            <Link href="/dashboard" className="block text-muted-foreground hover:text-white">Dashboard</Link>
            <Link href="/trace/new" className="block text-muted-foreground hover:text-white">Tracing Pipeline</Link>
            <Link href="/cases" className="block text-muted-foreground hover:text-white">Case Management</Link>
          </div>
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Company</h4>
            <a href="mailto:contact@cryptotrace.com" className="block text-muted-foreground hover:text-white">Contact Sales</a>
            <a href="#" className="block text-muted-foreground hover:text-white">Privacy Policy</a>
            <a href="#" className="block text-muted-foreground hover:text-white">Terms of Use</a>
          </div>
        </div>

        {/* Fine print */}
        <div className="pt-12 mt-12 border-t border-white/5 text-[10px] text-muted-foreground/40 text-center flex flex-col md:flex-row justify-between">
          <span>&copy; {new Date().getFullYear()} CryptoTrace Inc. All rights reserved.</span>
          <span className="mt-2 md:mt-0">CryptoTrace Enterprise Forensic Suite</span>
        </div>
      </footer>

      {/* Floating orbs keyframes animation styles */}
      <style jsx>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .icon-orb {
          animation: floatOrb 5s ease-in-out infinite;
        }
        .animate-float-delay-1 { animation-delay: 0.2s; }
        .animate-float-delay-2 { animation-delay: 1.4s; }
        .animate-float-delay-3 { animation-delay: 2.6s; }
        .animate-float-delay-4 { animation-delay: 3.8s; }
      `}</style>

    </div>
  );
}

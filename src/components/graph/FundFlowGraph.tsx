"use client";

import { useState } from 'react';

// Color definitions matching the dark UI theme
const COLOR_MAP = {
  suspect: '#ef4444',     // Red
  intermediate: '#9ca3af', // Gray
  mixer: '#f59e0b',       // Amber
  vasp: '#3b82f6',        // Blue
};

export default function FundFlowGraph() {
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Nodes configuration
  const nodes = [
    { id: 'suspect', label: 'Suspect Wallet', addr: '0x7a2db9f4e24...b9f4', amount: '15.0 ETH', type: 'suspect', color: COLOR_MAP.suspect, x: 50, y: 150, w: 24, h: 180, info: 'Origin of illicit ransomware campaign funds.' },
    
    { id: 'int1', label: 'Hop 1 Receiver A', addr: '0x11111111111...1111', amount: '10.0 ETH', type: 'intermediate', color: COLOR_MAP.intermediate, x: 280, y: 90, w: 24, h: 100, info: 'Immediate layer-1 hops splitting the initial transaction.' },
    { id: 'int2', label: 'Hop 1 Receiver B', addr: '0x22222222222...2222', amount: '5.0 ETH', type: 'intermediate', color: COLOR_MAP.intermediate, x: 280, y: 260, w: 24, h: 60, info: 'Secondary split destination path.' },
    
    { id: 'mixer1', label: 'Tornado Cash Proxy', addr: '0x12D66f87A04...8Fc', amount: '9.8 ETH', type: 'mixer', color: COLOR_MAP.mixer, x: 520, y: 90, w: 24, h: 100, info: 'Obfuscation mixer pool used to break attribution links.' },
    { id: 'int3', label: 'Hop 2 Receiver B', addr: '0x33333333333...3333', val: 15, type: 'intermediate', color: COLOR_MAP.intermediate, x: 520, y: 260, w: 24, h: 60, info: 'Secondary pass-through layer.' },
    
    { id: 'vasp1', label: 'Binance Hot Wallet', addr: '0x28C6c06298d...1d60', amount: '14.8 ETH', type: 'vasp', color: COLOR_MAP.vasp, x: 760, y: 130, w: 24, h: 180, info: 'Centralized VASP exchange receiving deposit flows.' },
  ];

  // Flow paths connecting the nodes
  const flows = [
    { id: 'flow1', from: 'suspect', to: 'int1', value: 10, label: '10.0 ETH', path: 'M 74,180 C 177,180 177,140 280,140 L 280,240 C 177,240 177,280 74,280 Z', grad: 'grad-suspect-int1' },
    { id: 'flow2', from: 'suspect', to: 'int2', value: 5, label: '5.0 ETH', path: 'M 74,280 C 177,280 177,290 280,290 L 280,320 C 177,320 177,330 74,330 Z', grad: 'grad-suspect-int2' },
    { id: 'flow3', from: 'int1', to: 'mixer1', value: 9.8, label: '9.8 ETH', path: 'M 304,140 C 412,140 412,140 520,140 L 520,238 C 412,238 412,238 304,238 Z', grad: 'grad-int1-mixer1' },
    { id: 'flow4', from: 'int2', to: 'int3', value: 5, label: '5.0 ETH', path: 'M 304,290 C 412,290 412,290 520,290 L 520,320 C 412,320 412,320 304,320 Z', grad: 'grad-int2-int3' },
    { id: 'flow5', from: 'mixer1', to: 'vasp1', value: 9.8, label: '9.8 ETH', path: 'M 544,140 C 652,140 652,180 760,180 L 760,278 C 652,278 652,238 544,238 Z', grad: 'grad-mixer1-vasp1' },
    { id: 'flow6', from: 'int3', to: 'vasp1', value: 5, label: '5.0 ETH', path: 'M 544,290 C 652,290 652,290 760,290 L 760,310 C 652,310 652,320 544,320 Z', grad: 'grad-int3-vasp1' },
  ];

  return (
    <div className="w-full h-full min-h-[500px] bg-[#050505] relative rounded-b-xl overflow-hidden flex flex-col p-6">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2 shrink-0">
        <div>
          <h4 className="text-sm font-semibold text-white">Multi-Hop Sankey Flow Analysis</h4>
          <p className="text-xs text-muted-foreground">Hover over flow bands or click nodes to audit evidence path.</p>
        </div>
      </div>

      <div className="flex-1 relative min-h-[360px] w-full">
        {/* SVG Canvas */}
        <svg viewBox="0 0 840 400" className="w-full h-full select-none">
          <defs>
            {/* Gradients for Flow Bands */}
            <linearGradient id="grad-suspect-int1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLOR_MAP.suspect} stopOpacity="0.45" />
              <stop offset="100%" stopColor={COLOR_MAP.intermediate} stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="grad-suspect-int2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLOR_MAP.suspect} stopOpacity="0.45" />
              <stop offset="100%" stopColor={COLOR_MAP.intermediate} stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="grad-int1-mixer1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLOR_MAP.intermediate} stopOpacity="0.45" />
              <stop offset="100%" stopColor={COLOR_MAP.mixer} stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="grad-int2-int3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLOR_MAP.intermediate} stopOpacity="0.45" />
              <stop offset="100%" stopColor={COLOR_MAP.intermediate} stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="grad-mixer1-vasp1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLOR_MAP.mixer} stopOpacity="0.45" />
              <stop offset="100%" stopColor={COLOR_MAP.vasp} stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="grad-int3-vasp1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLOR_MAP.intermediate} stopOpacity="0.45" />
              <stop offset="100%" stopColor={COLOR_MAP.vasp} stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Flows */}
          {flows.map((flow) => (
            <g key={flow.id}>
              <path
                d={flow.path}
                fill={`url(#${flow.grad})`}
                className="transition-all duration-200 cursor-pointer"
                opacity={hoveredFlow === null ? 1 : hoveredFlow === flow.id ? 1 : 0.25}
                onMouseEnter={() => setHoveredFlow(flow.id)}
                onMouseLeave={() => setHoveredFlow(null)}
              />
              {/* Text label in the middle of flow paths */}
              {hoveredFlow === flow.id && (
                <foreignObject
                  x={flow.id.includes('1') || flow.id.includes('2') ? 140 : 380}
                  y={flow.id.includes('2') || flow.id.includes('4') || flow.id.includes('6') ? 280 : 150}
                  width="100"
                  height="30"
                >
                  <div className="bg-zinc-900 border border-white/20 text-[10px] text-white px-2 py-1 rounded shadow-lg text-center font-semibold pointer-events-none">
                    {flow.label}
                  </div>
                </foreignObject>
              )}
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              className="cursor-pointer group"
              onClick={() => setSelectedNode(node)}
            >
              {/* Main Node Rect */}
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                fill={node.color}
                rx="4"
                className="transition-all duration-200 group-hover:brightness-125"
              />
              
              {/* Node Sidebar highlighting flow */}
              <rect
                x={node.x}
                y={node.y}
                width="4"
                height={node.h}
                fill="#ffffff"
                opacity="0.3"
                rx="2"
              />

              {/* Labels */}
              <text
                x={node.x + 35}
                y={node.y + 20}
                fill="#ffffff"
                className="text-xs font-semibold select-none"
              >
                {node.label}
              </text>
              <text
                x={node.x + 35}
                y={node.y + 38}
                fill="#888888"
                className="text-[10px] font-mono select-none"
              >
                {node.amount || node.addr.substring(0, 12) + '...'}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 z-10 glass-panel p-4 rounded-lg border border-white/10 shadow-2xl max-w-sm w-80 animate-fade-in space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className="font-semibold text-white text-sm">{selectedNode.label}</h4>
              <span
                className="text-[10px] uppercase px-1.5 py-0.5 rounded font-bold"
                style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}
              >
                {selectedNode.type}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Address</p>
              <p className="text-xs font-mono text-white break-all bg-black/40 p-2 rounded">{selectedNode.addr}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Analysis Notes</p>
              <p className="text-xs text-white/80 leading-relaxed">{selectedNode.info}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-1.5 bg-secondary hover:bg-white/10 text-white rounded text-xs transition-colors"
            >
              Close Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
}

export function PageBackground({ children }: PageBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#05070A] text-foreground overflow-x-hidden">
      
      {/* Decorative Aurora Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Blue Blob - Upper Left */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[#07A5E9]/15 blur-[120px]" />
        
        {/* Teal/Green Blob - Upper Center (overlapping) */}
        <div className="absolute top-[-25%] left-[20%] w-[45%] h-[55%] rounded-full bg-[#07E96D]/12 blur-[130px]" />
        
        {/* Coral/Peach Blob - Upper Right Center */}
        <div className="absolute top-[-20%] right-[15%] w-[40%] h-[50%] rounded-full bg-[#E8957C]/10 blur-[120px]" />
        
        {/* Blue Blob - Far Right */}
        <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[45%] rounded-full bg-[#07A5E9]/12 blur-[100px]" />
      </div>

      {/* SVG Noise/Film-Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-20 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
export default PageBackground;

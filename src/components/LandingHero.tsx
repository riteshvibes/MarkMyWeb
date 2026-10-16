/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Network, 
  Activity, 
  Sparkles, 
  Layers, 
  Check, 
  Eye, 
  Lock,
  Play
} from 'lucide-react';

interface LandingHeroProps {
  onExploreDemo: () => void;
  onAnalyzeCustom: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreDemo,
  onAnalyzeCustom,
}) => {
  const [activeSignalStep, setActiveSignalStep] = useState(0);

  // Animated network signal simulation on right-hand hero
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSignalStep(s => (s + 1) % 6);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-950/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-blue-950/25 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Thesis & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Domain Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-cyan-500/30 rounded-full text-xs font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>DIGITAL IDENTITY ATTACK SURFACE INTELLIGENCE</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              SEE YOURSELF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                THE WAY THE INTERNET
              </span> <br />
              SEES YOU.
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Your digital identity isn't one isolated profile. It's an interconnected network of names, places, relationships, and public signals. The danger isn't any single piece of information—<strong>it's what happens when they are connected.</strong>
            </p>

            {/* Value Chain Flow */}
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl max-w-lg text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2">
              <span className="text-slate-200">EXPOSURE</span>
              <span className="text-cyan-500">→</span>
              <span className="text-slate-200">CONNECTION</span>
              <span className="text-cyan-500">→</span>
              <span className="text-slate-200">INFERENCE</span>
              <span className="text-cyan-500">→</span>
              <span className="text-rose-400 font-bold">ATTACK PATH</span>
              <span className="text-cyan-500">→</span>
              <span className="text-emerald-400 font-bold">BREAK CHAIN</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreDemo}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all cursor-pointer"
              >
                <span>Explore Live Demo (Arjun, CS Student)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onAnalyzeCustom}
                className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700/80 transition-all cursor-pointer flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Custom Footprint Scan</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Server Persistence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Passwords Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic ML Logic</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic (Animated Signals Reconstructing into a Target Web) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none bg-[#0B101D] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
              {/* Terminal-like Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="text-slate-400 ml-2">identity_synthesis_engine.graph</span>
                </div>
                <span className="text-cyan-400">STATE: ACTIVE SCAN</span>
              </div>

              {/* Graphic Topology Display */}
              <div className="py-6 relative min-h-[340px] flex items-center justify-center">
                {/* Center Target User Node */}
                <div className="relative z-20 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                    <div className="text-center">
                      <span className="text-xs font-mono font-bold text-white block">USER</span>
                      <span className="text-[10px] font-mono text-cyan-400">TARGET</span>
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-mono text-slate-300 font-semibold bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                    Arjun Sharma
                  </span>
                </div>

                {/* Orbiting Discovered Signals with Animated Links */}
                {[
                  { label: 'IIT Delhi Campus', sub: 'Education', angle: 45, radius: 140, color: 'border-emerald-500 text-emerald-300' },
                  { label: 'Public Mobile (+91)', sub: 'Contact Bridge', angle: 110, radius: 145, color: 'border-rose-500 text-rose-300' },
                  { label: 'Priya Verma', sub: 'Friend / Partner', angle: 180, radius: 135, color: 'border-purple-500 text-purple-300' },
                  { label: 'Sat Football Turf', sub: 'Recurring Geo', angle: 245, radius: 140, color: 'border-amber-500 text-amber-300' },
                  { label: 'GitHub: arjundev99', sub: 'Cross-link', angle: 315, radius: 140, color: 'border-cyan-500 text-cyan-300' },
                ].map((item, i) => {
                  const rad = (item.angle * Math.PI) / 180;
                  const x = Math.cos(rad) * item.radius;
                  const y = Math.sin(rad) * item.radius;
                  const isActive = i <= activeSignalStep;

                  return (
                    <div
                      key={i}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                      className={`absolute z-10 p-2.5 rounded-xl bg-slate-900/90 border shadow-lg text-left transition-all duration-500 ${
                        isActive ? `${item.color} opacity-100 scale-100` : 'border-slate-800 text-slate-600 opacity-30 scale-90'
                      }`}
                    >
                      <div className="text-[9px] font-mono uppercase font-bold tracking-wider opacity-80">
                        {item.sub}
                      </div>
                      <div className="text-xs font-bold whitespace-nowrap text-white">
                        {item.label}
                      </div>
                    </div>
                  );
                })}

                {/* SVG Connecting Ray Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <line x1="50%" y1="50%" x2="70%" y2="25%" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="50%" y1="50%" x2="80%" y2="65%" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 2" opacity="0.8" />
                  <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  {/* High centrality cross-cluster bridge */}
                  <line x1="80%" y1="65%" x2="50%" y2="85%" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
                </svg>
              </div>

              {/* Bottom Telemetry Card */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span className="text-slate-300 font-medium">Reconstruction Score:</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">78/100 HIGH</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  4 Active Attack Paths
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

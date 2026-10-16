/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InferenceItem, InferenceLevel, SignalNode } from '../types/identity';
import { CheckCircle2, AlertTriangle, HelpCircle, Eye, ShieldCheck, ChevronRight } from 'lucide-react';

interface InferenceEngineViewProps {
  inferences: InferenceItem[];
  allSignals: SignalNode[];
}

const LEVEL_TABS: { key: InferenceLevel | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Inferences' },
  { key: 'CONFIRMED', label: 'Confirmed (Facts)' },
  { key: 'LIKELY', label: 'Likely (High Support)' },
  { key: 'POSSIBLE', label: 'Possible (Uncertain)' },
  { key: 'UNKNOWN', label: 'Unknown (Insufficient)' },
];

const LEVEL_CONFIG: Record<InferenceLevel, { label: string; text: string; bg: string; icon: React.ReactNode }> = {
  CONFIRMED: {
    label: 'CONFIRMED FACT',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  },
  LIKELY: {
    label: 'LIKELY INFERENCE',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />,
  },
  POSSIBLE: {
    label: 'POSSIBLE INFERENCE',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
  },
  UNKNOWN: {
    label: 'UNKNOWN / UNOBSERVABLE',
    text: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/30',
    icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />,
  },
};

export const InferenceEngineView: React.FC<InferenceEngineViewProps> = ({
  inferences,
  allSignals,
}) => {
  const [activeFilter, setActiveFilter] = useState<InferenceLevel | 'ALL'>('ALL');

  const filteredInferences = inferences.filter(inf => 
    activeFilter === 'ALL' ? true : inf.level === activeFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            What Can Be Inferred About You?
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Adversaries do not just read explicit posts; they synthesize cross-platform patterns to infer unstated truths. We classify all deductions by epistemic certainty.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#0D1321] p-1 rounded-lg border border-slate-800 self-start">
          {LEVEL_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeFilter === tab.key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Epistemic Certainty Cards */}
      <div className="space-y-4">
        {filteredInferences.map(item => {
          const config = LEVEL_CONFIG[item.level];
          const supportingSignals = allSignals.filter(s => item.evidenceSignals.includes(s.id));

          return (
            <div 
              key={item.id}
              className="p-5 bg-[#0D1321] border border-slate-800 hover:border-slate-700/80 transition-all rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${config.bg} ${config.text}`}>
                    {config.icon}
                    <span>{config.label}</span>
                  </span>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Confidence:</span>
                  <span className={`font-bold tabular-nums ${item.confidence >= 80 ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {item.confidence}%
                  </span>
                </div>
              </div>

              {/* Description & Explanation */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 font-medium mb-1">Synthesized Finding:</div>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="text-slate-400 font-medium mb-1">Deduction Logic & Evidence:</div>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                    {item.explanation}
                  </p>
                </div>
              </div>

              {/* Supporting Evidence Signals */}
              {supportingSignals.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-500 font-mono">SUPPORTING SIGNALS:</span>
                  {supportingSignals.map(sig => (
                    <span 
                      key={sig.id}
                      className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800 text-[11px] font-mono"
                    >
                      {sig.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Adversarial Weaponization Utility */}
              <div className="mt-3 p-2.5 bg-rose-950/20 rounded border border-rose-900/30 text-xs flex items-start gap-2">
                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mt-0.5">
                  Adversary Utility:
                </span>
                <span className="text-rose-200/90 leading-relaxed">
                  {item.attackUtility}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

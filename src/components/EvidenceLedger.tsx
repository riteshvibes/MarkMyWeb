/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SignalNode, FeatureContribution } from '../types/identity';
import { FileCheck, Shield, ExternalLink, Sparkles } from 'lucide-react';

interface EvidenceLedgerProps {
  signals: SignalNode[];
  featureContributions: FeatureContribution[];
}

export const EvidenceLedger: React.FC<EvidenceLedgerProps> = ({
  signals,
  featureContributions,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Traceable Evidence Ledger</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Every predicted risk originates from verified public artifacts. No hallucinated connections.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {signals.length} Verified Evidence Items
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signals.map((sig, idx) => (
          <div 
            key={sig.id}
            className="p-4 bg-[#0D1321] border border-slate-800 hover:border-slate-700 transition-colors rounded-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                  EVIDENCE #0{idx + 1}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  Confidence: <span className="text-cyan-300 font-bold">{sig.confidence}%</span>
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mt-2">{sig.label}</h4>
              <p className="text-xs text-slate-300 font-mono mt-1 bg-slate-950/70 p-2 rounded border border-slate-900">
                {sig.detail}
              </p>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Source: <span className="text-slate-300">{sig.source}</span></span>
                <span className="font-mono text-rose-400">+{sig.riskContribution} pts</span>
              </div>
            </div>

            {sig.inferences.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-500 font-medium">Yields latent inference: </span>
                <span className="text-slate-300 font-medium">{sig.inferences[0]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Model Attribution Ledger Table */}
      <div className="p-5 bg-[#0D1321] border border-slate-800 rounded-xl">
        <h4 className="text-sm font-bold text-white mb-3">Model Weight Attribution Summary</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2 px-3">Feature Cluster</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Baseline Sensitivity</th>
                <th className="py-2 px-3 text-right">Attributed Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {featureContributions.map((fc, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{fc.name}</td>
                  <td className="py-2.5 px-3 uppercase text-[11px] text-slate-400">{fc.category}</td>
                  <td className="py-2.5 px-3 text-slate-400">+{fc.baseline} pts</td>
                  <td className="py-2.5 px-3 text-right font-bold text-rose-400">+{fc.value} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

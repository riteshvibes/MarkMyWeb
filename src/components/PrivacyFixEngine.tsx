/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RemediationAction } from '../types/identity';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ArrowRight, 
  TrendingDown, 
  Check,
  ExternalLink
} from 'lucide-react';

interface PrivacyFixEngineProps {
  remediations: RemediationAction[];
  hiddenNodeIds: Set<string>;
  onApplyRemediation: (targetSignalId: string) => void;
}

const PRIORITY_BADGES = {
  CRITICAL: { text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  HIGH: { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  MEDIUM: { text: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  LOW: { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
};

export const PrivacyFixEngine: React.FC<PrivacyFixEngineProps> = ({
  remediations,
  hiddenNodeIds,
  onApplyRemediation,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>ACTIONABLE REMEDIATION QUEUE</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Break the Chain: What Should I Fix First?
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Generic privacy checklists are overwhelming. Doppelgänger scores every defense by topological leverage: fixing high-centrality bridges breaks multiple attack paths simultaneously.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {remediations.map(rem => {
          const isApplied = hiddenNodeIds.has(rem.targetSignalId);
          const badge = PRIORITY_BADGES[rem.priority];

          return (
            <div
              key={rem.id}
              className={`p-5 rounded-xl border transition-all ${
                isApplied
                  ? 'bg-emerald-950/15 border-emerald-800/40'
                  : 'bg-[#0D1321] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.bg} ${badge.text}`}>
                    {rem.priority} PRIORITY
                  </span>
                  <h4 className="text-base font-bold text-white">{rem.title}</h4>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Effort: <strong className="text-slate-200">{rem.effort}</strong></span>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-{rem.riskReductionPoints} pts</span>
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-8">
                  <div className="text-slate-400 font-medium mb-1">Topological Reason:</div>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                    {rem.reason}
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="text-slate-400 font-medium mb-1">Downstream Impact:</div>
                    <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Affected attack paths:</span>
                        <strong className="text-white font-mono">{rem.affectedPathsCount} paths</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Impact rating:</span>
                        <strong className="text-cyan-400 font-mono">{rem.impact}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onApplyRemediation(rem.targetSignalId)}
                    className={`mt-3 w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      isApplied
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Remediation Applied in Model</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simulate Applying This Fix</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

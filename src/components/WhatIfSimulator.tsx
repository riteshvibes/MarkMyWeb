/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SignalNode, SignalEdge, AttackPath, RiskProfile } from '../types/identity';
import { 
  Sliders, 
  RotateCcw, 
  EyeOff, 
  Eye, 
  TrendingDown, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface WhatIfSimulatorProps {
  allSignals: SignalNode[];
  allEdges: SignalEdge[];
  allAttackPaths: AttackPath[];
  baselineRisk: RiskProfile;
  currentRisk: RiskProfile;
  hiddenNodeIds: Set<string>;
  onToggleHideNode: (nodeId: string) => void;
  onResetSimulation: () => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  allSignals,
  allEdges,
  allAttackPaths,
  baselineRisk,
  currentRisk,
  hiddenNodeIds,
  onToggleHideNode,
  onResetSimulation,
}) => {
  const isModified = hiddenNodeIds.size > 0;
  const scoreDelta = currentRisk.identityReconstructionScore - baselineRisk.identityReconstructionScore;
  const pathsDelta = currentRisk.activeAttackPathsCount - baselineRisk.activeAttackPathsCount;
  const linkabilityDelta = currentRisk.linkabilityRisk - baselineRisk.linkabilityRisk;
  const twinDelta = currentRisk.digitalTwinCompleteness - baselineRisk.digitalTwinCompleteness;

  // Filter non-user signals for toggling
  const actionableSignals = allSignals.filter(s => s.id !== 'sig-user');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>COUNTERFACTUAL RISK ENGINE</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            What If You Remove This Signal?
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Test how targeted privacy actions sever topological bridges in real time. Observe how removing a single key identifier collapses downstream attack paths.
          </p>
        </div>

        {isModified && (
          <button
            onClick={onResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 self-start transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation ({hiddenNodeIds.size} hidden)</span>
          </button>
        )}
      </div>

      {/* Before vs After Impact Hero Banner */}
      <div className="p-6 bg-[#0D1321] border border-cyan-900/40 rounded-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Risk Delta */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Reconstruction Risk</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-400 font-mono line-through">
                {baselineRisk.identityReconstructionScore}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {currentRisk.identityReconstructionScore}
              </span>
            </div>
            <div className="mt-2 text-xs font-semibold flex items-center gap-1 font-mono text-emerald-400">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{scoreDelta === 0 ? 'Baseline' : `${scoreDelta} pts reduction`}</span>
            </div>
          </div>

          {/* Active Attack Paths Delta */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Exploitable Attack Paths</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-400 font-mono line-through">
                {baselineRisk.activeAttackPathsCount}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className={`text-3xl font-extrabold font-mono tabular-nums ${currentRisk.activeAttackPathsCount === 0 ? 'text-emerald-400' : 'text-white'}`}>
                {currentRisk.activeAttackPathsCount}
              </span>
            </div>
            <div className="mt-2 text-xs font-semibold flex items-center gap-1 font-mono text-emerald-400">
              <span>{pathsDelta === 0 ? 'No change' : `${Math.abs(pathsDelta)} paths eliminated`}</span>
            </div>
          </div>

          {/* Linkability Index Delta */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Linkability Index</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-400 font-mono line-through">
                {baselineRisk.linkabilityRisk}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {currentRisk.linkabilityRisk}
              </span>
            </div>
            <div className="mt-2 text-xs font-semibold flex items-center gap-1 font-mono text-cyan-400">
              <span>{linkabilityDelta === 0 ? 'Baseline' : `${linkabilityDelta} pts decoupled`}</span>
            </div>
          </div>

          {/* Twin Completeness Delta */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Digital Twin Completeness</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-400 font-mono line-through">
                {baselineRisk.digitalTwinCompleteness}%
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {currentRisk.digitalTwinCompleteness}%
              </span>
            </div>
            <div className="mt-2 text-xs font-semibold flex items-center gap-1 font-mono text-purple-400">
              <span>{twinDelta === 0 ? 'Baseline' : `${twinDelta}% unobservable`}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Explanation Summary */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            {isModified ? (
              <span>
                <strong>Simulation Output:</strong> Removing <strong className="text-cyan-300">{hiddenNodeIds.size} signal{hiddenNodeIds.size > 1 ? 's' : ''}</strong> severed key inter-cluster bridge connections, reducing overall identity reconstruction capability by <strong className="text-emerald-400 font-mono">{Math.abs(scoreDelta)} points</strong> and neutralising <strong className="text-emerald-400 font-mono">{Math.abs(pathsDelta)} attack paths</strong>.
              </span>
            ) : (
              <span>
                <strong>Baseline State:</strong> All public signals are currently active and linked. Click any of the interactive switches below to simulate the exact impact of privacy remediation actions.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Interactive Signal Toggle Grid */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3">
          Simulate Removing Specific Identity Signals
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actionableSignals.map(sig => {
            const isHidden = hiddenNodeIds.has(sig.id);

            return (
              <div
                key={sig.id}
                data-signal-id={sig.id}
                onClick={() => onToggleHideNode(sig.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isHidden
                    ? 'bg-emerald-950/20 border-emerald-800/60 shadow-lg'
                    : 'bg-[#0D1321] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                        {sig.category}
                      </span>
                      <span className="text-slate-700">·</span>
                      <span className="text-[10px] font-mono text-rose-400 font-bold">
                        +{sig.riskContribution} pts
                      </span>
                    </div>
                    <div className={`text-sm font-bold mt-1 ${isHidden ? 'text-emerald-400 line-through' : 'text-white'}`}>
                      {sig.label}
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isHidden ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                </div>

                <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-900">
                  {sig.detail}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500 text-[11px]">Action:</span>
                  <span className={`font-medium ${isHidden ? 'text-emerald-300' : 'text-slate-300'}`}>
                    {isHidden ? 'Hidden in simulation (Click to restore)' : 'Click to hide signal'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

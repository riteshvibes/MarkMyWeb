/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RiskProfile } from '../types/identity';
import { ShieldAlert, ShieldCheck, Activity, Layers, Network, Lock, HelpCircle, BarChart3 } from 'lucide-react';

interface RiskEngineViewProps {
  riskProfile: RiskProfile;
  isSimulating: boolean;
  scoreDelta?: number;
}

export const RiskEngineView: React.FC<RiskEngineViewProps> = ({
  riskProfile,
  isSimulating,
  scoreDelta = 0,
}) => {
  const {
    identityReconstructionScore,
    exposureRisk,
    linkabilityRisk,
    inferenceRisk,
    impersonationRisk,
    targetabilityRisk,
    digitalTwinCompleteness,
    featureContributions,
    activeAttackPathsCount,
  } = riskProfile;

  // Determine severity tier
  let severityLabel = 'LOW';
  let severityColor = 'text-emerald-400';
  let severityBg = 'bg-emerald-500/10 border-emerald-500/30';
  let scoreGlow = 'rgba(16, 185, 129, 0.2)';

  if (identityReconstructionScore >= 75) {
    severityLabel = 'CRITICAL RISK';
    severityColor = 'text-rose-400';
    severityBg = 'bg-rose-500/10 border-rose-500/30';
    scoreGlow = 'rgba(244, 63, 94, 0.25)';
  } else if (identityReconstructionScore >= 60) {
    severityLabel = 'HIGH RISK';
    severityColor = 'text-amber-400';
    severityBg = 'bg-amber-500/10 border-amber-500/30';
    scoreGlow = 'rgba(245, 158, 11, 0.25)';
  } else if (identityReconstructionScore >= 40) {
    severityLabel = 'MODERATE';
    severityColor = 'text-yellow-400';
    severityBg = 'bg-yellow-500/10 border-yellow-500/30';
    scoreGlow = 'rgba(234, 179, 8, 0.2)';
  }

  return (
    <div className="space-y-6">
      {/* Signature Metric Hero Card */}
      <div className="p-6 bg-[#0D1321] border border-slate-800 rounded-xl relative overflow-hidden">
        {/* Subtle radial accent behind main score */}
        <div 
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-50"
          style={{ background: scoreGlow }}
        />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Main Score Block */}
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl">
              <div className="text-center">
                <span className="text-4xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                  {identityReconstructionScore}
                </span>
                <span className="block text-[11px] font-mono text-slate-500">/ 100</span>
              </div>
              {/* Score Delta Indicator in What-If mode */}
              {isSimulating && scoreDelta !== 0 && (
                <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${
                  scoreDelta < 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-400">
                  SIGNATURE RISK METRIC
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${severityBg} ${severityColor}`}>
                  {severityLabel}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                Identity Reconstruction Score
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
                Represents how easily an outsider could construct a convincing representation of this digital identity from available signals. Multiple public signals can be connected into a highly identifiable profile.
              </p>
            </div>
          </div>

          {/* Quick Stat Pillards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Twin Completeness</div>
              <div className="text-xl font-bold text-slate-200 mt-1 font-mono tabular-nums">
                {digitalTwinCompleteness}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Observable profile</div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Active Attack Paths</div>
              <div className={`text-xl font-bold mt-1 font-mono tabular-nums ${activeAttackPathsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {activeAttackPathsCount} paths
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Exploitable chains</div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Model Type</div>
              <div className="text-xs font-semibold text-cyan-400 mt-1.5 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Prototype ML</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">XGBoost / Graph Logic</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Dimensional Breakdown Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Exposure Risk', value: exposureRisk, desc: 'Public raw signal availability' },
          { label: 'Linkability Risk', value: linkabilityRisk, desc: 'Cross-cluster identifier bridges' },
          { label: 'Inference Risk', value: inferenceRisk, desc: 'Latent facts deduced from links' },
          { label: 'Impersonation Risk', value: impersonationRisk, desc: 'Trust & relationship credibility' },
          { label: 'Targetability Risk', value: targetabilityRisk, desc: 'Physical routines & direct contact' },
        ].map((dim, i) => (
          <div key={i} className="p-4 bg-[#0D1321] border border-slate-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{dim.label}</span>
                <span className="text-xs font-mono font-bold text-white tabular-nums">{dim.value}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dim.desc}</p>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  dim.value >= 75 ? 'bg-rose-500' : dim.value >= 55 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${dim.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Model Explainability & Feature Attribution */}
      <div className="p-5 bg-[#0D1321] border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Model Feature Contributions (Attribution Engine)</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Label: Prototype Risk Model
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {featureContributions.map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{feat.name}</span>
                  <span className="font-mono font-bold text-rose-400 tabular-nums">+{feat.value} pts</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-cyan-500/30 rounded-l-full"
                    style={{ width: `${Math.min(100, feat.baseline * 4)}%` }}
                    title="Baseline sensitivity"
                  />
                  <div 
                    className="h-full bg-rose-500 rounded-r-full"
                    style={{ width: `${Math.min(100, feat.value * 3.5)}%` }}
                    title="Active model attribution"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs flex flex-col justify-between">
            <div>
              <div className="text-slate-300 font-semibold mb-1">Architectural Integrity Note:</div>
              <p className="text-slate-400 leading-relaxed text-[12px]">
                In accordance with rigorous ML ethics, this system does not claim benchmark accuracy on unverified data. Predictions are generated by a deterministic prototype scoring engine incorporating graph centrality, topological bridge weights, and multi-factor linkability models.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Mathematical Formulation:</span>
              <span className="font-mono text-cyan-400">Score = ∑ (W_i · Signal_i) · Bridge_factor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

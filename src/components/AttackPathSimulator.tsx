/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AttackPath, ThreatActorType } from '../types/identity';
import { 
  ShieldAlert, 
  ArrowRight, 
  ShieldCheck, 
  UserX, 
  Briefcase, 
  AlertOctagon, 
  DollarSign, 
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AttackPathSimulatorProps {
  attackPaths: AttackPath[];
  hiddenNodeIds: Set<string>;
  onBreakChain: (signalId: string) => void;
  onHighlightPath: (signalIds: string[]) => void;
}

const ACTOR_CONFIG: Record<ThreatActorType, { label: string; icon: React.ReactNode; desc: string }> = {
  IMPERSONATOR: {
    label: 'Impersonator',
    icon: <UserX className="w-4 h-4 text-purple-400" />,
    desc: 'Simulates trust relationships to extract money or credentials from mutual contacts.',
  },
  SOCIAL_ENGINEER: {
    label: 'Social Engineer',
    icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
    desc: 'Exploits contextual routines and organizational roles for high-credibility spear-phishing.',
  },
  FAKE_RECRUITER: {
    label: 'Fake Recruiter',
    icon: <Briefcase className="w-4 h-4 text-amber-400" />,
    desc: 'Targets academic and workplace credentials with weaponized interview lures and assessments.',
  },
  FRAUDSTER: {
    label: 'Fraudster',
    icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    desc: 'Attempts SIM-swapping, channel takeover, or financial diversion using public identifiers.',
  },
};

const STAGE_LABELS = {
  EXPOSED_SIGNAL: { step: '01', title: 'EXPOSED SIGNAL', color: 'border-slate-700 bg-slate-900/80 text-slate-300' },
  IDENTITY_LINK: { step: '02', title: 'IDENTITY LINK', color: 'border-blue-900/60 bg-blue-950/40 text-blue-300' },
  TRUST_SIGNAL: { step: '03', title: 'TRUST SIGNAL', color: 'border-purple-900/60 bg-purple-950/40 text-purple-300' },
  POTENTIAL_ABUSE: { step: '04', title: 'POTENTIAL ABUSE', color: 'border-rose-900/60 bg-rose-950/40 text-rose-300' },
  DEFENSIVE_ACTION: { step: '05', title: 'DEFENSIVE ACTION', color: 'border-emerald-900/60 bg-emerald-950/40 text-emerald-300' },
};

export const AttackPathSimulator: React.FC<AttackPathSimulatorProps> = ({
  attackPaths,
  hiddenNodeIds,
  onBreakChain,
  onHighlightPath,
}) => {
  const [selectedActor, setSelectedActor] = useState<ThreatActorType | 'ALL'>('ALL');

  const filteredPaths = attackPaths.filter(p => 
    selectedActor === 'ALL' ? true : p.threatActor === selectedActor
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            How Could This Identity Be Abused?
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Adversaries chain seemingly benign signals to manufacture unearned trust. We model defensive attack graphs to identify single points of failure that sever the entire chain.
          </p>
        </div>

        {/* Threat Model Filters */}
        <div className="flex items-center gap-1 bg-[#0D1321] p-1 rounded-lg border border-slate-800 self-start">
          <button
            onClick={() => setSelectedActor('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              selectedActor === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Actors
          </button>
          {(['IMPERSONATOR', 'SOCIAL_ENGINEER', 'FAKE_RECRUITER', 'FRAUDSTER'] as const).map(actor => (
            <button
              key={actor}
              onClick={() => setSelectedActor(actor)}
              className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                selectedActor === actor
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ACTOR_CONFIG[actor].icon}
              <span className="hidden sm:inline">{ACTOR_CONFIG[actor].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Threat Actor Overview Card */}
      {selectedActor !== 'ALL' && (
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4 text-xs">
          <div className="p-2.5 bg-slate-800 rounded-lg">
            {ACTOR_CONFIG[selectedActor].icon}
          </div>
          <div>
            <span className="font-bold text-white text-sm">
              Threat Actor Profile: {ACTOR_CONFIG[selectedActor].label}
            </span>
            <p className="text-slate-400 mt-0.5">{ACTOR_CONFIG[selectedActor].desc}</p>
          </div>
        </div>
      )}

      {/* Attack Path Visual Chains */}
      <div className="space-y-6">
        {filteredPaths.map(path => {
          // Check if path is currently active or broken
          const isBroken = path.requiredSignalIds.some(id => hiddenNodeIds.has(id));
          const breakSignalId = path.requiredSignalIds[0];

          return (
            <div
              key={path.id}
              className={`p-6 rounded-xl border transition-all duration-300 ${
                isBroken
                  ? 'bg-emerald-950/10 border-emerald-900/40 opacity-75'
                  : 'bg-[#0D1321] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isBroken ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {isBroken ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {ACTOR_CONFIG[path.threatActor].label}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isBroken
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {isBroken ? 'CHAIN NEUTRALIZED' : `${path.severity} THREAT`}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mt-0.5">{path.title}</h4>
                  </div>
                </div>

                {/* Path Status Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => onHighlightPath(path.requiredSignalIds)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
                  >
                    Highlight in Graph
                  </button>

                  {breakSignalId && (
                    <button
                      onClick={() => onBreakChain(breakSignalId)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                        isBroken
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40'
                      }`}
                    >
                      {isBroken ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Restore Chain</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Break This Chain</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                {path.description}
              </p>

              {/* 5-Step Visual Chain Flow */}
              <div className="mt-6 relative">
                {/* Horizontal line for desktop connecting steps */}
                <div className="hidden lg:block absolute top-7 left-8 right-8 h-0.5 bg-slate-800 z-0" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
                  {path.steps.map((step, stepIdx) => {
                    const cfg = STAGE_LABELS[step.stage];
                    const isStepBroken = isBroken && step.stage !== 'DEFENSIVE_ACTION';

                    return (
                      <div
                        key={stepIdx}
                        className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${cfg.color} ${
                          isStepBroken ? 'line-through opacity-40' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                            <span>{cfg.step}. {cfg.title}</span>
                          </div>
                          <div className="text-xs font-bold mt-2 text-white">
                            {step.label}
                          </div>
                          <div className="text-[11px] mt-1 text-slate-300 leading-snug">
                            {step.detail}
                          </div>
                        </div>

                        {step.signalId && (
                          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                            Required: {step.signalId}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Broken state banner */}
              {isBroken && (
                <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Defensive remediation applied! The prerequisite signal was severed, invalidating the attacker's trust model.
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400 font-bold shrink-0">
                    CHAIN DISRUPTED
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

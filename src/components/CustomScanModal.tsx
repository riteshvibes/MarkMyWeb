/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Scan, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  User, 
  Mail, 
  Building2, 
  Phone 
} from 'lucide-react';

interface CustomScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteScan: (customName: string, customCollege: string) => void;
}

const ANALYSIS_STEPS = [
  'Extracting public identity signals...',
  'Mapping topological relationships & affiliations...',
  'Evaluating cross-platform handle linkability...',
  'Calculating latent epistemic inference risk...',
  'Synthesizing adversarial attack path chains...',
  'Preparing prioritized topological recommendations...',
];

export const CustomScanModal: React.FC<CustomScanModalProps> = ({
  isOpen,
  onClose,
  onCompleteScan,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [institution, setInstitution] = useState('');
  const [contact, setContact] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const startAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < ANALYSIS_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          onCompleteScan(name || 'Custom Analyst', institution || 'Autonomous Tech Hub');
        }, 600);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#090D16] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Analyze Digital Footprint
            </h3>
          </div>
          {!isAnalyzing && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form State or Progress State */}
        {!isAnalyzing ? (
          <form onSubmit={startAnalysis} className="mt-4 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter public fragments you want to audit. In accordance with zero-knowledge privacy, no authentication or passwords are ever required.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Target Name or Public Alias:
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Public Username / Handle:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. @alex_codes or alexm99"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  University or Workplace:
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="e.g. Stanford University / Stripe"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Public Phone or Community Flyer Contact (Optional):
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="e.g. +1 555-0192 (or leave empty)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Quick Demo Pre-fill */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Or populate with sample inputs:</span>
              <button
                type="button"
                onClick={() => {
                  setName('Kabir Mehta');
                  setUsername('@kabir_ai');
                  setInstitution('BITS Pilani');
                  setContact('+91 98112-34567');
                }}
                className="text-cyan-400 hover:underline"
              >
                Auto-fill Sample Signals
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Synthesize Digital Footprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Multi-Step Analysis Loading Sequence */
          <div className="py-8 space-y-6">
            <div className="flex items-center gap-3">
              <Scan className="w-6 h-6 text-cyan-400 animate-spin" />
              <div>
                <h4 className="text-base font-bold text-white">ANALYZING DIGITAL FOOTPRINT</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Building cross-cluster topological identity graph...
                </p>
              </div>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {ANALYSIS_STEPS.map((stepText, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-2 rounded transition-colors ${
                      isCurrent
                        ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300'
                        : isPassed
                        ? 'text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

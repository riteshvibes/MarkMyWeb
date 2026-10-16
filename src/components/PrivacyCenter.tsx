/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Download, 
  RefreshCw, 
  Lock, 
  Database, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface PrivacyCenterProps {
  onClearSession: () => void;
  personaName: string;
}

export const PrivacyCenter: React.FC<PrivacyCenterProps> = ({
  onClearSession,
  personaName,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportReport = () => {
    const reportData = {
      product: 'DOPPELGÄNGER - Digital Identity Reconstruction Engine',
      timestamp: new Date().toISOString(),
      evaluatedSubject: personaName,
      architecture: 'Zero-Persistence Client Evaluation Mode',
      guarantees: [
        'No passwords or private auth tokens requested',
        'No surveillance scraping of unauthorized private accounts',
        'All graph calculations executed deterministically in client sandbox',
        'Zero telemetry sent to 3rd-party advertising brokers',
      ],
      compliance: 'Privacy-by-Design ISO/IEC 27701 & GDPR Article 25 Compliant',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doppelganger-privacy-audit-${personaName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>ETHICAL ARCHITECTURE & PRIVACY BY DESIGN</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Privacy Center & Governance Ledger
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Privacy software must hold itself to the highest standard. Doppelgänger operates under strict zero-persistence guarantees. Your digital footprint analysis exists only in active memory.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Report Exported!' : 'Export Audit Report'}</span>
          </button>

          <button
            onClick={onClearSession}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded-lg border border-rose-800/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Session & Purge</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars of Governance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1321] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DATA ANALYZED</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <div className="text-lg font-bold text-white mt-2">Session Memory</div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluated strictly in browser runtime memory. No cookies or local storage tracking.
          </p>
        </div>

        <div className="p-4 bg-[#0D1321] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SERVER STORAGE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-lg font-bold text-emerald-400 mt-2 font-mono">0 Bytes</div>
          <p className="text-xs text-slate-400 mt-1">
            Zero persistence. We do not maintain any central repository of scanned identity graphs.
          </p>
        </div>

        <div className="p-4 bg-[#0D1321] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PROCESSING MODE</span>
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          </div>
          <div className="text-lg font-bold text-white mt-2">Client Sandbox</div>
          <p className="text-xs text-slate-400 mt-1">
            Graph traversal, scoring heuristics, and inference trees compute entirely on your device.
          </p>
        </div>

        <div className="p-4 bg-[#0D1321] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CREDENTIAL INGESTION</span>
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          </div>
          <div className="text-lg font-bold text-white mt-2">Strictly Prohibited</div>
          <p className="text-xs text-slate-400 mt-1">
            Never prompts for passwords, OAuth tokens, private SMS, or unauthorized inbox access.
          </p>
        </div>
      </div>

      {/* Ethical Code of Conduct */}
      <div className="p-6 bg-[#0D1321] border border-slate-800 rounded-xl space-y-4">
        <h4 className="text-base font-bold text-white">Constitutional Security Principles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Defensive-Only Attack Modeling:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Attack paths simulate structural adversary tactics solely to identify which signals must be broken. No actionable exploitation payloads or illegal harassment instructions are ever output.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">No Epistemic Inflation:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Latent inferences are never disguised as verified facts. Probabilistic deductions are explicitly demarcated as LIKELY or POSSIBLE with transparent confidence bounds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Immediate User Right to Erasure:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Clicking "Clear Session" purges the in-memory graph instantly. No analytical telemetry or profile remnants remain cached.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">No Surveillance Capitalism:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                We believe your digital footprint belongs exclusively to you. Doppelgänger will never sell anonymized graph aggregates or risk profiles to data brokers or insurers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

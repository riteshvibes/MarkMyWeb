/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Camera, 
  Scan, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface DetectedSignal {
  id: string;
  category: string;
  label: string;
  confidence: number;
  box: { top: number; left: number; width: number; height: number }; // percentages
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  remediation: string;
}

const SAMPLE_PHOTO_SIGNALS: DetectedSignal[] = [
  {
    id: 'det-id-badge',
    category: 'CREDENTIAL / IDENTITY',
    label: 'University Student ID Card',
    confidence: 98,
    box: { top: 52, left: 36, width: 20, height: 28 },
    severity: 'CRITICAL',
    description: 'Contains student full name ("Emma S. Davis"), major ("Bioengineering"), student ID number, and face portrait.',
    remediation: 'Redact name, photo, and student ID barcode before posting.',
  },
  {
    id: 'det-event-pass',
    category: 'BEHAVIOR / EVENT',
    label: 'Conference Pass with QR Code',
    confidence: 96,
    box: { top: 58, left: 60, width: 24, height: 35 },
    severity: 'HIGH',
    description: 'Conference pass shows "University Leadership Summit 2024", delegate name, venue ("Husky Hall"), and high-density scannable QR code.',
    remediation: 'Blur QR code (often encodes raw email or attendee ticket ID).',
  },
  {
    id: 'det-institution',
    category: 'LOCATION / INSTITUTION',
    label: 'University Branding & Lanyard',
    confidence: 94,
    box: { top: 38, left: 60, width: 18, height: 16 },
    severity: 'MEDIUM',
    description: 'Coffee mug and lanyard prominently display "University of Washington Huskies" logos, confirming campus physical presence.',
    remediation: 'Crop or position items to avoid broadcasting current campus location.',
  },
  {
    id: 'det-hardware',
    category: 'DEVICE / METADATA',
    label: 'Hardware & Workstation Context',
    confidence: 88,
    box: { top: 22, left: 0, width: 44, height: 60 },
    severity: 'MEDIUM',
    description: 'High-res screen and keyboard layout allows device fingerprinting and physical keyboard reconnaissance.',
    remediation: 'Ensure screen is powered down or angled away from camera.',
  },
];

export const ImagePrivacyAnalyzer: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<string>('/src/assets/images/sample_privacy_photo_1792140549630.jpg');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [redactedSignalIds, setRedactedSignalIds] = useState<Set<string>>(new Set());
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const toggleRedact = (id: string) => {
    setRedactedSignalIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const url = URL.createObjectURL(file);
      setActivePhoto(url);
      setTimeout(() => {
        setIsScanning(false);
      }, 900);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>OPTICAL PRIVACY EXTRACTION</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Image Privacy & Visual Leak Analysis
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every photo carries unintentional visual signals: credentials on desks, conference badges, QR codes, and institutional landmarks that connect your physical and digital identities.
          </p>
        </div>

        {/* Upload & Controls */}
        <div className="flex items-center gap-2 self-start">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>

          <button
            onClick={() => setShowBoundingBoxes(b => !b)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showBoundingBoxes
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showBoundingBoxes ? 'Hide Overlays' : 'Show Overlays'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Image Canvas with Bounding Boxes */}
        <div className="lg:col-span-7 bg-[#0D1321] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-4/3 flex items-center justify-center">
            <img
              src={activePhoto}
              alt="Privacy scan target"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />

            {/* Scanning radar sweep animation when file uploaded */}
            {isScanning && (
              <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-xs flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-cyan-500/50 rounded-lg text-cyan-300 text-xs font-mono">
                  <Scan className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Scanning image tensors for privacy signals...</span>
                </div>
              </div>
            )}

            {/* Bounding Boxes */}
            {showBoundingBoxes && !isScanning && SAMPLE_PHOTO_SIGNALS.map(sig => {
              const isSelected = selectedSignalId === sig.id;
              const isRedacted = redactedSignalIds.has(sig.id);

              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignalId(isSelected ? null : sig.id)}
                  style={{
                    top: `${sig.box.top}%`,
                    left: `${sig.box.left}%`,
                    width: `${sig.box.width}%`,
                    height: `${sig.box.height}%`,
                  }}
                  className={`absolute cursor-pointer transition-all ${
                    isRedacted
                      ? 'bg-black/90 backdrop-blur-md border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono'
                      : isSelected
                      ? 'border-2 border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-500/20'
                      : sig.severity === 'CRITICAL'
                      ? 'border-2 border-rose-500 bg-rose-500/15'
                      : 'border-2 border-amber-500 bg-amber-500/15'
                  }`}
                >
                  {isRedacted ? (
                    <span className="font-bold text-slate-300">REDACTED</span>
                  ) : (
                    <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-white whitespace-nowrap rounded">
                      {sig.label} ({sig.confidence}%)
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>
              <strong className="text-slate-200">4</strong> potentially identifying visual signals detected in scene.
            </span>
            <span className="font-mono text-cyan-400 text-[11px]">
              Computer Vision Heuristic Model v1.2
            </span>
          </div>
        </div>

        {/* Right: Detected Signals & Redaction Controls */}
        <div className="lg:col-span-5 space-y-3">
          {SAMPLE_PHOTO_SIGNALS.map(sig => {
            const isSelected = selectedSignalId === sig.id;
            const isRedacted = redactedSignalIds.has(sig.id);

            return (
              <div
                key={sig.id}
                onClick={() => setSelectedSignalId(sig.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#131B2E] border-cyan-500/60 shadow-lg'
                    : 'bg-[#0D1321] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        {sig.category}
                      </span>
                      <span className="text-slate-700">·</span>
                      <span className={`text-[10px] font-mono font-bold ${
                        sig.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {sig.severity}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{sig.label}</h4>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRedact(sig.id);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded flex items-center gap-1 transition-colors ${
                      isRedacted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isRedacted ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{isRedacted ? 'Restore' : 'Simulate Redact'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {sig.description}
                </p>

                <div className="mt-3 p-2 bg-slate-900/80 rounded border border-slate-800/80 text-[11px] text-cyan-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{sig.remediation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

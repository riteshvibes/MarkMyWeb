/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Network, 
  Activity, 
  Flame, 
  Sliders, 
  Lock, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDES = [
  {
    number: '01',
    title: 'THE PROBLEM',
    subtitle: 'The Fragmentation Fallacy',
    heading: 'We think our digital footprint is isolated profiles.',
    body: 'People believe a LinkedIn job update, an Instagram sports photo, and a GitHub commit email are separate. An attacker or fraudster does not treat them as separate silos. They aggregate fragments into a coherent identity.',
    takeaway: 'Isolated disclosures create a collective, unmanaged attack surface.',
    icon: <Flame className="w-8 h-8 text-rose-400" />,
  },
  {
    number: '02',
    title: 'THE INSIGHT',
    subtitle: 'Connections Are Where Risk Lives',
    heading: 'Risk does not come from isolated information. It comes from connections.',
    body: 'A phone number alone is harmless. A university alone is common. But a phone number connected to a college project teammate, linked to a recurring Saturday football location, creates high-probability spear-phishing and trust exploitation.',
    takeaway: 'Traditional privacy tools audit isolated data. We model the graph.',
    icon: <Network className="w-8 h-8 text-cyan-400" />,
  },
  {
    number: '03',
    title: 'THE SOLUTION',
    subtitle: 'Introducing Doppelgänger',
    heading: 'See yourself the way the internet sees you.',
    body: 'Doppelgänger constructs your Digital Identity Graph, runs an explainable ML Risk Engine, synthesizes latent inferences, maps defensive attack paths, and lets you interactively simulate breaking those chains.',
    takeaway: 'The loop: EXPOSURE → CONNECTION → INFERENCE → RISK → ATTACK PATH → DEFENSE.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
  },
  {
    number: '04',
    title: 'THE IDENTITY GRAPH',
    subtitle: 'Signature Visual Intelligence',
    heading: 'Mapping the topological attack surface of identity.',
    body: 'Nodes represent verified signals (names, locations, relationships, identifiers, behavioral routines). Edges represent semantic connections. High-centrality bridges identify the fragile choke points that connect disparate aspects of your life.',
    takeaway: 'Intuitive visual proof that seemingly harmless data forms an exploitable web.',
    icon: <Network className="w-8 h-8 text-blue-400" />,
  },
  {
    number: '05',
    title: 'EXPLAINABLE ML RISK ENGINE',
    subtitle: 'Zero Hallucinated Metrics',
    heading: 'Signature Metric: Identity Reconstruction Score.',
    body: 'We reject arbitrary AI vanity scores. Our transparent Prototype Risk Model quantifies Exposure, Linkability, Inference, Impersonation, and Targetability. We output explainable SHAP-like feature attributions so every risk is mathematically grounded.',
    takeaway: '78/100 HIGH RISK with explicit feature contribution transparency.',
    icon: <Activity className="w-8 h-8 text-purple-400" />,
  },
  {
    number: '06',
    title: 'INFERENCE & ATTACK PATHS',
    subtitle: 'Adversarial Threat Simulation',
    heading: 'Separating Confirmed Facts from Probabilistic Inferences.',
    body: 'Adversaries weaponize inferences: CONFIRMED facts vs LIKELY deductions vs POSSIBLE conjectures. We model 4 threat actors (Impersonator, Social Engineer, Fake Recruiter, Fraudster) along 5 defensive stages to show exactly how trust is manufactured.',
    takeaway: 'Defensive-only simulations show how attackers chain signals into attacks.',
    icon: <Flame className="w-8 h-8 text-amber-400" />,
  },
  {
    number: '07',
    title: 'WHAT-IF PRIVACY SIMULATOR',
    subtitle: 'Counterfactual Security Optimization',
    heading: 'Simulate removing one signal. Watch the entire attack path collapse.',
    body: 'The hero demo interaction: Toggling off a single public mobile number reduces risk from 78 to 61 (-17 pts), collapses attack paths from 4 to 2, and severs cross-cluster linkability from 82 to 64.',
    takeaway: 'Users leave knowing precisely which single action provides the highest ROI.',
    icon: <Sliders className="w-8 h-8 text-cyan-400" />,
  },
  {
    number: '08',
    title: 'PRIVACY BY DESIGN',
    subtitle: 'Zero Knowledge, Zero Telemetry',
    heading: 'A privacy tool that truly respects privacy.',
    body: 'No passwords. No private OAuth tokens. No server-side persistence. All graph calculations, computer vision heuristic models, and counterfactuals compute entirely client-side in browser session memory. 1-click full session purge.',
    takeaway: 'Zero bytes stored on servers. Transparent constitutional security.',
    icon: <Lock className="w-8 h-8 text-emerald-400" />,
  },
  {
    number: '09',
    title: 'THE FUTURE',
    subtitle: 'From Audit to Active Shield',
    heading: 'Doppelgänger → Digital Identity Firewall.',
    body: 'The roadmap expands from static analysis to active pre-post browser warnings, mobile OS EXIF scrubbers, and Graph Neural Networks (GNN) protecting both individuals and enterprise teams from coordinated Business Email Compromise (BEC).',
    takeaway: 'The ultimate shield for your digital identity attack surface.',
    icon: <Compass className="w-8 h-8 text-cyan-400" />,
  },
];

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex(i => (i + 1) % SLIDES.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(i => (i - 1 + SLIDES.length) % SLIDES.length);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#090D16] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[520px]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0C121F]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-cyan-400">
              DOPPELGÄNGER EXECUTIVE BRIEFING
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              SLIDE {slide.number} OF 09
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close pitch deck"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                {slide.icon}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  {slide.subtitle}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {slide.heading}
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              {slide.body}
            </p>

            {/* Core Takeaway Pill */}
            <div className="pt-4">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Key Takeaway:</strong> {slide.takeaway}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slide Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0C121F]">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlideIndex === i ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Jump to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex(i => (i - 1 + SLIDES.length) % SLIDES.length)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlideIndex(i => (i + 1) % SLIDES.length)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

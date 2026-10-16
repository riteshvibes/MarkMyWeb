/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Chrome, 
  BellRing, 
  Network, 
  Cpu, 
  Building2,
  ArrowRight
} from 'lucide-react';

const ROADMAP_ITEMS = [
  {
    phase: 'PHASE 01 (NEAR TERM)',
    title: 'Pre-Post Privacy Guardian Browser Extension',
    icon: <Chrome className="w-4 h-4 text-cyan-400" />,
    desc: 'Lightweight browser extension that inspects text boxes and image uploads before you click publish on social media, warning if a post creates a high-centrality bridge.',
    status: 'In Prototyping',
  },
  {
    phase: 'PHASE 01 (NEAR TERM)',
    title: 'Mobile OS Privacy Assistant',
    icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
    desc: 'Background daemon for iOS/Android that scrubs EXIF location data, serial numbers, and background reflections prior to cloud sync.',
    status: 'Architecture Design',
  },
  {
    phase: 'PHASE 02 (EXPANSION)',
    title: 'Continuous Digital Exposure Monitoring',
    icon: <BellRing className="w-4 h-4 text-purple-400" />,
    desc: 'Autonomous daily graph diff engine alerting users when a new public record (alumni directory, conference agenda, court filing) links to an existing node.',
    status: 'Research Phase',
  },
  {
    phase: 'PHASE 02 (EXPANSION)',
    title: 'Graph Neural Networks (GNN) Attack Path Learning',
    icon: <Network className="w-4 h-4 text-purple-400" />,
    desc: 'Moving from heuristic graph centrality to inductive Graph Convolutional Networks (GCN) trained on anonymized adversarial threat intelligence datasets.',
    status: 'Academic Collab',
  },
  {
    phase: 'PHASE 03 (ENTERPRISE)',
    title: 'Enterprise Digital Identity Firewall',
    icon: <Building2 className="w-4 h-4 text-rose-400" />,
    desc: 'Protecting executives and employees from Business Email Compromise (BEC) by modeling the collective attack surface of the entire corporate org chart.',
    status: 'Enterprise Pilot',
  },
  {
    phase: 'PHASE 03 (EDGE ML)',
    title: 'Zero-Telemetry On-Device WebGPU Inference',
    icon: <Cpu className="w-4 h-4 text-rose-400" />,
    desc: 'Running 100% of graph parsing and computer vision locally using WebGPU and client-side ONNX runtimes with zero server network packets.',
    status: 'R&D',
  },
];

export const FutureRoadmap: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>PRODUCT VISION & STRATEGY</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            The Horizon: From Footprint Scanner to Digital Identity Firewall
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Doppelgänger is not merely an audit dashboard. It is the foundation for an active, real-time defense layer protecting users from the weaponization of public data.
          </p>
        </div>
      </div>

      {/* Hero Vision Banner */}
      <div className="p-6 bg-gradient-to-r from-[#0D1321] via-slate-900 to-[#0A1628] border border-cyan-900/40 rounded-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              LONG-TERM STRATEGIC VECTOR
            </span>
            <div className="flex items-center gap-3 text-2xl font-bold text-white">
              <span>DOPPELGÄNGER</span>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300">DIGITAL IDENTITY FIREWALL</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              We envision a future where individuals control how their digital identity reflects into the public domain—interactively breaking attack chains before adversaries can exploit them.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-1.5 shrink-0">
            <div className="text-slate-500 uppercase text-[10px]">Strategic Thesis</div>
            <div>Attack Surface = Vertices + Bridges</div>
            <div>Defense = Strategic Severance</div>
            <div className="text-emerald-400">Target: Zero Unverified Inferences</div>
          </div>
        </div>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROADMAP_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="p-5 bg-[#0D1321] border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {item.phase}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <div className="p-1.5 bg-slate-800 rounded-lg shrink-0">
                  {item.icon}
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {item.title}
                </h4>
              </div>

              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

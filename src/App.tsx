/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DEMO_PERSONAS } from './data/personas';
import { calculateRiskProfile } from './utils/riskEngine';
import { IdentityGraph } from './components/IdentityGraph';
import { RiskEngineView } from './components/RiskEngineView';
import { EvidenceLedger } from './components/EvidenceLedger';
import { InferenceEngineView } from './components/InferenceEngineView';
import { AttackPathSimulator } from './components/AttackPathSimulator';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ImagePrivacyAnalyzer } from './components/ImagePrivacyAnalyzer';
import { PrivacyFixEngine } from './components/PrivacyFixEngine';
import { PrivacyCenter } from './components/PrivacyCenter';
import { FutureRoadmap } from './components/FutureRoadmap';
import { PitchDeckModal } from './components/PitchDeckModal';
import { DemoTourGuide } from './components/DemoTourGuide';
import { LandingHero } from './components/LandingHero';
import { CustomScanModal } from './components/CustomScanModal';
import { 
  Network, 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Eye, 
  Flame, 
  Lock, 
  Presentation, 
  RotateCcw, 
  ChevronDown, 
  Sparkles,
  Camera,
  Compass,
  FileCheck
} from 'lucide-react';

export default function App() {
  // Navigation & Persona State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('persona-arjun');
  const [showLandingHero, setShowLandingHero] = useState<boolean>(true);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);
  const [isCustomScanOpen, setIsCustomScanOpen] = useState<boolean>(false);

  // Hidden nodes for What-If Simulation
  const [hiddenNodeIds, setHiddenNodeIds] = useState<Set<string>>(new Set());

  // Graph interaction state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedPathSignalIds, setHighlightedPathSignalIds] = useState<string[]>([]);

  // Active persona profile
  const currentPersona = useMemo(() => {
    return DEMO_PERSONAS.find(p => p.id === selectedPersonaId) || DEMO_PERSONAS[0];
  }, [selectedPersonaId]);

  // Baseline risk profile (all nodes active)
  const baselineRiskProfile = useMemo(() => {
    return calculateRiskProfile(
      currentPersona.signals,
      currentPersona.edges,
      currentPersona.attackPaths,
      new Set()
    );
  }, [currentPersona]);

  // Current counterfactual risk profile (with hidden nodes applied)
  const currentRiskProfile = useMemo(() => {
    return calculateRiskProfile(
      currentPersona.signals,
      currentPersona.edges,
      currentPersona.attackPaths,
      hiddenNodeIds
    );
  }, [currentPersona, hiddenNodeIds]);

  // Node toggle handler for What-If simulator
  const handleToggleHideNode = (nodeId: string) => {
    setHiddenNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Quick helper for demo tour guide
  const handleSimulatePhone = () => {
    handleToggleHideNode('sig-phone');
  };

  // Reset simulation
  const handleResetSimulation = () => {
    setHiddenNodeIds(new Set());
    setHighlightedPathSignalIds([]);
  };

  // Clear session completely
  const handleClearSession = () => {
    setHiddenNodeIds(new Set());
    setSelectedNodeId(null);
    setHighlightedPathSignalIds([]);
    setShowLandingHero(true);
    setActiveTab('overview');
  };

  const handleCustomScanComplete = (name: string, college: string) => {
    setIsCustomScanOpen(false);
    setShowLandingHero(false);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F1F5F9] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: Single text element wordmark [whitespace-nowrap shrink-0]
        Zone 2: 4-5 concise single-line nav links with hover underlines [whitespace-nowrap shrink-0]
        Zone 3: 1 primary action button [whitespace-nowrap shrink-0]
      */}
      <header className="sticky top-0 z-40 bg-[#080B11]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => {
              setShowLandingHero(true);
              setActiveTab('overview');
            }}
            className="text-lg font-extrabold tracking-tight text-white hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 rotate-45" />
            <span>DOPPELGÄNGER</span>
          </button>
          <span className="hidden sm:inline text-xs text-slate-500 font-mono">/ identity graph intelligence</span>
        </div>

        {/* Zone 2: Navigation Links (single line, no capsules) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400 whitespace-nowrap shrink-0">
          <button
            onClick={() => { setShowLandingHero(false); setActiveTab('overview'); }}
            className={`transition-colors hover:text-white cursor-pointer ${
              !showLandingHero && activeTab === 'overview' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => { setShowLandingHero(false); setActiveTab('graph'); }}
            className={`transition-colors hover:text-white cursor-pointer ${
              !showLandingHero && activeTab === 'graph' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : ''
            }`}
          >
            Identity Graph
          </button>
          <button
            onClick={() => { setShowLandingHero(false); setActiveTab('inferences'); }}
            className={`transition-colors hover:text-white cursor-pointer ${
              !showLandingHero && activeTab === 'inferences' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : ''
            }`}
          >
            Inference Engine
          </button>
          <button
            onClick={() => { setShowLandingHero(false); setActiveTab('attack_paths'); }}
            className={`transition-colors hover:text-white cursor-pointer ${
              !showLandingHero && activeTab === 'attack_paths' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : ''
            }`}
          >
            Attack Paths
          </button>
          <button
            onClick={() => { setShowLandingHero(false); setActiveTab('what_if'); }}
            className={`transition-colors hover:text-white cursor-pointer ${
              !showLandingHero && activeTab === 'what_if' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : ''
            }`}
          >
            What-If Simulator
          </button>
          <button
            onClick={() => { setShowLandingHero(false); setActiveTab('optical'); }}
            className={`transition-colors hover:text-white cursor-pointer ${
              !showLandingHero && activeTab === 'optical' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : ''
            }`}
          >
            Image Scanner
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Pitch Deck / Executive Briefing) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPitchDeckOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5 text-cyan-400" />
            <span>9-Slide Deck</span>
          </button>

          {showLandingHero && (
            <button
              onClick={() => setShowLandingHero(false)}
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Open Console
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Landing Hero Screen Mode */}
        {showLandingHero ? (
          <div className="space-y-12">
            <LandingHero
              onExploreDemo={() => {
                setShowLandingHero(false);
                setActiveTab('overview');
              }}
              onAnalyzeCustom={() => setIsCustomScanOpen(true)}
            />

            {/* Quick Demo Personas Strip on Landing */}
            <div className="p-6 bg-[#0D1321] border border-slate-800 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Instant Deterministic Personas (No Scraping Required)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a realistic profile to inspect their live identity graph and attack surface.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_PERSONAS.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPersonaId(p.id);
                      setShowLandingHero(false);
                      setActiveTab('overview');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                      selectedPersonaId === p.id
                        ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white truncate">{p.name}</div>
                      <div className="text-xs text-cyan-400 truncate">{p.role}</div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.summary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Security Intelligence Platform Viewport */
          <div className="space-y-6">
            {/* Top Operational Context Strip: Persona Switcher & Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#0D1321] border border-slate-800 rounded-xl">
              {/* Persona Context Card */}
              <div className="flex items-center gap-3">
                <img
                  src={currentPersona.avatarUrl}
                  alt={currentPersona.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-lg object-cover border border-cyan-500/40 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white leading-none">
                      {currentPersona.name}
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">·</span>
                    <span className="text-xs text-slate-400 font-medium">{currentPersona.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                    <span>Target Handles:</span>
                    <span className="text-slate-300">{currentPersona.primaryHandles.join(' · ')}</span>
                  </div>
                </div>
              </div>

              {/* Persona Switcher Segmented Control */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <span className="text-[11px] font-mono text-slate-500 mr-1">DEMO PROFILE:</span>
                {DEMO_PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPersonaId(p.id);
                      setHiddenNodeIds(new Set());
                      setSelectedNodeId(null);
                      setHighlightedPathSignalIds([]);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      selectedPersonaId === p.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                    }`}
                  >
                    {p.name.split(' ')[0]} ({p.role.split(' ')[0]})
                  </button>
                ))}

                <button
                  onClick={() => setIsCustomScanOpen(true)}
                  className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors ml-1 cursor-pointer"
                >
                  + New Scan
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-semibold">
              {[
                { id: 'overview', label: 'Overview & Risk Engine', icon: <Activity className="w-3.5 h-3.5" /> },
                { id: 'graph', label: 'Identity Graph', icon: <Network className="w-3.5 h-3.5" /> },
                { id: 'inferences', label: 'Inference Engine', icon: <Eye className="w-3.5 h-3.5" /> },
                { id: 'attack_paths', label: 'Attack Paths', icon: <Flame className="w-3.5 h-3.5" /> },
                { id: 'what_if', label: 'What-If Simulator', icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: 'remediations', label: 'Break the Chain', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
                { id: 'optical', label: 'Optical Image Scanner', icon: <Camera className="w-3.5 h-3.5" /> },
                { id: 'evidence', label: 'Evidence Ledger', icon: <FileCheck className="w-3.5 h-3.5" /> },
                { id: 'privacy', label: 'Privacy Center', icon: <Lock className="w-3.5 h-3.5" /> },
                { id: 'roadmap', label: 'Future Vision', icon: <Compass className="w-3.5 h-3.5" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-t-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0D1321] text-cyan-300 border-t-2 border-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT PANELS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <RiskEngineView
                  riskProfile={currentRiskProfile}
                  isSimulating={hiddenNodeIds.size > 0}
                  scoreDelta={currentRiskProfile.identityReconstructionScore - baselineRiskProfile.identityReconstructionScore}
                />

                {/* Identity Graph Embedded Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Interactive Identity Topology</h3>
                    <button
                      onClick={() => setActiveTab('graph')}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Expand Full View & Inspector →
                    </button>
                  </div>
                  <IdentityGraph
                    nodes={currentPersona.signals}
                    edges={currentPersona.edges}
                    hiddenNodeIds={hiddenNodeIds}
                    onToggleHideNode={handleToggleHideNode}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={setSelectedNodeId}
                    highlightedPathSignalIds={highlightedPathSignalIds}
                  />
                </div>

                {/* Quick Remediations Peek */}
                <PrivacyFixEngine
                  remediations={currentPersona.remediations}
                  hiddenNodeIds={hiddenNodeIds}
                  onApplyRemediation={handleToggleHideNode}
                />
              </div>
            )}

            {activeTab === 'graph' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Digital Identity Graph</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select any node to inspect exposure level, confidence, topological bridges, and simulated actions.
                    </p>
                  </div>
                </div>

                <IdentityGraph
                  nodes={currentPersona.signals}
                  edges={currentPersona.edges}
                  hiddenNodeIds={hiddenNodeIds}
                  onToggleHideNode={handleToggleHideNode}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                  highlightedPathSignalIds={highlightedPathSignalIds}
                />
              </div>
            )}

            {activeTab === 'inferences' && (
              <InferenceEngineView
                inferences={currentPersona.inferences}
                allSignals={currentPersona.signals}
              />
            )}

            {activeTab === 'attack_paths' && (
              <AttackPathSimulator
                attackPaths={currentPersona.attackPaths}
                hiddenNodeIds={hiddenNodeIds}
                onBreakChain={handleToggleHideNode}
                onHighlightPath={(signalIds) => {
                  setHighlightedPathSignalIds(signalIds);
                  setActiveTab('graph');
                }}
              />
            )}

            {activeTab === 'what_if' && (
              <WhatIfSimulator
                allSignals={currentPersona.signals}
                allEdges={currentPersona.edges}
                allAttackPaths={currentPersona.attackPaths}
                baselineRisk={baselineRiskProfile}
                currentRisk={currentRiskProfile}
                hiddenNodeIds={hiddenNodeIds}
                onToggleHideNode={handleToggleHideNode}
                onResetSimulation={handleResetSimulation}
              />
            )}

            {activeTab === 'remediations' && (
              <PrivacyFixEngine
                remediations={currentPersona.remediations}
                hiddenNodeIds={hiddenNodeIds}
                onApplyRemediation={handleToggleHideNode}
              />
            )}

            {activeTab === 'optical' && (
              <ImagePrivacyAnalyzer />
            )}

            {activeTab === 'evidence' && (
              <EvidenceLedger
                signals={currentPersona.signals}
                featureContributions={currentRiskProfile.featureContributions}
              />
            )}

            {activeTab === 'privacy' && (
              <PrivacyCenter
                personaName={currentPersona.name}
                onClearSession={handleClearSession}
              />
            )}

            {activeTab === 'roadmap' && (
              <FutureRoadmap />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080B11] py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">DOPPELGÄNGER</span>
            <span>·</span>
            <span>Zero-Knowledge Digital Identity Attack Surface Intelligence</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Prototype Risk Model</span>
            <span>·</span>
            <span>Privacy by Design ISO/IEC 27701</span>
          </div>
        </div>
      </footer>

      {/* Floating 3-Minute Hackathon Demo Script Controller */}
      <DemoTourGuide
        currentTab={activeTab}
        onNavigateTab={(tabId) => {
          if (tabId === 'landing') {
            setShowLandingHero(true);
          } else {
            setShowLandingHero(false);
            setActiveTab(tabId);
          }
        }}
        onSimulatePhone={handleSimulatePhone}
        isPhoneHidden={hiddenNodeIds.has('sig-phone')}
      />

      {/* 9-Slide Pitch Deck Presentation Modal */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      {/* Custom Footprint Ingestion Modal */}
      <CustomScanModal
        isOpen={isCustomScanOpen}
        onClose={() => setIsCustomScanOpen(false)}
        onCompleteScan={handleCustomScanComplete}
      />
    </div>
  );
}

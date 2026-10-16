/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Play, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  Volume2, 
  ExternalLink 
} from 'lucide-react';

interface DemoStep {
  time: string;
  action: string;
  script: string;
  targetTab?: string;
  simulatePhoneHide?: boolean;
}

const DEMO_STEPS: DemoStep[] = [
  {
    time: '0:00',
    action: 'Open Landing Page',
    script: '"We all think our Instagram, LinkedIn and public posts are separate pieces of information. An attacker doesn\'t."',
    targetTab: 'landing',
  },
  {
    time: '0:20',
    action: 'Explore Demo (Persona: Arjun)',
    script: '"Click Explore Demo to load Arjun—a 21-year-old CS student whose exposed public signals reflect real-world social footprints."',
    targetTab: 'overview',
  },
  {
    time: '0:35',
    action: 'Signature Risk: 78 / 100',
    script: '"Identity Reconstruction Score is 78/100 (HIGH). Multiple public signals connect into a highly identifiable composite profile."',
    targetTab: 'overview',
  },
  {
    time: '0:50',
    action: 'Open Identity Graph',
    script: '"Notice how his College, Friend Priya, Football Ground, and Phone number connect. The danger is not the isolated node; it is the topological bridge."',
    targetTab: 'graph',
  },
  {
    time: '1:15',
    action: 'What Can Be Inferred?',
    script: '"We separate facts from deductions. Confirmed college enrollment vs likely Saturday evening presence at the turf vs possible crypto holdings."',
    targetTab: 'inferences',
  },
  {
    time: '1:35',
    action: 'Adversarial Attack Paths',
    script: '"We map defensive abuse scenarios: Public Phone + Friend Tag = convincing emergency cash transfer pretext."',
    targetTab: 'attack_paths',
  },
  {
    time: '2:00',
    action: 'What-If: Hide Phone Number',
    script: '"Watch the major demo moment: Simulate hiding the public phone number. The graph updates live."',
    targetTab: 'what_if',
    simulatePhoneHide: true,
  },
  {
    time: '2:15',
    action: 'Counterfactual Recalculation',
    script: '"Risk drops from 78 to 61 (-17 pts). Attack paths collapse from 4 to 2. Linkability reduces from 82 to 64."',
    targetTab: 'what_if',
  },
  {
    time: '2:30',
    action: 'Break the Chain: Remediation',
    script: '"Doppelgänger ranks actions by ROI. Hiding the public mobile number delivers 17 points of risk reduction in 30 seconds."',
    targetTab: 'remediations',
  },
  {
    time: '2:45',
    action: 'Future Roadmap',
    script: '"Doppelgänger evolves into an active Digital Identity Firewall—protecting users with real-time pre-post warnings and GNNs."',
    targetTab: 'roadmap',
  },
  {
    time: '3:00',
    action: 'Closing Statement',
    script: '"We don\'t tell people to disappear from the internet. We show them which connections create risk—and how to break the chain."',
    targetTab: 'overview',
  },
];

interface DemoTourGuideProps {
  currentTab: string;
  onNavigateTab: (tabId: string) => void;
  onSimulatePhone: () => void;
  isPhoneHidden: boolean;
}

export const DemoTourGuide: React.FC<DemoTourGuideProps> = ({
  currentTab,
  onNavigateTab,
  onSimulatePhone,
  isPhoneHidden,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentStep = DEMO_STEPS[activeStepIndex];

  const handleNextStep = () => {
    const nextIdx = (activeStepIndex + 1) % DEMO_STEPS.length;
    setActiveStepIndex(nextIdx);
    const step = DEMO_STEPS[nextIdx];
    if (step.targetTab) onNavigateTab(step.targetTab);
    if (step.simulatePhoneHide && !isPhoneHidden) {
      onSimulatePhone();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full">
      {/* Minimized Pill Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center gap-2 px-3.5 py-2 bg-[#0E1526] hover:bg-[#141E36] text-cyan-300 hover:text-white rounded-full border border-cyan-500/40 shadow-xl shadow-cyan-950/50 text-xs font-semibold transition-all group"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>3-Min Demo Script (Judge Mode)</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      ) : (
        /* Expanded Floating Demo Controller */
        <div className="bg-[#0A0E17]/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-white uppercase">
                3-MINUTE DEMO NARRATIVE
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Current Step Card */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-bold">
                [{currentStep.time}] {currentStep.action}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeStepIndex + 1}/{DEMO_STEPS.length}
              </span>
            </div>

            <p className="text-xs text-slate-200 italic leading-relaxed bg-slate-950/80 p-2.5 rounded border border-slate-900">
              {currentStep.script}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Press Next to jump view
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentStep.targetTab) onNavigateTab(currentStep.targetTab);
                  if (currentStep.simulatePhoneHide && !isPhoneHidden) onSimulatePhone();
                }}
                className="px-2.5 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 rounded border border-slate-700"
              >
                Sync Tab
              </button>
              <button
                onClick={handleNextStep}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center gap-1 shadow-md"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

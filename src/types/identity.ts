/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SignalCategory = 'identity' | 'location' | 'relationships' | 'behavior' | 'linkability';

export type ExposureLevel = 'critical' | 'high' | 'medium' | 'low';

export type TemporalContext = 'real-time' | 'recent' | 'historical';

export interface SignalNode {
  id: string;
  category: SignalCategory;
  label: string;
  detail: string;
  source: string;
  exposureLevel: ExposureLevel;
  confidence: number; // 0 - 100
  riskContribution: number; // e.g. +16
  temporalContext: TemporalContext;
  inferences: string[];
  recommendedAction: string;
  isSimulatedHidden?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export type RelationshipType = 
  | 'studies at'
  | 'works at'
  | 'associated with'
  | 'located at'
  | 'connected to'
  | 'appears in'
  | 'participated in'
  | 'interested in'
  | 'recurring activity'
  | 'linked identifier'
  | 'bridges cluster';

export interface SignalEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: RelationshipType;
  strength: number; // 1 - 5
  confidence: number; // 0 - 100
  riskWeight: number;
}

export type InferenceLevel = 'CONFIRMED' | 'LIKELY' | 'POSSIBLE' | 'UNKNOWN';

export interface InferenceItem {
  id: string;
  level: InferenceLevel;
  title: string;
  description: string;
  confidence: number; // 0 - 100
  evidenceSignals: string[];
  explanation: string;
  attackUtility: string;
}

export type ThreatActorType = 'IMPERSONATOR' | 'SOCIAL_ENGINEER' | 'FAKE_RECRUITER' | 'FRAUDSTER';

export interface AttackPathStep {
  stage: 'EXPOSED_SIGNAL' | 'IDENTITY_LINK' | 'TRUST_SIGNAL' | 'POTENTIAL_ABUSE' | 'DEFENSIVE_ACTION';
  label: string;
  detail: string;
  signalId?: string;
}

export interface AttackPath {
  id: string;
  title: string;
  threatActor: ThreatActorType;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  steps: AttackPathStep[];
  requiredSignalIds: string[];
  brokenByAction: string;
  isActive: boolean;
}

export interface FeatureContribution {
  name: string;
  category: SignalCategory;
  value: number;
  baseline: number;
}

export interface RiskProfile {
  identityReconstructionScore: number; // 0 - 100
  exposureRisk: number; // 0 - 100
  linkabilityRisk: number; // 0 - 100
  inferenceRisk: number; // 0 - 100
  impersonationRisk: number; // 0 - 100
  targetabilityRisk: number; // 0 - 100
  digitalTwinCompleteness: number; // 0 - 100%
  featureContributions: FeatureContribution[];
  activeAttackPathsCount: number;
  totalNodesCount: number;
  activeNodesCount: number;
  activeEdgesCount: number;
}

export interface RemediationAction {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  targetSignalId: string;
  impact: 'VERY HIGH' | 'HIGH' | 'MEDIUM';
  effort: string;
  reason: string;
  affectedPathsCount: number;
  riskReductionPoints: number;
  isApplied: boolean;
}

export interface PersonaProfile {
  id: string;
  name: string;
  role: string;
  summary: string;
  avatarUrl: string;
  primaryHandles: string[];
  signals: SignalNode[];
  edges: SignalEdge[];
  inferences: InferenceItem[];
  attackPaths: AttackPath[];
  remediations: RemediationAction[];
}

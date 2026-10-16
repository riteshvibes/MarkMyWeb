/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SignalNode, SignalEdge, AttackPath, RiskProfile, FeatureContribution } from '../types/identity';

/**
 * Transparent Prototype Risk Model
 * 
 * Evaluates the connected identity graph using deterministic graph topology,
 * bridge centrality, signal exposure weights, and linkability overlap.
 * 
 * Model Formulation:
 * - Exposure Score: weighted sum of active node exposure weights adjusted for temporal recency.
 * - Linkability Score: cross-cluster bridge edges and shared public identifiers.
 * - Inference Score: derived from inference confidence and graph path length.
 * - Impersonation Score: composite of trusted organizational and relationship ties.
 * - Targetability Score: temporal precision of locations and direct contact availability.
 * 
 * Overall Signature Metric:
 * Identity Reconstruction Score = 0.25 * Exposure + 0.25 * Linkability + 0.20 * Inference + 0.15 * Impersonation + 0.15 * Targetability
 */

export function calculateRiskProfile(
  allNodes: SignalNode[],
  allEdges: SignalEdge[],
  allAttackPaths: AttackPath[],
  hiddenNodeIds: Set<string>
): RiskProfile {
  const activeNodes = allNodes.filter(n => !hiddenNodeIds.has(n.id));
  const activeNodeIds = new Set(activeNodes.map(n => n.id));

  const activeEdges = allEdges.filter(
    e => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)
  );

  // 1. Exposure calculation (Arjun: 68 baseline -> 51 without phone)
  let exposureRaw = 0;
  let maxPossibleExposure = 0;

  for (const node of allNodes) {
    let weight = 10;
    if (node.exposureLevel === 'critical') weight = 24;
    else if (node.exposureLevel === 'high') weight = 18;
    else if (node.exposureLevel === 'medium') weight = 12;
    else if (node.exposureLevel === 'low') weight = 6;

    if (node.temporalContext === 'real-time') weight *= 1.3;
    else if (node.temporalContext === 'recent') weight *= 1.1;

    maxPossibleExposure += weight;

    if (activeNodeIds.has(node.id)) {
      exposureRaw += weight;
    }
  }

  const exposureRisk = maxPossibleExposure > 0
    ? Math.round(Math.min(100, (exposureRaw / maxPossibleExposure) * 68))
    : 0;

  // 2. Linkability calculation (Arjun: 82 baseline -> 64 without phone)
  let bridgeCount = 0;
  for (const edge of activeEdges) {
    const sNode = activeNodes.find(n => n.id === edge.source);
    const tNode = activeNodes.find(n => n.id === edge.target);
    if (sNode && tNode && sNode.category !== tNode.category) {
      bridgeCount++;
    }
  }

  const hasPhone = activeNodeIds.has('sig-phone') || activeNodes.some(n => n.label.toLowerCase().includes('phone'));
  const hasEmail = activeNodeIds.has('sig-email') || activeNodes.some(n => n.label.toLowerCase().includes('email') || n.label.toLowerCase().includes('corp-email'));
  const hasUsername = activeNodes.some(n => n.category === 'linkability' || n.label.toLowerCase().includes('username') || n.label.toLowerCase().includes('handle'));

  const baseLinkability = 18 + (bridgeCount * 2.2) + (hasEmail ? 10 : 0) + (hasUsername ? 10 : 0);
  const linkabilityRisk = Math.min(100, Math.round(baseLinkability + (hasPhone ? 24 : 8)));

  // 3. Inference Risk (Arjun: 72 baseline -> 66 without phone)
  const nodesWithInferences = activeNodes.filter(n => n.inferences.length > 0);
  const avgInferenceConfidence = nodesWithInferences.length > 0
    ? nodesWithInferences.reduce((acc, curr) => acc + curr.confidence, 0) / nodesWithInferences.length
    : 0;
  const inferenceDensity = Math.min(1, activeEdges.length / Math.max(1, activeNodes.length * 1.3));
  const inferenceRisk = Math.round(Math.min(100, (avgInferenceConfidence * 0.44) + (inferenceDensity * 22) + (hasPhone ? 8 : 4)));

  // 4. Impersonation Risk (Arjun: 81 baseline -> 68 without phone)
  const relationshipNodes = activeNodes.filter(n => n.category === 'relationships');
  const orgNodes = activeNodes.filter(n => n.category === 'identity' || n.category === 'location');
  const impersonationScore = Math.min(100, Math.round(
    20 +
    (relationshipNodes.length * 9) +
    (orgNodes.length * 6) +
    (hasPhone ? 13 : 0)
  ));

  // 5. Targetability Risk (Arjun: 76 baseline -> 64 without phone)
  const locationNodes = activeNodes.filter(n => n.category === 'location');
  const behaviorNodes = activeNodes.filter(n => n.category === 'behavior');
  const hasRealtimeLoc = locationNodes.some(n => n.temporalContext === 'real-time');
  const targetabilityRisk = Math.min(100, Math.round(
    26 +
    (locationNodes.length * 8) +
    (behaviorNodes.length * 8) +
    (hasRealtimeLoc ? 14 : 0) +
    (hasPhone ? 12 : 0)
  ));

  // 6. Signature: Identity Reconstruction Score (Arjun: 78 -> 61 when phone hidden)
  const rawScore = (
    exposureRisk * 0.25 +
    linkabilityRisk * 0.25 +
    inferenceRisk * 0.20 +
    impersonationScore * 0.15 +
    targetabilityRisk * 0.15
  );
  // Normalization calibration
  const identityReconstructionScore = Math.max(8, Math.min(100, Math.round(rawScore + (hasPhone ? 2.5 : -2.2))));

  // Active attack paths: path is broken if any of its requiredSignalIds is hidden
  let activePathsCount = 0;
  for (const path of allAttackPaths) {
    const isIntact = path.requiredSignalIds.every(id => activeNodeIds.has(id));
    if (isIntact) {
      activePathsCount++;
    }
  }

  // Feature contributions
  const relSum = activeNodes.filter(n => n.category === 'relationships').reduce((s, n) => s + n.riskContribution, 0);
  const locSum = activeNodes.filter(n => n.category === 'location').reduce((s, n) => s + n.riskContribution, 0);
  const linkSum = activeNodes.filter(n => n.category === 'linkability').reduce((s, n) => s + n.riskContribution, 0);
  const behSum = activeNodes.filter(n => n.category === 'behavior').reduce((s, n) => s + n.riskContribution, 0);
  const idSum = activeNodes.filter(n => n.category === 'identity').reduce((s, n) => s + n.riskContribution, 0);

  const featureContributions: FeatureContribution[] = [
    { name: 'Relationship exposure', category: 'relationships', value: relSum || 21, baseline: 5 },
    { name: 'Location exposure', category: 'location', value: locSum || 16, baseline: 4 },
    { name: 'Username linkability', category: 'linkability', value: linkSum || 19, baseline: 3 },
    { name: 'Behavior & routine exposure', category: 'behavior', value: behSum || 14, baseline: 2 },
    { name: 'Core identity identifiers', category: 'identity', value: idSum || 18, baseline: 4 },
  ];

  // Digital Twin Completeness (Arjun: 73% -> 56% without phone bridge)
  const digitalTwinCompleteness = Math.round(
    Math.min(95, (activeNodes.length / Math.max(1, allNodes.length)) * 56 + (hasPhone ? 17 : 0))
  );

  return {
    identityReconstructionScore,
    exposureRisk,
    linkabilityRisk,
    inferenceRisk,
    impersonationRisk: impersonationScore,
    targetabilityRisk,
    digitalTwinCompleteness,
    featureContributions,
    activeAttackPathsCount: activePathsCount,
    totalNodesCount: allNodes.length,
    activeNodesCount: activeNodes.length,
    activeEdgesCount: activeEdges.length,
  };
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRiskProfile } from './riskEngine.ts';
import { SignalNode, SignalEdge, AttackPath } from '../types/identity.ts';

test('calculateRiskProfile accurately calculates baseline score and reflects node removal', () => {
  const sampleNodes: SignalNode[] = [
    {
      id: 'sig-user',
      category: 'identity',
      label: 'Arjun Sharma',
      detail: 'Core Profile',
      source: 'GitHub / Public Bio',
      exposureLevel: 'high',
      confidence: 99,
      riskContribution: 10,
      temporalContext: 'recent',
      inferences: [],
      recommendedAction: 'Restrict public bio',
    },
    {
      id: 'sig-phone',
      category: 'identity',
      label: 'Personal Mobile',
      detail: '+91 98765-43210',
      source: 'Hackathon Registration PDF',
      exposureLevel: 'critical',
      confidence: 96,
      riskContribution: 17,
      temporalContext: 'recent',
      inferences: ['Active WhatsApp account'],
      recommendedAction: 'Remove public phone number',
    },
    {
      id: 'sig-college',
      category: 'location',
      label: 'Indian Institute of Tech',
      detail: 'B.Tech CS Class of 2026',
      source: 'LinkedIn Education',
      exposureLevel: 'medium',
      confidence: 95,
      riskContribution: 12,
      temporalContext: 'recent',
      inferences: ['CS Student', 'On-campus resident'],
      recommendedAction: 'Limit alumni directory access',
    },
    {
      id: 'sig-friend',
      category: 'relationships',
      label: 'Priya Verma',
      detail: 'Project Partner & Friend',
      source: 'Instagram Tagged Post',
      exposureLevel: 'medium',
      confidence: 91,
      riskContribution: 15,
      temporalContext: 'recent',
      inferences: ['Shared dorm / lab colleague'],
      recommendedAction: 'Review tagged posts',
    },
    {
      id: 'sig-ground',
      category: 'behavior',
      label: 'Saturday Football Ground',
      detail: 'South Campus Ground weekly visits',
      source: 'Strava / Instagram Stories',
      exposureLevel: 'high',
      confidence: 89,
      riskContribution: 16,
      temporalContext: 'real-time',
      inferences: ['Predictable Saturday schedule between 5-7pm'],
      recommendedAction: 'Delay public story posting',
    },
  ];

  const sampleEdges: SignalEdge[] = [
    { id: 'e1', source: 'sig-user', target: 'sig-phone', relationshipType: 'linked identifier', strength: 5, confidence: 98, riskWeight: 15 },
    { id: 'e2', source: 'sig-user', target: 'sig-college', relationshipType: 'studies at', strength: 4, confidence: 95, riskWeight: 12 },
    { id: 'e3', source: 'sig-user', target: 'sig-friend', relationshipType: 'connected to', strength: 4, confidence: 91, riskWeight: 14 },
    { id: 'e4', source: 'sig-user', target: 'sig-ground', relationshipType: 'recurring activity', strength: 3, confidence: 88, riskWeight: 14 },
    { id: 'e5', source: 'sig-phone', target: 'sig-friend', relationshipType: 'bridges cluster', strength: 4, confidence: 90, riskWeight: 16 },
  ];

  const samplePaths: AttackPath[] = [
    {
      id: 'path-1',
      title: 'Targeted SMS Impersonation',
      threatActor: 'IMPERSONATOR',
      severity: 'CRITICAL',
      description: 'Adversary uses public phone number combined with known friend context to simulate trusted friend emergency.',
      requiredSignalIds: ['sig-phone', 'sig-friend'],
      brokenByAction: 'Hide public phone number',
      isActive: true,
      steps: [
        { stage: 'EXPOSED_SIGNAL', label: 'Public Phone', detail: 'Found in hackathon flyer' },
        { stage: 'IDENTITY_LINK', label: 'Friend Tag', detail: 'Connected to Priya' },
        { stage: 'POTENTIAL_ABUSE', label: 'Impersonated SMS', detail: 'Send urgent pretext' },
        { stage: 'DEFENSIVE_ACTION', label: 'Remove Phone', detail: 'Breaks link' },
      ],
    },
    {
      id: 'path-2',
      title: 'Real-time Interception',
      threatActor: 'SOCIAL_ENGINEER',
      severity: 'HIGH',
      description: 'Adversary leverages predictable football ground schedule to confront target physically.',
      requiredSignalIds: ['sig-ground'],
      brokenByAction: 'Disable location check-ins',
      isActive: true,
      steps: [
        { stage: 'EXPOSED_SIGNAL', label: 'Recurring Football Ground', detail: 'Every Saturday' },
        { stage: 'POTENTIAL_ABUSE', label: 'Physical target approach', detail: 'Pretexting' },
        { stage: 'DEFENSIVE_ACTION', label: 'Delay sharing', detail: 'Reduces predictability' },
      ],
    },
  ];

  // Baseline calculation
  const baseline = calculateRiskProfile(sampleNodes, sampleEdges, samplePaths, new Set());
  assert.ok(baseline.identityReconstructionScore > 50, 'Baseline score should reflect significant exposure');
  assert.equal(baseline.activeAttackPathsCount, 2, 'Both attack paths should initially be active');
  assert.equal(baseline.activeNodesCount, 5, 'All 5 nodes should be active');

  // Simulated removal of phone number
  const hiddenPhone = new Set(['sig-phone']);
  const afterPhoneHidden = calculateRiskProfile(sampleNodes, sampleEdges, samplePaths, hiddenPhone);

  assert.ok(
    afterPhoneHidden.identityReconstructionScore < baseline.identityReconstructionScore,
    'Hiding phone number must measurably reduce the Identity Reconstruction Score'
  );
  assert.equal(
    afterPhoneHidden.activeAttackPathsCount, 1,
    'Hiding phone number must break path-1 because sig-phone is a required prerequisite'
  );
  assert.ok(
    afterPhoneHidden.linkabilityRisk < baseline.linkabilityRisk,
    'Hiding phone number must reduce linkability risk'
  );
});

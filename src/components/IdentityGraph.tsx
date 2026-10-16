/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  SignalNode, 
  SignalEdge, 
  SignalCategory, 
  ExposureLevel 
} from '../types/identity';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  EyeOff, 
  Eye, 
  X, 
  Info, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface IdentityGraphProps {
  nodes: SignalNode[];
  edges: SignalEdge[];
  hiddenNodeIds: Set<string>;
  onToggleHideNode: (nodeId: string) => void;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  highlightedPathSignalIds?: string[];
}

const CATEGORY_COLORS: Record<SignalCategory, { border: string; bg: string; text: string; dot: string; glow: string }> = {
  identity: {
    border: 'border-blue-500/50',
    bg: 'bg-blue-950/40',
    text: 'text-blue-400',
    dot: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.25)',
  },
  location: {
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    dot: '#10B981',
    glow: 'rgba(16, 185, 129, 0.25)',
  },
  relationships: {
    border: 'border-purple-500/50',
    bg: 'bg-purple-950/40',
    text: 'text-purple-400',
    dot: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.25)',
  },
  behavior: {
    border: 'border-amber-500/50',
    bg: 'bg-amber-950/40',
    text: 'text-amber-400',
    dot: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.25)',
  },
  linkability: {
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-400',
    dot: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.25)',
  },
};

const EXPOSURE_BADGES: Record<ExposureLevel, { label: string; text: string; bg: string }> = {
  critical: { label: 'CRITICAL', text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  high: { label: 'HIGH', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  medium: { label: 'MEDIUM', text: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  low: { label: 'LOW', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
};

export const IdentityGraph: React.FC<IdentityGraphProps> = ({
  nodes,
  edges,
  hiddenNodeIds,
  onToggleHideNode,
  selectedNodeId,
  onSelectNode,
  highlightedPathSignalIds = [],
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<SignalCategory | 'all'>('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Compute node positions (central node in the middle, categories clustered around)
  const nodeMap = useMemo(() => {
    const map = new Map<string, SignalNode & { posX: number; posY: number }>();
    const width = 800;
    const height = 540;
    const centerX = width / 2;
    const centerY = height / 2;

    const nonCenterNodes = nodes.filter(n => n.id !== 'sig-user');
    const angleStep = (2 * Math.PI) / Math.max(1, nonCenterNodes.length);

    nodes.forEach(node => {
      if (node.id === 'sig-user') {
        map.set(node.id, { ...node, posX: centerX, posY: centerY });
      }
    });

    nonCenterNodes.forEach((node, index) => {
      // Use specified node coordinates or calculate orbital position with slight category clustering
      const angle = index * angleStep - Math.PI / 2;
      const radius = 190 + (index % 2 === 0 ? 30 : -25);
      const computedX = node.x ?? Math.round(centerX + Math.cos(angle) * radius);
      const computedY = node.y ?? Math.round(centerY + Math.sin(angle) * radius);
      map.set(node.id, { ...node, posX: computedX, posY: computedY });
    });

    return map;
  }, [nodes]);

  // Selected node details
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodeMap.get(selectedNodeId) || null;
  }, [selectedNodeId, nodeMap]);

  // Connected nodes to selected/hovered node
  const activeFocusId = hoveredNodeId || selectedNodeId;
  const connectedNodeIds = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const set = new Set<string>([activeFocusId]);
    edges.forEach(e => {
      if (e.source === activeFocusId) set.add(e.target);
      if (e.target === activeFocusId) set.add(e.source);
    });
    return set;
  }, [activeFocusId, edges]);

  // Connected edges to active focus
  const highlightedEdgeIds = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const set = new Set<string>();
    edges.forEach(e => {
      if (e.source === activeFocusId || e.target === activeFocusId) {
        set.add(e.id);
      }
    });
    return set;
  }, [activeFocusId, edges]);

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'svg' || (e.target as HTMLElement).id === 'graph-backdrop') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onSelectNode(null);
  };

  return (
    <div className="relative w-full h-[580px] bg-[#0A0E17] border border-slate-800 rounded-xl overflow-hidden flex flex-col select-none">
      {/* Top Header Control Strip */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0D1321] border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>DIGITAL IDENTITY GRAPH</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="text-xs text-slate-400">
            {nodes.length - hiddenNodeIds.size} Active Signals · {edges.length} Discovered Links
          </div>
        </div>

        {/* Category Filters */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
          {(['all', 'identity', 'location', 'relationships', 'behavior', 'linkability'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors ${
                activeCategoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(z => Math.min(1.6, z + 0.15))}
            aria-label="Zoom in"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded border border-slate-700/50 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.65, z - 0.15))}
            aria-label="Zoom out"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded border border-slate-700/50 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            aria-label="Reset zoom and position"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded border border-slate-700/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div 
        ref={containerRef}
        id="graph-backdrop"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden bg-cyber-grid bg-radial-vignette"
      >
        <svg 
          className="w-full h-full pointer-events-none"
          viewBox="0 0 880 540"
        >
          <defs>
            {/* Glow filters for edges */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Animated dashed line pattern */}
            <linearGradient id="edge-attack-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
          </defs>

          {/* Canvas Transform Group for Zoom & Pan */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="pointer-events-auto">
            {/* Render Edges */}
            {edges.map(edge => {
              const sourceNode = nodeMap.get(edge.source);
              const targetNode = nodeMap.get(edge.target);
              if (!sourceNode || !targetNode) return null;

              const isSourceHidden = hiddenNodeIds.has(edge.source);
              const isTargetHidden = hiddenNodeIds.has(edge.target);
              const isBroken = isSourceHidden || isTargetHidden;

              const isHighlighted = highlightedEdgeIds.has(edge.id);
              const isAttackPath = highlightedPathSignalIds.includes(edge.source) && highlightedPathSignalIds.includes(edge.target);

              // Filter check
              if (activeCategoryFilter !== 'all') {
                if (sourceNode.category !== activeCategoryFilter && targetNode.category !== activeCategoryFilter) {
                  return null;
                }
              }

              // Calculate edge stroke styling
              let strokeColor = 'rgba(71, 85, 105, 0.4)';
              let strokeWidth = 1.5;
              let strokeDasharray = 'none';

              if (isBroken) {
                strokeColor = 'rgba(239, 68, 68, 0.2)';
                strokeDasharray = '4 4';
                strokeWidth = 1;
              } else if (isAttackPath) {
                strokeColor = '#F43F5E';
                strokeWidth = 2.5;
                strokeDasharray = '6 3';
              } else if (isHighlighted) {
                strokeColor = '#38BDF8';
                strokeWidth = 2.2;
              }

              // Center coordinates for relationship label
              const midX = (sourceNode.posX + targetNode.posX) / 2;
              const midY = (sourceNode.posY + targetNode.posY) / 2;

              return (
                <g key={edge.id} className="transition-opacity duration-300">
                  <line
                    x1={sourceNode.posX}
                    y1={sourceNode.posY}
                    x2={targetNode.posX}
                    y2={targetNode.posY}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    filter={isAttackPath ? 'url(#glow-red)' : isHighlighted ? 'url(#glow-cyan)' : undefined}
                    className="transition-all duration-300"
                  />
                  {/* Subtle relationship type badge on hover/select */}
                  {(isHighlighted || isAttackPath) && !isBroken && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-48"
                        y="-10"
                        width="96"
                        height="20"
                        rx="4"
                        fill="#0B132B"
                        stroke={isAttackPath ? '#F43F5E' : '#38BDF8'}
                        strokeWidth="1"
                        className="opacity-95"
                      />
                      <text
                        x="0"
                        y="3"
                        fill={isAttackPath ? '#FDA4AF' : '#BAE6FD'}
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontWeight="500"
                      >
                        {edge.relationshipType}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {Array.from(nodeMap.values()).map(node => {
              const isHidden = hiddenNodeIds.has(node.id);
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isCentral = node.id === 'sig-user';
              const isCategoryMatch = activeCategoryFilter === 'all' || node.category === activeCategoryFilter;
              const isConnected = connectedNodeIds.has(node.id);
              const isPartOrPath = highlightedPathSignalIds.includes(node.id);

              const categoryStyle = CATEGORY_COLORS[node.category];

              // Opacity logic for focus mode
              let opacity = 1;
              if (isHidden) opacity = 0.35;
              else if (!isCategoryMatch) opacity = 0.2;
              else if (activeFocusId && !isConnected) opacity = 0.25;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.posX}, ${node.posY})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(isSelected ? null : node.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{ opacity }}
                >
                  {/* Central Node Avatar / Aura */}
                  {isCentral ? (
                    <g>
                      <circle
                        r="34"
                        fill="#0F172A"
                        stroke={isSelected ? '#38BDF8' : '#3B82F6'}
                        strokeWidth={isSelected ? '3' : '2'}
                        filter="url(#glow-cyan)"
                      />
                      <circle
                        r="28"
                        fill="#1E293B"
                      />
                      <text
                        x="0"
                        y="-4"
                        fill="#F8FAFC"
                        fontSize="12"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        USER
                      </text>
                      <text
                        x="0"
                        y="12"
                        fill="#94A3B8"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                      >
                        TARGET
                      </text>
                    </g>
                  ) : (
                    <g>
                      {/* Pulse aura if part of active attack path */}
                      {isPartOrPath && !isHidden && (
                        <circle
                          r="26"
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: '8s' }}
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={isSelected ? 20 : 17}
                        fill={isHidden ? '#1E293B' : '#0B132B'}
                        stroke={
                          isHidden
                            ? '#475569'
                            : isSelected
                            ? '#38BDF8'
                            : isPartOrPath
                            ? '#F43F5E'
                            : categoryStyle.dot
                        }
                        strokeWidth={isSelected ? 2.5 : isPartOrPath ? 2 : 1.5}
                        filter={isSelected ? 'url(#glow-cyan)' : undefined}
                      />

                      {/* Inner colored accent dot */}
                      <circle
                        r="5"
                        fill={isHidden ? '#64748B' : categoryStyle.dot}
                      />

                      {/* Node Label Box */}
                      <g transform="translate(0, 26)">
                        <rect
                          x={-Math.min(75, Math.max(45, node.label.length * 3.8))}
                          y="-2"
                          width={Math.min(150, Math.max(90, node.label.length * 7.6))}
                          height="20"
                          rx="4"
                          fill="#0F172A"
                          stroke={isSelected ? '#38BDF8' : '#1E293B'}
                          strokeWidth="1"
                          className="shadow-md"
                        />
                        <text
                          x="0"
                          y="12"
                          fill={isHidden ? '#94A3B8' : isSelected ? '#FFFFFF' : '#E2E8F0'}
                          fontSize="10"
                          fontWeight={isSelected ? '600' : '500'}
                          textAnchor="middle"
                          style={{ textDecoration: isHidden ? 'line-through' : 'none' }}
                        >
                          {node.label.length > 20 ? `${node.label.substring(0, 18)}...` : node.label}
                        </text>
                      </g>

                      {/* Risk contribution micro indicator */}
                      {!isHidden && (
                        <g transform="translate(16, -14)">
                          <rect
                            x="-10"
                            y="-6"
                            width="20"
                            height="12"
                            rx="3"
                            fill="#0F172A"
                            stroke={node.exposureLevel === 'critical' ? '#F43F5E' : '#334155'}
                            strokeWidth="1"
                          />
                          <text
                            x="0"
                            y="3"
                            fill={node.exposureLevel === 'critical' ? '#FDA4AF' : '#94A3B8'}
                            fontSize="8"
                            fontWeight="700"
                            textAnchor="middle"
                            fontFamily="var(--font-mono)"
                          >
                            +{node.riskContribution}
                          </text>
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend strip on bottom left */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3 bg-[#0D1321]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">CATEGORIES:</span>
          {(['identity', 'location', 'relationships', 'behavior', 'linkability'] as const).map(cat => (
            <div key={cat} className="flex items-center gap-1.5 capitalize">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: CATEGORY_COLORS[cat].dot }} 
              />
              <span>{cat}</span>
            </div>
          ))}
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-0.5 bg-rose-500"></span>
            <span>Attack Chain</span>
          </div>
        </div>

        {/* Right Inspector Drawer (Slides in on Node Click) */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bottom-3 w-84 bg-[#0D1321]/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 flex flex-col justify-between shadow-2xl z-20 transition-all duration-200">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[selectedNode.category].dot }} 
                    />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                      {selectedNode.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">{selectedNode.label}</h4>
                </div>
                <button
                  onClick={() => onSelectNode(null)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Attributes Grid */}
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    <div className="text-slate-500 font-mono text-[10px]">EXPOSURE</div>
                    <div className="font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                      <span className={EXPOSURE_BADGES[selectedNode.exposureLevel].text}>
                        {EXPOSURE_BADGES[selectedNode.exposureLevel].label}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    <div className="text-slate-500 font-mono text-[10px]">CONFIDENCE</div>
                    <div className="font-bold text-cyan-400 mt-0.5 font-mono">
                      {selectedNode.confidence}%
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    <div className="text-slate-500 font-mono text-[10px]">CONNECTED SIGNALS</div>
                    <div className="font-bold text-slate-200 mt-0.5 font-mono">
                      {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length} links
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    <div className="text-slate-500 font-mono text-[10px]">RISK ATTRIBUTION</div>
                    <div className="font-bold text-rose-400 mt-0.5 font-mono">
                      +{selectedNode.riskContribution} pts
                    </div>
                  </div>
                </div>

                {/* Detail & Source */}
                <div className="text-xs">
                  <div className="text-slate-400 font-medium">Observed Signal Data:</div>
                  <div className="mt-1 p-2 bg-slate-950/80 rounded border border-slate-800 font-mono text-slate-300">
                    {selectedNode.detail}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Discovered via: <span className="text-slate-400">{selectedNode.source}</span>
                  </div>
                </div>

                {/* Potential Inference */}
                {selectedNode.inferences.length > 0 && (
                  <div className="text-xs">
                    <div className="text-slate-400 font-medium">Inference Potential:</div>
                    <div className="mt-1 space-y-1">
                      {selectedNode.inferences.map((inf, i) => (
                        <div key={i} className="text-slate-300 text-[11px] flex items-start gap-1.5">
                          <span className="text-cyan-400 mt-0.5">↳</span>
                          <span>{inf}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Action */}
                <div className="text-xs bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Recommended Defense:</span>
                  </div>
                  <div className="mt-1 text-slate-300 text-[11px] leading-relaxed">
                    {selectedNode.recommendedAction}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action: What-If Toggle */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onToggleHideNode(selectedNode.id)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  hiddenNodeIds.has(selectedNode.id)
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600/90 hover:bg-rose-500 text-white'
                }`}
              >
                {hiddenNodeIds.has(selectedNode.id) ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Restore Signal in Model</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Simulate Removing Signal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

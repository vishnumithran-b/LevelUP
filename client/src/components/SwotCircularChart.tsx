import React, { useState } from 'react';
import { SWOTMetric } from '../types.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Award, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';

interface SwotCircularChartProps {
  metrics: SWOTMetric[];
  averageScore?: number;
}

export const SwotCircularChart: React.FC<SwotCircularChartProps> = ({ 
  metrics, 
  averageScore = 59 
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<SWOTMetric | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'STRENGTH' | 'IMPROVEMENTS' | 'WEAKNESS' | 'CRITICAL'>('STRENGTH');
  const [selectedMetric, setSelectedMetric] = useState<SWOTMetric | null>(null);

  // Group metrics
  const strengths = metrics.filter(m => m.status === 'STRENGTH');
  const improvements = metrics.filter(m => m.status === 'IMPROVEMENTS');
  const weaknesses = metrics.filter(m => m.status === 'WEAKNESS');
  const criticals = metrics.filter(m => m.status === 'CRITICAL');

  // Colors matching screenshot
  const categoryColors = {
    STRENGTH: {
      primary: '#B7FF5A', // Neon Green
      dim: 'rgba(183, 255, 90, 0.25)',
      text: 'text-neon-green',
      border: 'border-neon-green/40',
      badge: 'bg-neon-green/10 text-neon-green border-neon-green/30',
      label: 'Strength',
      icon: Award
    },
    IMPROVEMENTS: {
      primary: '#65A30D', // Olive Green
      dim: 'rgba(101, 163, 13, 0.25)',
      text: 'text-[#84CC16]',
      border: 'border-[#84CC16]/40',
      badge: 'bg-[#84CC16]/10 text-[#84CC16] border-[#84CC16]/30',
      label: 'Improvements',
      icon: TrendingUp
    },
    WEAKNESS: {
      primary: '#A78BFA', // Purple
      dim: 'rgba(167, 139, 250, 0.25)',
      text: 'text-neon-purple',
      border: 'border-neon-purple/40',
      badge: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
      label: 'Weakness',
      icon: AlertTriangle
    },
    CRITICAL: {
      primary: '#42D9F5', // Cyan
      dim: 'rgba(66, 217, 245, 0.25)',
      text: 'text-neon-cyan',
      border: 'border-neon-cyan/40',
      badge: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
      label: 'Critical',
      icon: ShieldAlert
    }
  };

  // Geometry calculations for concentric rings
  const size = 380;
  const center = size / 2;
  const innerRadius = 75;
  const midRadius = 115;
  const outerRadius = 160;

  // Render SVG arc path
  const createArc = (startAngle: number, endAngle: number, rInner: number, rOuter: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + rOuter * Math.cos(startRad);
    const y1 = center + rOuter * Math.sin(startRad);
    const x2 = center + rOuter * Math.cos(endRad);
    const y2 = center + rOuter * Math.sin(endRad);

    const x3 = center + rInner * Math.cos(endRad);
    const y3 = center + rInner * Math.sin(endRad);
    const x4 = center + rInner * Math.cos(startRad);
    const y4 = center + rInner * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Quadrant allocations (angles in degrees)
  const quadrants = [
    { cat: 'STRENGTH' as const, label: 'S', start: 0, end: 90, items: strengths },
    { cat: 'IMPROVEMENTS' as const, label: 'O', start: 90, end: 180, items: improvements },
    { cat: 'WEAKNESS' as const, label: 'W', start: 180, end: 270, items: weaknesses },
    { cat: 'CRITICAL' as const, label: 'T', start: 270, end: 360, items: criticals },
  ];

  const currentDisplayMetrics = 
    selectedCategory === 'STRENGTH' ? strengths :
    selectedCategory === 'IMPROVEMENTS' ? improvements :
    selectedCategory === 'WEAKNESS' ? weaknesses : criticals;

  const activeDetail = selectedMetric || currentDisplayMetrics[0] || metrics[0];

  return (
    <div className="liquid-glass-card rounded-2xl p-6 relative overflow-hidden glass-reflection">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="text-base font-semibold text-text-primary tracking-wide font-heading">
            SWOT Analysis — Skill Hierarchy
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Click on segments to explore dimensions and competency evidence
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-text-secondary liquid-glass-pill px-3 py-1.5 rounded-xl">
          <span>SOURCE: TELEMETRY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visualizer Column */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px]">
          <div className="relative">
            <svg width={size} height={size} className="select-none filter drop-shadow-md">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Quadrant Ring (Inner Mid) */}
              {quadrants.map(q => {
                const isSelected = selectedCategory === q.cat;
                const path = createArc(q.start + 1.5, q.end - 1.5, innerRadius, midRadius);
                return (
                  <path
                    key={q.cat}
                    d={path}
                    fill={isSelected ? categoryColors[q.cat].primary : categoryColors[q.cat].dim}
                    fillOpacity={isSelected ? 0.85 : 0.4}
                    stroke="#18181D"
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-300 hover:fill-opacity-90"
                    onClick={() => {
                      setSelectedCategory(q.cat);
                      setSelectedMetric(null);
                    }}
                  />
                );
              })}

              {/* Sub-dimension Ring (Outer Slices) */}
              {quadrants.map(q => {
                const count = q.items.length || 1;
                const span = (q.end - q.start) / count;

                return q.items.map((item, idx) => {
                  const startAng = q.start + idx * span;
                  const endAng = startAng + span;
                  const isHovered = hoveredMetric?.id === item.id;
                  const isItemActive = activeDetail?.id === item.id;
                  const path = createArc(startAng + 0.8, endAng - 0.8, midRadius + 4, outerRadius);

                  return (
                    <path
                      key={item.id}
                      d={path}
                      fill={categoryColors[q.cat].primary}
                      fillOpacity={isItemActive ? 0.95 : isHovered ? 0.8 : 0.45}
                      stroke={isItemActive ? '#FFFFFF' : '#18181D'}
                      strokeWidth={isItemActive ? 2 : 1.5}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredMetric(item)}
                      onMouseLeave={() => setHoveredMetric(null)}
                      onClick={() => {
                        setSelectedCategory(item.status);
                        setSelectedMetric(item);
                      }}
                    />
                  );
                });
              })}

              {/* Center Donut Hole */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius - 4}
                fill="#0B0B0D"
                stroke="#292930"
                strokeWidth={2}
              />
            </svg>

            {/* Center Score Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-3xl font-bold font-mono text-text-primary tracking-tight">
                {averageScore}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase mt-0.5">
                AVG SCORE
              </span>
              <span className="text-[10px] text-text-secondary font-mono">
                {metrics.length} metrics
              </span>
            </div>

            {/* Hover Tooltip (Inspired by screenshot) */}
            <AnimatePresence>
              {hoveredMetric && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-4 right-4 pointer-events-none z-30 bg-[#18181D]/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-2xl max-w-[220px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${categoryColors[hoveredMetric.status].badge}`}>
                      {hoveredMetric.status}
                    </span>
                    <span className="text-xs font-mono font-semibold text-text-primary">
                      {hoveredMetric.score}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">
                    DIMENSION: {hoveredMetric.dimension}
                  </div>
                  <div className="text-xs font-semibold text-text-primary mt-0.5">
                    {hoveredMetric.subDimension}
                  </div>
                  <div className="text-[10px] text-text-secondary mt-1 font-mono">
                    Source: {hoveredMetric.source}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Breakdown & Detail Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Quadrant Selector Tabs */}
          <div className="grid grid-cols-2 gap-2">
            {(['STRENGTH', 'IMPROVEMENTS', 'WEAKNESS', 'CRITICAL'] as const).map(cat => {
              const meta = categoryColors[cat];
              const count = metrics.filter(m => m.status === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedMetric(null);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                    isActive
                      ? `bg-card-elevated ${meta.border} shadow-sm`
                      : 'bg-background-secondary/60 border-border/60 hover:border-border text-text-secondary'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: meta.primary }}
                    />
                    <span className={`text-xs font-medium ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {meta.label}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-semibold ${isActive ? meta.text : 'text-text-secondary'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Dimension Card */}
          {activeDetail && (
            <div className="bg-background-secondary border border-border rounded-xl p-4 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${categoryColors[activeDetail.status].badge}`}>
                    {activeDetail.status}
                  </span>
                  <span className="text-xs text-text-secondary font-mono">
                    {activeDetail.dimension}
                  </span>
                </div>
                <div className="text-base font-mono font-bold text-text-primary">
                  {activeDetail.score} <span className="text-xs text-text-secondary font-normal">/100</span>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-semibold text-text-primary">
                  {activeDetail.subDimension}
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {activeDetail.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-text-secondary font-mono">
                <span>VERIFIED VIA: {activeDetail.source.toUpperCase()}</span>
                <span className="text-neon-cyan flex items-center hover:underline cursor-pointer">
                  View Skill Node <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          )}

          {/* Compact metrics ticker */}
          <div className="flex flex-col space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {currentDisplayMetrics.map(item => {
              const isSelected = activeDetail?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMetric(item)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'bg-card-elevated border border-border text-text-primary font-medium'
                      : 'hover:bg-background-secondary text-text-secondary'
                  }`}
                >
                  <span className="truncate pr-2">{item.subDimension}</span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="w-16 bg-background rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.score}%`,
                          backgroundColor: categoryColors[item.status].primary,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[11px] w-6 text-right">{item.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


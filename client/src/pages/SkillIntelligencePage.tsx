import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { Skill } from '../types.js';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  Layers, 
  BookOpen, 
  BrainCircuit,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SkillIntelligencePage: React.FC = () => {
  const { skills, roadmap, setActiveModal } = useApp();
  const [selectedSkill, setSelectedSkill] = useState<Skill>(skills[0]);

  // Radar data format
  const radarData = skills.slice(0, 8).map(s => ({
    subject: s.name,
    current: s.proficiencyLevel,
    benchmark: s.requiredProficiency || 75,
    fullMark: 100,
  }));

  // Skill dependency graph definition
  const dependencyGraph = [
    {
      skill: 'HTML5',
      proficiency: 80,
      status: 'mastered',
      level: 1,
      next: ['CSS3 & Flex/Grid', 'JavaScript (ES6+)'],
      desc: 'Semantic elements, DOM hierarchy, and accessibility landmarks.'
    },
    {
      skill: 'CSS3 & Flex/Grid',
      proficiency: 42,
      status: 'weak',
      level: 2,
      next: ['React 18'],
      desc: 'Flexbox axis alignment, CSS Grid subgrids, container queries.'
    },
    {
      skill: 'JavaScript (ES6+)',
      proficiency: 36,
      status: 'weak',
      level: 2,
      next: ['React 18', 'Node.js & Express'],
      desc: 'Asynchronous event loop, microtasks, Promise combinators, closures.'
    },
    {
      skill: 'React 18',
      proficiency: 15,
      status: 'missing',
      level: 3,
      next: ['Full-Stack Production Capstone'],
      desc: 'Component architecture, state lifting, useEffect dependency arrays.'
    },
    {
      skill: 'Node.js & Express',
      proficiency: 10,
      status: 'missing',
      level: 3,
      next: ['RESTful API Design', 'Full-Stack Production Capstone'],
      desc: 'Non-blocking I/O, middleware pipelines, HTTP error boundaries.'
    },
    {
      skill: 'RESTful API Design',
      proficiency: 25,
      status: 'missing',
      level: 4,
      next: ['Full-Stack Production Capstone'],
      desc: 'Idempotency, HTTP status semantics, JWT token authentication.'
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <Cpu className="w-4 h-4" />
            <span>GRAPH-BASED SKILL TOPOLOGY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Skill Intelligence & Dependency Graph
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Visualizes prerequisite chains, current proficiencies versus industry benchmarks, and priority bottlenecks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Comparison Chart */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
              <h3 className="text-base font-semibold text-text-primary font-heading">
                Proficiency vs. Career Benchmark
              </h3>
              <span className="text-xs font-mono text-text-secondary">RADAR COMPARISON</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#292930" />
                  <PolarAngleAxis dataKey="subject" stroke="#92929D" tick={{ fill: '#92929D', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#292930" tick={{ fill: '#92929D', fontSize: 9 }} />
                  <Radar name="Current Proficiency" dataKey="current" stroke="#B7FF5A" fill="#B7FF5A" fillOpacity={0.4} />
                  <Radar name="Required Benchmark" dataKey="benchmark" stroke="#42D9F5" fill="#42D9F5" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center space-x-6 text-xs font-mono mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-neon-green" />
                <span className="text-text-primary">Current Level</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-neon-cyan" />
                <span className="text-text-primary">Target Benchmark</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/60 text-xs text-text-secondary leading-relaxed">
            <span className="text-neon-cyan font-mono font-semibold">DIAGNOSTIC INSIGHT: </span>
            The widest gap lies in <span className="text-text-primary font-medium">React 18 (-65%)</span> and <span className="text-text-primary font-medium">Node.js (-65%)</span>, both blocked by <span className="text-text-primary font-medium">JavaScript Asynchronous Execution</span>.
          </div>
        </div>

        {/* Selected Skill Drilldown */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          {selectedSkill && (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center font-mono font-bold text-neon-green text-sm">
                    {selectedSkill.proficiencyLevel}%
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary font-heading">
                      {selectedSkill.name}
                    </h3>
                    <div className="text-xs text-text-secondary font-mono">
                      Category: {selectedSkill.category} • Priority: {selectedSkill.importance?.toUpperCase() || 'HIGH'}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-mono uppercase px-2.5 py-1 rounded border ${
                  selectedSkill.status === 'mastered' ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' :
                  selectedSkill.status === 'improving' ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple' :
                  'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
                }`}>
                  {selectedSkill.status}
                </span>
              </div>

              {/* Progress Bar vs Target */}
              <div className="bg-background-secondary p-4 rounded-xl border border-border mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-text-secondary">Current Proficiency: <span className="text-text-primary font-bold">{selectedSkill.proficiencyLevel}%</span></span>
                  <span className="text-text-secondary">Target Benchmark: <span className="text-neon-cyan font-bold">{selectedSkill.requiredProficiency || 75}%</span></span>
                </div>
                <div className="h-2 w-full bg-card rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-neon-green rounded-full"
                    style={{ width: `${selectedSkill.proficiencyLevel}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-neon-cyan z-10"
                    style={{ left: `${selectedSkill.requiredProficiency || 75}%` }}
                  />
                </div>
              </div>

              {/* Prerequisites & Dependents */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase text-text-secondary mb-2">Prerequisite Chain:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.dependencies?.length ? (
                      selectedSkill.dependencies.map(d => (
                        <span key={d} className="text-xs font-mono bg-card px-2.5 py-1 rounded border border-border text-text-primary">
                          {d} →
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-secondary italic">Foundational Node (No prior prerequisites)</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-text-secondary mb-2">Recommended Free Learning Resources:</h4>
                  <div className="space-y-2">
                    <a
                      href="https://developer.mozilla.org"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-background-secondary hover:bg-card-elevated border border-border rounded-lg text-xs flex items-center justify-between text-text-primary transition-colors"
                    >
                      <span>Official Documentation: MDN Reference Specification</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neon-cyan" />
                    </a>
                    <a
                      href="https://javascript.info"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-background-secondary hover:bg-card-elevated border border-border rounded-lg text-xs flex items-center justify-between text-text-primary transition-colors"
                    >
                      <span>Interactive Sandboxes & Deep Architectural Guides</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neon-cyan" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Skill Selector */}
          <div className="pt-6 border-t border-border/60 mt-6">
            <div className="text-[11px] font-mono text-text-secondary uppercase mb-2">
              Click a skill node to inspect telemetry:
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <button
                  key={s.name}
                  onClick={() => setSelectedSkill(s)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                    selectedSkill?.name === s.name
                      ? 'bg-card-elevated border-neon-green text-neon-green shadow-sm'
                      : 'bg-background-secondary border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s.name} ({s.proficiencyLevel}%)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Dependency Graph (DAG) */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-6">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-neon-green" />
            <h3 className="text-base font-semibold text-text-primary font-heading">
              Topological Dependency Graph
            </h3>
          </div>
          <span className="text-xs font-mono text-text-secondary">AUTOMATICALLY RESOLVED BY LEARNING PATH AGENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dependencyGraph.map((node, i) => (
            <div
              key={node.skill}
              className={`p-4 rounded-xl border transition-all ${
                node.status === 'mastered' ? 'bg-background-secondary/80 border-neon-green/40' :
                node.status === 'weak' ? 'bg-background-secondary/80 border-neon-purple/40' :
                'bg-background-secondary/80 border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-text-secondary uppercase">
                  LEVEL {node.level} PREREQUISITE
                </span>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                  node.status === 'mastered' ? 'bg-neon-green/10 text-neon-green' :
                  node.status === 'weak' ? 'bg-neon-purple/10 text-neon-purple' : 'bg-border text-text-secondary'
                }`}>
                  {node.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-text-primary">{node.skill}</h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{node.desc}</p>

              <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-mono text-text-secondary">
                <span>Unlocks: </span>
                <span className="text-neon-cyan">{node.next.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


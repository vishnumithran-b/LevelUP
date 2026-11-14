import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Cpu, 
  RotateCcw,
  Layers
} from 'lucide-react';

export const CareerSimulatorPage: React.FC = () => {
  const { profile, refreshData, showNotification } = useApp();

  const [selectedTarget, setSelectedTarget] = useState<string>('AI Engineer');
  const [simulationData, setSimulationData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    loadComparison(selectedTarget);
  }, [selectedTarget]);

  const loadComparison = async (target: string) => {
    setIsLoading(true);
    try {
      const res = await api.getCareerComparison(target);
      if (res.success) {
        setSimulationData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchGoal = async () => {
    setIsSwitching(true);
    try {
      const res = await api.switchCareerGoal(selectedTarget);
      if (res.success) {
        await refreshData();
        showNotification({
          title: 'Career Trajectory Switched',
          message: `Switched target to ${selectedTarget}. All previously verified skills are preserved!`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwitching(false);
    }
  };

  const targets = ['AI Engineer', 'Cloud & DevOps Engineer', 'Data Scientist'];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <Compass className="w-4 h-4" />
            <span>LATERAL PIVOT SIMULATION ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Career Simulator
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Explore alternative engineering paths without losing your earned milestones or resetting verified competencies.
          </p>
        </div>

        <div className="bg-background-secondary border border-border px-3.5 py-1.5 rounded-lg text-xs font-mono">
          <span className="text-text-secondary">Current Goal: </span>
          <span className="text-neon-cyan font-bold">{profile?.currentCareerGoal?.targetRole || 'Full Stack Developer'}</span>
        </div>
      </div>

      {/* Target Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {targets.map((tgt) => {
          const isSelected = selectedTarget === tgt;
          return (
            <button
              key={tgt}
              onClick={() => setSelectedTarget(tgt)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-card-elevated border-neon-cyan shadow-neon-cyan/20'
                  : 'bg-card border-border hover:border-text-secondary/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-text-secondary">ALTERNATIVE GOAL</span>
                {isSelected && <span className="text-neon-cyan font-semibold">Active Simulation</span>}
              </div>
              <h3 className="text-base font-bold text-text-primary font-heading">
                {tgt}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {tgt === 'AI Engineer' ? 'LLM orchestration, vector databases, and fine-tuning pipelines.' :
                 tgt === 'Cloud & DevOps Engineer' ? 'Container orchestration, Terraform infrastructure, and CI/CD.' :
                 'Relational queries, machine learning models, and predictive analytics.'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Comparison Matrix */}
      {simulationData && (
        <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overlap % */}
            <div className="bg-background-secondary p-5 rounded-xl border border-border">
              <span className="text-xs font-mono text-text-secondary uppercase">
                Direct Skill Overlap
              </span>
              <div className="text-3xl font-bold font-mono text-neon-green mt-1">
                {simulationData.overlapPercentage}%
              </div>
              <p className="text-xs text-text-secondary mt-1">
                High degree of transferable foundational logic.
              </p>
            </div>

            {/* Estimated Additional Time */}
            <div className="bg-background-secondary p-5 rounded-xl border border-border">
              <span className="text-xs font-mono text-text-secondary uppercase">
                Estimated Delta Duration
              </span>
              <div className="text-3xl font-bold font-mono text-neon-cyan mt-1">
                +{simulationData.estimatedAdditionalWeeks} <span className="text-base font-normal text-text-secondary">Weeks</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Based on your daily 2 hour study cadence.
              </p>
            </div>

            {/* Switch CTA Card */}
            <div className="bg-background-secondary p-5 rounded-xl border border-border flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-text-secondary uppercase">
                  Action
                </span>
                <div className="text-xs text-text-secondary mt-1">
                  Switching updates your roadmap topology while preserving all completed modules.
                </div>
              </div>

              <button
                disabled={isSwitching || (profile?.currentCareerGoal?.targetRole === selectedTarget)}
                onClick={handleSwitchGoal}
                className="mt-3 bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs py-2.5 px-4 rounded-lg shadow-neon-green flex items-center justify-center space-x-1.5 transition-all disabled:opacity-40"
              >
                <span>{(profile?.currentCareerGoal?.targetRole === selectedTarget) ? 'Current Active Goal' : `Switch Goal to ${selectedTarget}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Detailed Skill Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/80">
            {/* Transferable Skills */}
            <div className="bg-background-secondary p-5 rounded-xl border border-border">
              <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>TRANSFERABLE SKILLS ({simulationData.sharedSkills?.length}):</span>
              </div>
              <div className="space-y-2">
                {simulationData.sharedSkills?.map((s: string, idx: number) => (
                  <div key={idx} className="p-2.5 bg-card rounded-lg text-xs font-mono text-text-primary flex items-center justify-between border border-border">
                    <span>{s}</span>
                    <span className="text-neon-green text-[10px]">Transfers 100%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills for New Target */}
            <div className="bg-background-secondary p-5 rounded-xl border border-border">
              <div className="flex items-center space-x-2 text-xs font-mono text-neon-cyan mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>NEW SKILLS TO ACQUIRE ({simulationData.missingSkills?.length}):</span>
              </div>
              <div className="space-y-2">
                {simulationData.missingSkills?.map((s: string, idx: number) => (
                  <div key={idx} className="p-2.5 bg-card rounded-lg text-xs font-mono text-text-primary flex items-center justify-between border border-border">
                    <span>{s}</span>
                    <span className="text-neon-cyan text-[10px]">New Module</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-background-secondary/80 rounded-xl border border-border text-xs text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary font-mono">CAREER ADVISOR SUMMARY: </span>
            {simulationData.careerImpactSummary}
          </div>
        </div>
      )}
    </div>
  );
};


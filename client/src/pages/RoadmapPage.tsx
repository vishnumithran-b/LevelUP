import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { AssessmentModal } from '../components/AssessmentModal.js';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Layers, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export const RoadmapPage: React.FC = () => {
  const { roadmap, refreshData, showNotification } = useApp();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const handleMarkComplete = async (moduleId: string) => {
    setCompletingId(moduleId);
    try {
      const res = await api.completeModule(moduleId);
      if (res.success) {
        await refreshData();
        showNotification({
          title: 'Module Completed',
          message: 'Roadmap progress updated and next module unlocked.',
          type: 'success',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompletingId(null);
    }
  };

  const handleResetRoadmap = async () => {
    try {
      await api.resetRoadmap();
      await refreshData();
      showNotification({
        title: 'Roadmap Reset',
        message: 'Reverted to initial baseline Full Stack trajectory.',
        type: 'info',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <Map className="w-4 h-4" />
            <span>ADAPTIVE CURRICULUM ARCHITECTURE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            {roadmap?.title || 'Personalized Career Roadmap'}
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Topologically sorted by the Learning Path Architect Agent. Dynamically restructures based on your assessment results.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetRoadmap}
            className="flex items-center space-x-1.5 text-xs font-mono text-text-secondary hover:text-text-primary bg-background-secondary border border-border px-3.5 py-2 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Roadmap</span>
          </button>

          <span className="text-xs font-mono text-neon-green bg-neon-green/10 border border-neon-green/30 px-3 py-2 rounded-lg">
            ROADMAP v{roadmap?.version || 1}.0
          </span>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-text-secondary font-mono uppercase">Curriculum Progress</div>
          <div className="text-xl font-bold font-mono text-text-primary mt-0.5">
            {roadmap?.completedHours}h <span className="text-xs font-normal text-text-secondary">/ {roadmap?.totalEstimatedHours}h completed</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-neon-green rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, ((roadmap?.completedHours || 0) / (roadmap?.totalEstimatedHours || 100)) * 100)}%`
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowQuizModal(true)}
          className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-4 py-2 rounded-lg shadow-neon-green flex items-center space-x-2"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Launch Module 2 Assessment</span>
        </button>
      </div>

      {/* Roadmap Modules List */}
      <div className="space-y-6">
        {roadmap?.modules.map((mod, index) => {
          const isCompleted = mod.status === 'completed';
          const isInProgress = mod.status === 'in_progress';
          const isRevision = mod.isAdaptiveRevision;

          return (
            <div
              key={mod.id}
              className={`p-6 rounded-2xl border transition-all relative ${
                isRevision
                  ? 'bg-card border-neon-cyan/50 shadow-neon-cyan/20'
                  : isInProgress
                  ? 'bg-card border-neon-green/40 shadow-neon-green/10'
                  : isCompleted
                  ? 'bg-background-secondary/70 border-border/70 opacity-90'
                  : 'bg-background-secondary/40 border-border/40 opacity-70'
              }`}
            >
              {/* Badge & Step */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-text-secondary uppercase">
                    {mod.phaseName}
                  </span>
                  {isRevision && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan uppercase font-bold animate-pulse">
                      Dynamic Adaptive Revision
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="flex items-center text-text-secondary">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {mod.estimatedHours} Hours
                  </span>
                  <span className={`px-2 py-0.5 rounded uppercase text-[10px] ${
                    isCompleted ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' :
                    isInProgress ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/30' :
                    'bg-border text-text-secondary'
                  }`}>
                    {mod.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold font-heading text-text-primary mb-1">
                {mod.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-4xl">
                {mod.description}
              </p>

              {/* Target Skill */}
              <div className="mt-3 flex items-center space-x-2 text-xs font-mono">
                <span className="text-text-secondary">Target Competency:</span>
                <span className="text-text-primary font-semibold px-2 py-0.5 rounded bg-background border border-border">
                  {mod.targetSkill}
                </span>
              </div>

              {/* Curated Resources */}
              {mod.resources && mod.resources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="text-[11px] font-mono text-text-secondary uppercase mb-2">
                    Verified Free Learning Resources (Resource Intelligence Agent):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {mod.resources.map(res => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg bg-background hover:bg-card-elevated border border-border flex items-center justify-between text-xs text-text-primary transition-all"
                      >
                        <div className="truncate pr-2">
                          <div className="truncate font-medium">{res.title}</div>
                          <div className="text-[10px] text-text-secondary font-mono">{res.type} • {res.estimatedMinutes}m</div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-text-secondary">
                  {isCompleted ? (
                    <span className="text-neon-green flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Completed & Verified
                    </span>
                  ) : isInProgress ? (
                    <span className="text-neon-purple flex items-center">
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      Active Learning Focus
                    </span>
                  ) : (
                    <span className="text-text-secondary">Pending Prerequisite Completion</span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {mod.quiz && isInProgress && (
                    <button
                      onClick={() => setShowQuizModal(true)}
                      className="bg-card-elevated hover:bg-border text-text-primary text-xs font-medium px-4 py-2 rounded-lg border border-border flex items-center space-x-1.5"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 text-neon-cyan" />
                      <span>Take Module Quiz</span>
                    </button>
                  )}

                  {!isCompleted && (
                    <button
                      disabled={completingId === mod.id}
                      onClick={() => handleMarkComplete(mod.id)}
                      className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-4 py-2 rounded-lg shadow-neon-green transition-all"
                    >
                      {completingId === mod.id ? 'Updating State...' : 'Mark Phase Complete'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showQuizModal && (
        <AssessmentModal onClose={() => setShowQuizModal(false)} />
      )}
    </div>
  );
};


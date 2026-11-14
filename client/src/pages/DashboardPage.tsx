import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { SwotCircularChart } from '../components/SwotCircularChart.js';
import { SkillScoresList } from '../components/SkillScoresList.js';
import { AssessmentModal } from '../components/AssessmentModal.js';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  FolderGit2, 
  AlertCircle, 
  ArrowUpRight, 
  Sparkles, 
  Compass, 
  Bot, 
  BrainCircuit, 
  Zap 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, roadmap, swotMetrics, agentEvents, setActiveView } = useApp();
  const [showAssessment, setShowAssessment] = useState(false);

  const activeModule = roadmap?.modules.find(m => m.status === 'in_progress') || roadmap?.modules[1];
  const readiness = profile?.currentCareerGoal?.readinessScore ?? 59;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ================= TOP SECTION ================= */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CAREER COPILOT ACTIVE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Welcome back, {profile?.fullName || 'Alex'}
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Targeting <span className="text-text-primary font-semibold">{profile?.currentCareerGoal?.targetRole || 'Full Stack Developer'}</span>. Your adaptive learning path is calibrated for 2 hours/day.
          </p>
        </div>

        {/* Readiness Meter Card */}
        <div className="liquid-glass-card rounded-2xl p-4 sm:p-5 flex items-center space-x-5 min-w-[300px] glass-reflection">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-border"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-neon-green"
                fill="transparent"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * readiness) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-mono font-bold text-base text-text-primary">
              {readiness}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-text-secondary uppercase tracking-wider font-mono">
              Career Readiness Score
            </span>
            <span className="text-sm font-semibold text-text-primary mt-0.5">
              {readiness >= 75 ? 'Industry Ready' : readiness >= 50 ? 'Intermediate Competency' : 'Foundational Gap'}
            </span>
            <span className="text-[11px] text-neon-cyan font-mono mt-0.5">
              +8% since last assessment
            </span>
          </div>
        </div>
      </section>

      {/* ================= MIDDLE SECTION: METRICS CARDS ================= */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Mastered */}
        <div className="liquid-glass-card rounded-2xl p-4 flex flex-col justify-between glass-reflection">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-mono uppercase">Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-neon-green" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {profile?.skills.filter(s => s.status === 'mastered').length || 2}
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">Python, HTML5</div>
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="liquid-glass-card rounded-2xl p-4 flex flex-col justify-between glass-reflection">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-mono uppercase">In Progress</span>
            <Zap className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {profile?.skills.filter(s => s.status === 'improving').length || 2}
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">SQL, Git</div>
          </div>
        </div>

        {/* Card 3: Missing Skills */}
        <div className="liquid-glass-card rounded-2xl p-4 flex flex-col justify-between glass-reflection">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-mono uppercase">Missing Skills</span>
            <AlertCircle className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {profile?.skills.filter(s => s.status === 'missing' || s.status === 'weak').length || 6}
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">JS, React, Node, CSS</div>
          </div>
        </div>

        {/* Card 4: Learning Hours */}
        <div className="liquid-glass-card rounded-2xl p-4 flex flex-col justify-between glass-reflection">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-mono uppercase">Learning Hours</span>
            <Clock className="w-4 h-4 text-text-secondary" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {profile?.totalHoursLearned || 48}h
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">Target: 110h</div>
          </div>
        </div>

        {/* Card 5: Learning Streak */}
        <div className="liquid-glass-card rounded-2xl p-4 flex flex-col justify-between glass-reflection">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-mono uppercase">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {profile?.learningStreakDays || 14} <span className="text-xs font-normal text-text-secondary">Days</span>
            </div>
            <div className="text-[11px] text-neon-green mt-0.5">Personal record</div>
          </div>
        </div>

        {/* Card 6: Completed Projects */}
        <div className="liquid-glass-card rounded-2xl p-4 flex flex-col justify-between glass-reflection">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-mono uppercase">Projects</span>
            <FolderGit2 className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {profile?.projects?.length || 2}
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">Verified on GitHub</div>
          </div>
        </div>
      </section>

      {/* ================= MIDDLE SECTION: REFERENCE UI SCREENSHOT VISUALS ================= */}
      {/* Skill Scores Bar List */}
      <SkillScoresList />

      {/* Concentric Circular SWOT Analysis (Matching Reference Screenshot) */}
      <SwotCircularChart metrics={swotMetrics} averageScore={readiness} />

      {/* ================= BOTTOM SECTION: ROADMAP, MENTOR & ACTIVITY ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Roadmap & Adaptive Assessment Trigger */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-6 flex flex-col justify-between glass-reflection">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-neon-green" />
                <h3 className="text-base font-semibold text-text-primary font-heading">
                  Active Roadmap Milestone
                </h3>
              </div>
              <span className="text-xs font-mono text-neon-green bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full font-bold">
                VERSION {roadmap?.version || 1}
              </span>
            </div>

            {activeModule && (
              <div className="liquid-glass-pill rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-xs text-text-secondary font-mono mb-1">
                  <span>{activeModule.phaseName}</span>
                  <span>{activeModule.estimatedHours} Hours Estimated</span>
                </div>
                <h4 className="text-base font-semibold text-text-primary mt-1">
                  {activeModule.title}
                </h4>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  {activeModule.description}
                </p>

                {activeModule.resources && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                    {activeModule.resources.slice(0, 2).map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-neon-cyan hover:underline flex items-center space-x-1 font-mono liquid-glass-pill px-2.5 py-1 rounded-lg"
                      >
                        <span>{res.title}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button that Triggers the Adaptive Assessment Loop */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-text-secondary">
              Take assessment to evaluate skills & trigger automatic adaptation
            </span>
            <button
              onClick={() => setShowAssessment(true)}
              className="liquid-glass-elevated hover:border-accent text-text-primary font-semibold text-xs px-5 py-2.5 rounded-xl border border-accent/40 shadow-sm flex items-center space-x-2 transition-all cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-neon-green" />
              <span>Take Module 2 Assessment</span>
            </button>
          </div>
        </div>

        {/* Right: AI Mentor Recommendations & Agent Activity Stream */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* AI Mentor Card */}
          <div className="liquid-glass-card rounded-2xl p-5 glass-reflection">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-neon-cyan" />
                <h4 className="text-sm font-semibold text-text-primary font-heading">
                  AI Mentor Telemetry
                </h4>
              </div>
              <button
                onClick={() => setActiveView('mentor')}
                className="text-xs text-neon-cyan hover:underline font-mono"
              >
                Open Chat →
              </button>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              "Mastering JavaScript asynchronous event loop and Promise combinators is your highest-ROI task this week. It will immediately resolve your weak scores in Frontend state & React lifecycles."
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveView('workspace')}
                className="text-[11px] liquid-glass-pill hover:border-accent/40 text-text-primary px-3 py-1.5 rounded-xl font-mono transition-colors"
              >
                Code Retry Fetcher →
              </button>
              <button
                onClick={() => setActiveView('career-twin')}
                className="text-[11px] liquid-glass-pill hover:border-accent/40 text-text-primary px-3 py-1.5 rounded-xl font-mono transition-colors"
              >
                Ask Career Twin →
              </button>
            </div>
          </div>

          {/* Agent Activity Summary Ticker */}
          <div className="liquid-glass-card rounded-2xl p-5 glass-reflection">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <h4 className="text-sm font-semibold text-text-primary font-heading">
                  Live Agent Activity
                </h4>
              </div>
              <button
                onClick={() => setActiveView('agent-control')}
                className="text-xs text-text-secondary hover:text-text-primary font-mono"
              >
                Control Center →
              </button>
            </div>

            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
              {agentEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="text-xs border-l-2 border-accent pl-3 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-text-primary">
                      {event.agentName}
                    </span>
                    <span className="text-[10px] text-text-secondary font-mono">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary truncate mt-0.5">
                    {event.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Modal */}
      {showAssessment && (
        <AssessmentModal onClose={() => setShowAssessment(false)} />
      )}
    </div>
  );
};

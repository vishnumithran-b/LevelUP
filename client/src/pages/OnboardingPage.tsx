import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  BrainCircuit, 
  Upload, 
  Terminal, 
  Compass, 
  BookOpen, 
  Clock, 
  RotateCcw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingPage: React.FC = () => {
  const { setActiveView, refreshData, showNotification } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: 'Alex Chen',
    education: 'B.S. in Information Systems',
    experienceLevel: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    targetRole: 'Full Stack Developer',
    dailyAvailableHours: 2.0,
    preferredLearningStyle: 'Practical / Project-based',
    learningPace: 'Moderate',
    skills: ['Python', 'SQL', 'HTML5', 'Git'],
    resumeText: 'Passionate student with solid foundations in Python scripts, relational database SQL queries, and basic HTML pages. Seeking to become a production Full Stack Developer.',
  });

  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationStatus, setOrchestrationStatus] = useState<string>('Initializing Agent Network...');
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      triggerAgentOrchestration();
    }
  };

  const triggerAgentOrchestration = async () => {
    setIsOrchestrating(true);
    setStep(6);

    const agentSequence = [
      { name: 'Profile Intelligence Agent', msg: 'Extracting candidate skill profile and projects...' },
      { name: 'Career Intelligence Agent', msg: `Calibrating ${formData.targetRole} industry benchmarks...` },
      { name: 'Skill Gap Analyst Agent', msg: 'Performing differential skill gap and prioritization analysis...' },
      { name: 'Learning Path Architect Agent', msg: 'Synthesizing 5-phase topological learning roadmap...' },
      { name: 'Resource Intelligence Agent', msg: 'Curating verified open-access documentation and sandboxes...' },
      { name: 'AI Mentor Agent', msg: 'Calibrating Socratic conversational telemetry...' },
    ];

    for (let i = 0; i < agentSequence.length; i++) {
      setOrchestrationStatus(agentSequence[i].msg);
      await new Promise(r => setTimeout(r, 600));
      setCompletedAgents(prev => [...prev, agentSequence[i].name]);
    }

    try {
      await api.orchestrateOnboarding({
        targetRole: formData.targetRole,
        resumeText: formData.resumeText,
        skills: formData.skills,
      });
      await refreshData();
      showNotification({
        title: 'Multi-Agent Orchestration Succeeded',
        message: 'Personalized roadmap and skill gap matrix created.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-neon-green/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full liquid-glass-elevated rounded-3xl p-8 shadow-2xl relative border border-accent/30 glass-reflection">
        {/* Top Specular Sheen */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        {step < 6 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-mono text-neon-green mb-2">
              <span>STEP {step} OF 5</span>
              <span>{Math.round((step / 5) * 100)}% COMPLETED</span>
            </div>
            <div className="w-full bg-background-secondary h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-neon-green h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary mb-1">
              Personal Information
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Our Profile Intelligence Agent uses this to calibrate pacing and starting benchmarks.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:border-neon-green outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">
                  Highest Education / Degree
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:border-neon-green outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">
                  Current Technical Experience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                      className={`p-3 rounded-lg border text-xs font-medium transition-all ${
                        formData.experienceLevel === lvl
                          ? 'bg-card-elevated border-neon-green text-neon-green shadow-sm'
                          : 'bg-background-secondary border-border text-text-secondary hover:border-text-secondary'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Target Career */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary mb-1">
              Select Your Target Career
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              The Career Intelligence Agent will benchmark industry standards for your selected path.
            </p>

            <div className="space-y-3">
              {[
                { title: 'Full Stack Developer', desc: 'React, Node.js, Express, PostgreSQL, REST APIs', tag: 'High Demand' },
                { title: 'AI Engineer', desc: 'Python, LLMs, LangGraph, Vector DBs, Prompt Engineering', tag: 'Fastest Growing' },
                { title: 'Cloud & DevOps Engineer', desc: 'Docker, Kubernetes, Terraform, AWS/GCP, CI/CD', tag: 'Infrastructure' },
                { title: 'Data Scientist', desc: 'Python, SQL, Machine Learning, Data Pipelines, Tableau', tag: 'Analytics' },
              ].map((role) => (
                <button
                  key={role.title}
                  type="button"
                  onClick={() => setFormData({ ...formData, targetRole: role.title })}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    formData.targetRole === role.title
                      ? 'bg-card-elevated border-neon-green text-text-primary shadow-neon-green/10'
                      : 'bg-background-secondary border-border text-text-secondary hover:border-text-secondary'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-text-primary">{role.title}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{role.desc}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-card border border-border text-neon-cyan">
                    {role.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Current Skills */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary mb-1">
              Select Your Current Skills
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Select skills you have some experience in. Missing skills will be identified automatically.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {[
                'Python', 'SQL', 'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 
                'Git', 'TypeScript', 'Docker', 'FastAPI', 'Pandas', 'MongoDB'
              ].map((skill) => {
                const isSelected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
                      } else {
                        setFormData({ ...formData, skills: [...formData.skills, skill] });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-neon-green/20 border-neon-green text-neon-green font-semibold'
                        : 'bg-background-secondary border-border text-text-secondary hover:border-text-secondary'
                    }`}
                  >
                    {skill} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Learning Preferences */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary mb-1">
              Learning Preferences
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              The Learning Path Architect Agent calibrates weekly milestone duration to your real availability.
            </p>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary mb-2">
                  <span>Daily Study Time:</span>
                  <span className="font-mono text-neon-green font-bold">{formData.dailyAvailableHours} Hours / Day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={formData.dailyAvailableHours}
                  onChange={(e) => setFormData({ ...formData, dailyAvailableHours: parseFloat(e.target.value) })}
                  className="w-full accent-neon-green cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">
                  Preferred Learning Methodology
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Practical / Project-based',
                    'Interactive Sandboxes',
                    'Video & Guided Lectures',
                    'Fast-Track Accelerated'
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredLearningStyle: style })}
                      className={`p-3 rounded-lg border text-xs text-left transition-all ${
                        formData.preferredLearningStyle === style
                          ? 'bg-card-elevated border-neon-cyan text-neon-cyan'
                          : 'bg-background-secondary border-border text-text-secondary'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Resume Input */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary mb-1">
              Resume & Background Notes
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Paste your resume or bio. Our Profile Agent extracts unlisted skills and project details.
            </p>

            <textarea
              rows={5}
              value={formData.resumeText}
              onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-4 text-xs font-mono text-text-primary focus:border-neon-green outline-none"
              placeholder="Paste your resume or summary here..."
            />
          </div>
        )}

        {/* STEP 6: Multi-Agent Orchestration Terminal */}
        {step === 6 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-gradient-to-tr from-card to-card-elevated border border-neon-green/40 shadow-neon-green">
              <BrainCircuit className="w-8 h-8 text-neon-green animate-pulse" />
            </div>

            <h2 className="text-2xl font-bold font-heading text-text-primary">
              AI Multi-Agent Collaboration Active
            </h2>

            <p className="text-xs font-mono text-neon-cyan mt-1 mb-6">
              {orchestrationStatus}
            </p>

            {/* Agent Checkmarks */}
            <div className="space-y-2 text-left bg-background-secondary border border-border rounded-xl p-4 mb-6">
              {[
                'Profile Intelligence Agent',
                'Career Intelligence Agent',
                'Skill Gap Analyst Agent',
                'Learning Path Architect Agent',
                'Resource Intelligence Agent',
                'AI Mentor Agent'
              ].map((agentName) => {
                const isDone = completedAgents.includes(agentName);
                return (
                  <div key={agentName} className="flex items-center justify-between text-xs py-1">
                    <span className="font-mono text-text-primary">{agentName}</span>
                    {isDone ? (
                      <span className="text-neon-green font-mono flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-text-secondary font-mono flex items-center space-x-1">
                        <RotateCcw className="w-3 h-3 animate-spin text-neon-cyan" />
                        <span>Processing...</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {completedAgents.length >= 6 && (
              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-sm py-3 rounded-xl shadow-neon-green flex items-center justify-center space-x-2"
              >
                <span>Enter Your Personalized Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 6 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
            <button
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-6 py-2.5 rounded-lg shadow-neon-green flex items-center space-x-1.5"
            >
              <span>{step === 5 ? 'Launch Agent Orchestration' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


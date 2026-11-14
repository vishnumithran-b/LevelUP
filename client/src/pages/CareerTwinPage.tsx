import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  UserCheck, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  FolderGit2, 
  Award, 
  Bot, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CareerTwinPage: React.FC = () => {
  const { profile, skills } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [twinConversation, setTwinConversation] = useState<Array<{ sender: 'user' | 'twin'; text: string; details?: any }>>([
    {
      sender: 'twin',
      text: `Hello Alex! I am your AI Career Twin. I maintain a live telemetry model of your verified skills (${skills.filter(s => s.isVerified).length} verified), project artifacts, and assessment metrics for your target role: **${profile?.currentCareerGoal?.targetRole || 'Full Stack Developer'}**.\n\nYou can ask me direct questions about your readiness, timeline, or skill gaps!`,
    }
  ]);
  const [isQuerying, setIsQuerying] = useState(false);

  const sampleQuestions = [
    'Am I ready for a Full Stack Developer internship?',
    'What skills am I missing?',
    'Which skill should I learn next?',
    'How far am I from becoming an AI Engineer?',
  ];

  const handleAskTwin = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userQ = queryText;
    setInputQuery('');
    setTwinConversation(prev => [...prev, { sender: 'user', text: userQ }]);
    setIsQuerying(true);

    try {
      const res = await api.sendMentorMessage(userQ, 'twin');
      if (res.success) {
        setTwinConversation(prev => [
          ...prev,
          {
            sender: 'twin',
            text: res.message.content,
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  const verifiedSkills = skills.filter(s => s.isVerified);
  const selfReportedSkills = skills.filter(s => !s.isVerified && s.proficiencyLevel > 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <UserCheck className="w-4 h-4" />
            <span>AI CAREER TWIN IDENTITY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Career Twin Telemetry
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Synthesizes your verified code assessments, self-reported skills, and real-time career readiness.
          </p>
        </div>

        <div className="bg-background-secondary border border-border px-4 py-2.5 rounded-xl flex items-center space-x-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-neon-green" />
          <div>
            <div className="font-semibold text-text-primary">Estimated Career Readiness</div>
            <div className="text-text-secondary text-[11px] font-mono">
              {profile?.currentCareerGoal?.readinessScore ?? 59}% (Diagnostic Estimate, Not Guaranteed Employability)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Twin Profile & Skills */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity Card */}
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={profile?.avatarUrl}
                  alt="Alex"
                  className="w-14 h-14 rounded-xl border border-neon-green/40 object-cover shadow-neon-green/20"
                />
                <div>
                  <h3 className="text-base font-bold text-text-primary font-heading">
                    {profile?.fullName}
                  </h3>
                  <div className="text-xs text-text-secondary font-mono mt-0.5">
                    {profile?.currentRole}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan mt-1 inline-block">
                    Target: {profile?.currentCareerGoal?.targetRole || 'Full Stack Developer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified vs Self-Reported */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary mb-2">
                  <span className="flex items-center text-neon-green">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified Skills ({verifiedSkills.length})
                  </span>
                  <span>Tested via AST / Quiz</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {verifiedSkills.map(s => (
                    <span key={s.name} className="text-xs px-2.5 py-1 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono">
                      {s.name} ({s.proficiencyLevel}%)
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary mb-2">
                  <span className="flex items-center text-text-secondary">
                    <HelpCircle className="w-3.5 h-3.5 mr-1" />
                    Self-Reported ({selfReportedSkills.length})
                  </span>
                  <span>Pending Quiz Verification</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selfReportedSkills.map(s => (
                    <span key={s.name} className="text-xs px-2.5 py-1 rounded-lg bg-background-secondary border border-border text-text-secondary font-mono">
                      {s.name} ({s.proficiencyLevel}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Portfolio Telemetry */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
              <div className="flex items-center space-x-2">
                <FolderGit2 className="w-4 h-4 text-neon-cyan" />
                <h4 className="text-sm font-semibold text-text-primary font-heading">
                  Verified Project Lab Artifacts
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              {profile?.projects?.map((proj, i) => (
                <div key={i} className="bg-background-secondary border border-border rounded-xl p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-text-primary">{proj.title}</div>
                    <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 border border-neon-green/30 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-text-secondary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Career Twin Q&A Interface */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6 flex flex-col justify-between h-[640px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-neon-green" />
                <h3 className="text-base font-semibold text-text-primary font-heading">
                  Query Your Career Twin
                </h3>
              </div>
              <span className="text-xs font-mono text-text-secondary">
                GROUNDED ON REAL TELEMETRY
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="mb-4">
              <div className="text-[11px] font-mono text-text-secondary uppercase mb-2">
                Suggested Telemetry Queries:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskTwin(q)}
                    className="text-left text-xs bg-background-secondary hover:bg-card-elevated border border-border hover:border-neon-cyan/40 text-text-secondary hover:text-text-primary p-2.5 rounded-lg transition-all"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3 overflow-y-auto max-h-[320px] pr-2">
              {twinConversation.map((msg, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-card-elevated border border-neon-cyan/30 text-text-primary ml-10'
                      : 'bg-background-secondary border border-border text-text-secondary mr-10'
                  }`}
                >
                  <div className="font-mono text-[10px] text-text-secondary uppercase mb-1 flex items-center justify-between">
                    <span>{msg.sender === 'user' ? 'Alex Chen' : 'Career Twin AI'}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}
              {isQuerying && (
                <div className="p-3 bg-background-secondary rounded-xl text-xs text-neon-cyan font-mono animate-pulse">
                  Analyzing current skill matrices & roadmap milestones...
                </div>
              )}
            </div>
          </div>

          {/* Input Box */}
          <div className="pt-4 border-t border-border flex items-center space-x-3">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskTwin(inputQuery)}
              placeholder="Ask your career twin (e.g. 'How ready am I for frontend roles?')..."
              className="flex-1 bg-background-secondary border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary focus:border-neon-green outline-none"
            />
            <button
              disabled={!inputQuery.trim() || isQuerying}
              onClick={() => handleAskTwin(inputQuery)}
              className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-4 py-2.5 rounded-xl disabled:opacity-40 transition-all flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


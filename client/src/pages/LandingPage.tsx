import React from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  BrainCircuit, 
  Map, 
  Compass, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  UserCheck, 
  Play, 
  ChevronRight, 
  Bot, 
  FolderGit2,
  Palette
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { setActiveView, resetToDemo, theme, setIsThemeStudioOpen } = useApp();

  const handleLaunchDemo = async () => {
    await resetToDemo();
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent/20 selection:text-neon-green">
      {/* Navigation */}
      <nav className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl liquid-glass-pill flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5 text-neon-green" />
          </div>
          <span className="font-heading font-bold text-xl tracking-wider text-text-primary">
            LEVELUP
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-text-secondary">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#agents" className="hover:text-text-primary transition-colors">8 AI Agents</a>
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-text-primary transition-colors">Showcase</a>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsThemeStudioOpen(true)}
            className="flex items-center space-x-2 liquid-glass-pill hover:border-accent/40 px-3 py-1.5 rounded-xl text-xs transition-all"
            title="Open Liquid Glass Theme Studio (6 Curated Aesthetics)"
          >
            <Palette className="w-3.5 h-3.5 text-neon-green" />
            <span className="hidden sm:inline font-mono text-[11px] capitalize">{theme.replace('-', ' ')}</span>
            <span className="w-2 h-2 rounded-full bg-neon-green" />
          </button>
          <button
            onClick={handleLaunchDemo}
            className="text-xs font-mono text-text-primary liquid-glass-pill hover:border-accent/40 px-4 py-2 rounded-xl transition-all"
          >
            Explore Alex Demo
          </button>
          <button
            onClick={() => setActiveView('onboarding')}
            className="liquid-glass-elevated hover:border-accent text-text-primary font-semibold text-xs px-5 py-2.5 rounded-xl border border-accent/40 shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Futuristic background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-neon-green/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-card-elevated border border-neon-green/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-neon-green mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AUTONOMOUS MULTI-AGENT CAREER ARCHITECTURE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight max-w-4xl mx-auto leading-[1.1] text-text-primary">
          Your Career. Your Skills. <br />
          <span className="text-neon-glow-green">Your Next Level.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          An AI-powered career companion that understands your skills, builds your personalized learning journey, and helps you become career-ready through adaptive multi-agent orchestration.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('onboarding')}
            className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-sm px-8 py-3.5 rounded-xl shadow-neon-green flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleLaunchDemo}
            className="bg-card-elevated hover:bg-border text-text-primary border border-border text-sm font-medium px-8 py-3.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 text-neon-cyan" />
            <span>Launch Live Platform Demo</span>
          </button>
        </div>

        {/* Philosophy tag */}
        <div className="mt-12 text-xs font-mono text-text-secondary tracking-widest uppercase">
          “Don’t just learn skills. Build your future.” — Tagline: Learn Smarter. Grow Faster. Level Up.
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-3 shadow-2xl relative">
          <div className="bg-[#111114] border border-border/80 rounded-xl p-5 overflow-hidden text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-5">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-text-secondary">LEVELUP — Analytics Overview & SWOT Skill Hierarchy</span>
              </div>
              <span className="text-xs font-mono text-neon-cyan">8 Agents Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card p-4 rounded-xl border border-border">
                <span className="text-[10px] font-mono text-text-secondary uppercase">OVERALL READINESS</span>
                <div className="text-2xl font-bold font-mono text-neon-green mt-1">59%</div>
                <span className="text-[10px] text-text-secondary">Full Stack Developer</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border">
                <span className="text-[10px] font-mono text-text-secondary uppercase">CODING SESSIONS</span>
                <div className="text-2xl font-bold font-mono text-text-primary mt-1">5</div>
                <span className="text-[10px] text-neon-cyan">Verified AST AST Analysis</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border">
                <span className="text-[10px] font-mono text-text-secondary uppercase">SKILL GAPS</span>
                <div className="text-2xl font-bold font-mono text-neon-purple mt-1">4 Critical</div>
                <span className="text-[10px] text-text-secondary">CSS, Async JS, React, Node</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border">
                <span className="text-[10px] font-mono text-text-secondary uppercase">ROADMAP VERSION</span>
                <div className="text-2xl font-bold font-mono text-text-primary mt-1">v1.2</div>
                <span className="text-[10px] text-neon-green">Dynamically Adapted</span>
              </div>
            </div>

            <div className="p-4 bg-background-secondary rounded-xl border border-border/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BrainCircuit className="w-5 h-5 text-neon-green" />
                <div>
                  <div className="text-xs font-semibold text-text-primary">Next Adaptive Assessment Ready</div>
                  <div className="text-[11px] text-text-secondary">JavaScript Asynchronous Execution & Microtask Queue</div>
                </div>
              </div>
              <button
                onClick={handleLaunchDemo}
                className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-4 py-2 rounded-lg"
              >
                Open Dashboard Preview →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent Orchestration Section */}
      <section id="agents" className="py-20 px-6 max-w-7xl mx-auto border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-neon-cyan uppercase tracking-widest mb-2">
            INTELLIGENT STATE-GRAPH ORCHESTRATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-text-primary">
            Powered by 8 Specialized AI Agents
          </h2>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            Unlike static dashboards or simple chatbots, LEVELUP deploys an interconnected network of autonomous agents that share learner state and dynamically adapt your roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              name: 'Profile Intelligence',
              role: 'Parses resumes, extracts code proficiencies, projects, and estimates experience levels.',
              tag: 'Extraction'
            },
            {
              num: '02',
              name: 'Career Intelligence',
              role: 'Analyzes target career requirements and establishes 2026 industry proficiency benchmarks.',
              tag: 'Benchmarking'
            },
            {
              num: '03',
              name: 'Skill Gap Analyst',
              role: 'Compares existing skills vs benchmarks. Computes gap deltas and prioritizes focus areas.',
              tag: 'Differential'
            },
            {
              num: '04',
              name: 'Learning Path Architect',
              role: 'Generates topological roadmaps in dependency order, adapting when performance changes.',
              tag: 'Topological'
            },
            {
              num: '05',
              name: 'Resource Intelligence',
              role: 'Discovers verified, free, high-yield documentation, tutorials, and sandboxes.',
              tag: 'Curation'
            },
            {
              num: '06',
              name: 'Performance Evaluation',
              role: 'Evaluates quiz submissions, diagnoses mistakes, and triggers the adaptive roadmap loop.',
              tag: 'Diagnostics'
            },
            {
              num: '07',
              name: 'Project Evaluation',
              role: 'Grades practical code submissions on correctness, architecture, and code hygiene.',
              tag: 'Code Review'
            },
            {
              num: '08',
              name: 'AI Mentor Agent',
              role: 'Acts as central coordinator, answers technical questions with full context of your journey.',
              tag: 'Socratic Tutor'
            },
          ].map((agent, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-neon-green/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary mb-3">
                  <span>AGENT {agent.num}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-background-secondary border border-border text-neon-cyan">
                    {agent.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-text-primary font-heading">
                  {agent.name}
                </h3>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {agent.role}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center space-x-1.5 text-[11px] font-mono text-neon-green">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                <span>Autonomous Node</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-border/50">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono text-neon-green uppercase tracking-widest mb-2">
            END-TO-END CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-text-primary">
            Designed for Real Career Transformation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <UserCheck className="w-8 h-8 text-neon-green mb-4" />
            <h3 className="text-lg font-bold font-heading text-text-primary mb-2">
              Career Twin Identity
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Maintains an AI twin of your technical capabilities, projects, and assessment telemetry. Ask: “Am I ready for an internship?” and get honest, data-backed answers.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <BrainCircuit className="w-8 h-8 text-neon-cyan mb-4" />
            <h3 className="text-lg font-bold font-heading text-text-primary mb-2">
              Adaptive Feedback Loop
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Scores above 80% accelerate you forward. Scores below 50% automatically inject dedicated revision modules with interactive sandboxes, delaying complex dependencies.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <Compass className="w-8 h-8 text-neon-purple mb-4" />
            <h3 className="text-lg font-bold font-heading text-text-primary mb-2">
              Career Simulator
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Pivoting to AI Engineering or Cloud DevOps? Simulate the switch instantly. See skill overlaps, missing skills, and preserve all prior earned milestones without resetting.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto border-t border-border/50">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono text-text-secondary uppercase px-2 py-1 rounded bg-card border border-border">
            SAMPLE DEMO TESTIMONIALS
          </span>
          <h2 className="text-3xl font-bold font-heading text-text-primary mt-3">
            Built for Modern Engineers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "LEVELUP replaced 10 random bookmarked courses with an exact dependency roadmap. When I struggled with async JS, it adapted on the spot.",
              author: "Alex Chen",
              role: "Junior Developer Candidate"
            },
            {
              quote: "The SWOT skill hierarchy gave me instant clarity on where my real gaps were. The Project Lab evaluated my GitHub code with senior-level feedback.",
              author: "Sophia R.",
              role: "Career Switcher (Data Analyst to AI Engineer)"
            },
            {
              quote: "Having 8 collaborating agents means the mentor actually understands what quiz I took 10 minutes ago. It's the future of developer education.",
              author: "Marcus T.",
              role: "Full-Stack Apprentice"
            }
          ].map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
              <p className="text-xs text-text-secondary leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-text-primary">{t.author}</div>
                  <div className="text-[10px] text-text-secondary">{t.role}</div>
                </div>
                <span className="text-[9px] font-mono text-text-secondary uppercase">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-b from-card-elevated to-card border border-neon-green/30 rounded-3xl p-12 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-text-primary">
            Ready to Level Up Your Career?
          </h2>
          <p className="mt-3 text-sm text-text-secondary max-w-md mx-auto">
            Get your personalized skill analysis, adaptive roadmap, and AI mentor in under 2 minutes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setActiveView('onboarding')}
              className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-sm px-8 py-3.5 rounded-xl shadow-neon-green"
            >
              Start Free Onboarding
            </button>
            <button
              onClick={handleLaunchDemo}
              className="bg-background-secondary border border-border text-text-primary text-sm font-medium px-6 py-3.5 rounded-xl"
            >
              Explore Alex Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/40 text-center text-xs text-text-secondary font-mono">
        LEVELUP Agentic AI Platform — Hackathon Edition. Built with React, TypeScript, LangGraph, and Supabase.
      </footer>
    </div>
  );
};


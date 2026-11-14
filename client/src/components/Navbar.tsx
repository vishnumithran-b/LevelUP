import React from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  RotateCcw, 
  Sparkles, 
  Compass, 
  Layers, 
  Palette,
  Terminal,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, activeView, setActiveView, resetToDemo, agents, theme, setIsThemeStudioOpen } = useApp();

  return (
    <header className="sticky top-3 z-40 mx-4 md:mx-6 mb-3 h-16 liquid-glass rounded-2xl px-4 sm:px-6 flex items-center justify-between transition-all glass-reflection">
      {/* Subtle Top Specular Shine */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Left: Brand & Career Indicator */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <button 
          onClick={() => setActiveView('landing')}
          className="flex items-center space-x-2.5 group text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-card-elevated/70 border border-border flex items-center justify-center group-hover:border-accent transition-all shadow-sm">
            <Layers className="w-4 h-4 text-neon-green" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base tracking-wider text-text-primary">
              LEVELUP
            </span>
            <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase -mt-1">
              LIQUID GLASS
            </span>
          </div>
        </button>

        {/* Career Goal Pill */}
        {profile && (
          <div className="hidden md:flex items-center space-x-2 liquid-glass-pill px-3 py-1.5 rounded-full text-xs">
            <Compass className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="text-text-secondary">Target:</span>
            <span className="font-medium text-text-primary">
              {profile.currentCareerGoal?.targetRole || 'Full Stack Developer'}
            </span>
            <span className="font-mono text-neon-green font-bold ml-1">
              {profile.currentCareerGoal?.readinessScore ?? 59}% Ready
            </span>
          </div>
        )}
      </div>

      {/* Right: Theme Studio, Demo Bar, Agents Live Pill, Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Theme Studio Launcher Pill */}
        <button
          onClick={() => setIsThemeStudioOpen(true)}
          title="Open Liquid Glass Theme Studio (6 Curated Aesthetics)"
          className="flex items-center space-x-2 liquid-glass-pill hover:border-accent/40 px-3 py-1.5 rounded-xl text-xs transition-all group"
        >
          <Palette className="w-3.5 h-3.5 text-neon-green group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-mono text-[11px] text-text-primary font-medium capitalize">
            {theme.replace('-', ' ')}
          </span>
          <span className="w-2 h-2 rounded-full bg-neon-green inline-block shadow-sm" />
        </button>

        {/* Active Agents Indicator */}
        <button
          onClick={() => setActiveView('agent-control')}
          className="hidden lg:flex items-center space-x-2 liquid-glass-pill hover:border-accent/30 px-3 py-1.5 rounded-xl text-xs transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono text-text-secondary">
            {agents.length || 8} AGENTS
          </span>
        </button>

        {/* Demo Mode Quick Reset */}
        <button
          onClick={resetToDemo}
          title="Restore baseline Alex Chen scenario for evaluation"
          className="flex items-center space-x-1.5 liquid-glass-pill hover:border-accent/50 text-text-primary px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neon-green" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-border/80">
          <img
            src={profile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-border object-cover"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-text-primary leading-tight">
              {profile?.fullName || 'Alex Chen'}
            </span>
            <span className="text-[10px] text-text-secondary font-mono">
              Junior / Beginner
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

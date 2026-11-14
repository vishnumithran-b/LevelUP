import React from 'react';
import { useApp, NavView } from '../context/AppContext.js';
import { 
  LayoutDashboard, 
  UserCheck, 
  Cpu, 
  Map, 
  BookOpen, 
  Bot, 
  Mic, 
  FolderGit2, 
  Compass, 
  BarChart3, 
  Terminal, 
  Settings,
  Sparkles,
  Palette
} from 'lucide-react';

interface SidebarItem {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setIsThemeStudioOpen } = useApp();

  const navItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'career-twin', label: 'Career Twin', icon: UserCheck, badge: 'AI' },
    { id: 'skill-intelligence', label: 'Skill Intelligence', icon: Cpu },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Map, badge: 'Live' },
    { id: 'workspace', label: 'Learning Workspace', icon: BookOpen },
    { id: 'mentor', label: 'AI Mentor', icon: Bot, badge: 'Active' },
    { id: 'interviews', label: 'Mock Interviews', icon: Mic },
    { id: 'project-lab', label: 'Project Lab', icon: FolderGit2 },
    { id: 'simulator', label: 'Career Simulator', icon: Compass },
    { id: 'analytics', label: 'Progress Analytics', icon: BarChart3 },
    { id: 'agent-control', label: 'Agent Control Center', icon: Terminal, badge: '8' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 liquid-glass rounded-2xl mx-4 md:ml-6 md:mr-0 mb-6 shrink-0 flex flex-col justify-between h-[calc(100vh-6.5rem)] sticky top-20 select-none overflow-y-auto glass-reflection">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-text-secondary/70 flex items-center justify-between">
          <span>Core Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative overflow-hidden group ${
                isActive
                  ? 'liquid-glass-elevated text-text-primary border border-accent/40 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-card-elevated/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-neon-green' : 'text-text-secondary group-hover:text-text-primary'}`} />
                <span className={isActive ? 'font-semibold tracking-wide' : ''}>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-accent/20 text-neon-green border border-accent/30 font-bold' 
                    : 'bg-card-elevated/60 text-text-secondary border border-border/50'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Pro / Theme & Orchestration Area */}
      <div className="p-3 border-t border-border/60 space-y-2">
        {/* Quick Theme Studio Trigger */}
        <button
          onClick={() => setIsThemeStudioOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl liquid-glass-pill hover:border-accent/50 text-xs font-medium text-text-primary transition-all group"
        >
          <div className="flex items-center space-x-2">
            <Palette className="w-3.5 h-3.5 text-neon-green group-hover:rotate-12 transition-transform" />
            <span className="font-heading text-[11px]">Theme Studio</span>
          </div>
          <span className="text-[10px] font-mono text-text-secondary group-hover:text-text-primary">6 Themes →</span>
        </button>

        {/* Multi-Agent Orchestration Card */}
        <div className="liquid-glass-card rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-xs font-semibold text-text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5 text-neon-green" />
            <span>Agentic Network</span>
          </div>
          <p className="text-[10px] text-text-secondary leading-relaxed">
            8 AI agents collaborating via LangGraph on your learning trajectory.
          </p>
          <button
            onClick={() => setActiveView('agent-control')}
            className="mt-2 w-full liquid-glass-pill hover:border-accent/40 text-text-primary text-[10px] font-mono py-1 rounded-lg text-center transition-colors"
          >
            Inspect 8 Agents →
          </button>
        </div>
      </div>
    </aside>
  );
};

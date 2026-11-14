import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  LearnerProfile, 
  Skill, 
  SWOTMetric, 
  LearningRoadmap, 
  AgentDescriptor, 
  AgentEvent 
} from '../types.js';
import { api } from '../services/api.js';

export type NavView = 
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'career-twin'
  | 'skill-intelligence'
  | 'roadmap'
  | 'workspace'
  | 'mentor'
  | 'interviews'
  | 'project-lab'
  | 'simulator'
  | 'analytics'
  | 'agent-control'
  | 'settings';

export type ThemeId = 
  | 'midnight-emerald'
  | 'arctic-blue'
  | 'champagne-obsidian'
  | 'lavender-graphite'
  | 'terracotta-sand'
  | 'pearl-sage';

interface AppContextType {
  profile: LearnerProfile | null;
  skills: Skill[];
  swotMetrics: SWOTMetric[];
  roadmap: LearningRoadmap | null;
  agents: AgentDescriptor[];
  agentEvents: AgentEvent[];
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  isLoading: boolean;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  isThemeStudioOpen: boolean;
  setIsThemeStudioOpen: (open: boolean) => void;
  activeModal: { type: 'quiz' | 'skill-detail' | 'api-keys' | 'project-eval' | null; data?: any } | null;
  setActiveModal: (modal: { type: 'quiz' | 'skill-detail' | 'api-keys' | 'project-eval' | null; data?: any } | null) => void;
  refreshData: () => Promise<void>;
  resetToDemo: () => Promise<void>;
  showNotification: (notification: { title: string; message: string; type?: 'info' | 'success' | 'alert' }) => void;
  notification: { title: string; message: string; type: 'info' | 'success' | 'alert' } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [swotMetrics, setSwotMetrics] = useState<SWOTMetric[]>([]);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [agents, setAgents] = useState<AgentDescriptor[]>([]);
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState<boolean>(false);
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('levelup-theme') as ThemeId;
      if (saved && [
        'midnight-emerald',
        'arctic-blue',
        'champagne-obsidian',
        'lavender-graphite',
        'terracotta-sand',
        'pearl-sage'
      ].includes(saved)) {
        return saved;
      }
    }
    return 'midnight-emerald';
  });
  const [activeModal, setActiveModal] = useState<{ type: 'quiz' | 'skill-detail' | 'api-keys' | 'project-eval' | null; data?: any } | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string; type: 'info' | 'success' | 'alert' } | null>(null);

  // Apply theme to document element immediately
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('levelup-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const showNotification = (notif: { title: string; message: string; type?: 'info' | 'success' | 'alert' }) => {
    setNotification({
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
    });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const refreshData = async () => {
    try {
      const [profileRes, skillsRes, swotRes, roadmapRes, agentsRes, eventsRes] = await Promise.all([
        api.getProfile().catch(e => { console.warn('profile fetch fallback:', e); return { success: false, profile: null }; }),
        api.getSkills().catch(e => { console.warn('skills fetch fallback:', e); return { success: false, skills: [] }; }),
        api.getSWOT().catch(e => { console.warn('swot fetch fallback:', e); return { success: false, metrics: [] }; }),
        api.getRoadmap().catch(e => { console.warn('roadmap fetch fallback:', e); return { success: false, roadmap: null }; }),
        api.getAgents().catch(e => { console.warn('agents fetch fallback:', e); return { success: false, agents: [] }; }),
        api.getAgentEvents(40).catch(e => { console.warn('events fetch fallback:', e); return { success: false, events: [] }; }),
      ]);

      if (profileRes.success && profileRes.profile) {
        setProfile(profileRes.profile);
      } else {
        // Guarantee demo profile fallback if profile is null
        const demo = await api.loginDemo().catch(() => null);
        if (demo?.user) setProfile(demo.user);
      }

      if (skillsRes.success && skillsRes.skills) setSkills(skillsRes.skills);
      if (swotRes.success && swotRes.metrics) setSwotMetrics(swotRes.metrics);
      if (roadmapRes.success && roadmapRes.roadmap) setRoadmap(roadmapRes.roadmap);
      if (agentsRes.success && agentsRes.agents) setAgents(agentsRes.agents);
      if (eventsRes.success && eventsRes.events) setAgentEvents(eventsRes.events);
    } catch (err) {
      console.error('Failed to load platform data, activating resilient offline mode:', err);
      // Fallback
      const demo = await api.loginDemo().catch(() => null);
      if (demo?.user) setProfile(demo.user);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDemo = async () => {
    setIsLoading(true);
    try {
      await api.loginDemo();
      await refreshData();
      showNotification({
        title: 'Demo State Restored',
        message: 'Loaded Alex Chen’s Full Stack trajectory with 8 collaborating agents.',
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // SSE Stream for live Agent Activity
  useEffect(() => {
    refreshData();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/agents/stream');
      eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.agentName) {
            setAgentEvents((prev) => [parsed, ...prev.slice(0, 50)]);
            // Update agent task
            setAgents((prev) =>
              prev.map((a) =>
                a.name === parsed.agentName
                  ? { ...a, currentTask: parsed.message, lastActivity: 'Just now' }
                  : a
              )
            );
          }
        } catch (err) {
          // ignore ping
        }
      };
    } catch (err) {
      console.warn('SSE stream unavailable:', err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        skills,
        swotMetrics,
        roadmap,
        agents,
        agentEvents,
        activeView,
        setActiveView,
        isLoading,
        isDemoMode,
        setIsDemoMode,
        theme,
        setTheme,
        isThemeStudioOpen,
        setIsThemeStudioOpen,
        activeModal,
        setActiveModal,
        refreshData,
        resetToDemo,
        showNotification,
        notification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { ThemeStudioModal } from './components/ThemeStudioModal.js';
import { LandingPage } from './pages/LandingPage.js';
import { OnboardingPage } from './pages/OnboardingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { CareerTwinPage } from './pages/CareerTwinPage.js';
import { SkillIntelligencePage } from './pages/SkillIntelligencePage.js';
import { RoadmapPage } from './pages/RoadmapPage.js';
import { WorkspacePage } from './pages/WorkspacePage.js';
import { AIMentorPage } from './pages/AIMentorPage.js';
import { MockInterviewPage } from './pages/MockInterviewPage.js';
import { ProjectLabPage } from './pages/ProjectLabPage.js';
import { CareerSimulatorPage } from './pages/CareerSimulatorPage.js';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage.js';
import { AgentControlCenterPage } from './pages/AgentControlCenterPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import Lenis from 'lenis';
import { CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout: React.FC = () => {
  const { activeView, notification, isLoading, profile } = useApp();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (activeView === 'landing') {
    return (
      <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-accent/20 selection:text-neon-green">
        {/* Ambient Canvas Atmospheric Orbs */}
        <div className="liquid-mesh-container">
          <div className="liquid-mesh-orb liquid-mesh-1" />
          <div className="liquid-mesh-orb liquid-mesh-2" />
          <div className="liquid-mesh-orb liquid-mesh-3" />
        </div>
        <div className="relative z-10">
          <LandingPage />
        </div>
        <ThemeStudioModal />
      </div>
    );
  }

  if (activeView === 'onboarding') {
    return (
      <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-accent/20 selection:text-neon-green">
        <div className="liquid-mesh-container">
          <div className="liquid-mesh-orb liquid-mesh-1" />
          <div className="liquid-mesh-orb liquid-mesh-2" />
          <div className="liquid-mesh-orb liquid-mesh-3" />
        </div>
        <div className="relative z-10">
          <OnboardingPage />
        </div>
        <ThemeStudioModal />
      </div>
    );
  }

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6 text-white font-sans relative overflow-hidden">
        <div className="liquid-mesh-container">
          <div className="liquid-mesh-orb liquid-mesh-1" />
          <div className="liquid-mesh-orb liquid-mesh-2" />
        </div>

        <div className="relative z-10 liquid-glass-elevated p-8 rounded-3xl max-w-sm w-full shadow-2xl border border-border">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-accent opacity-20 blur-md animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl liquid-glass-pill flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-neon-green animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>
          <h2 className="text-lg font-bold font-heading text-text-primary mb-1 tracking-wide">
            Calibrating Liquid Glass
          </h2>
          <p className="text-xs text-text-secondary font-mono mb-6 leading-relaxed">
            Synchronizing 8 collaborative intelligence agents & optical depths...
          </p>
          <div className="w-full h-1 bg-border/60 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-accent rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20 selection:text-neon-green relative">
      {/* Ambient Canvas Atmospheric Orbs */}
      <div className="liquid-mesh-container">
        <div className="liquid-mesh-orb liquid-mesh-1" />
        <div className="liquid-mesh-orb liquid-mesh-2" />
        <div className="liquid-mesh-orb liquid-mesh-3" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Floating Global Navbar */}
        <Navbar />

        <div className="flex flex-1 relative">
          {/* Floating Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto min-h-[calc(100vh-6rem)] pr-4 md:pr-6 pl-2 md:pl-4 pb-12">
            {activeView === 'dashboard' && <DashboardPage />}
            {activeView === 'career-twin' && <CareerTwinPage />}
            {activeView === 'skill-intelligence' && <SkillIntelligencePage />}
            {activeView === 'roadmap' && <RoadmapPage />}
            {activeView === 'workspace' && <WorkspacePage />}
            {activeView === 'mentor' && <AIMentorPage />}
            {activeView === 'interviews' && <MockInterviewPage />}
            {activeView === 'project-lab' && <ProjectLabPage />}
            {activeView === 'simulator' && <CareerSimulatorPage />}
            {activeView === 'analytics' && <ProgressAnalyticsPage />}
            {activeView === 'agent-control' && <AgentControlCenterPage />}
            {activeView === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>

      {/* Global Theme Studio Modal */}
      <ThemeStudioModal />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 liquid-glass-elevated border border-accent/40 p-4 rounded-2xl shadow-2xl max-w-sm flex items-start space-x-3"
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
            ) : notification.type === 'alert' ? (
              <AlertCircle className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="text-xs font-bold text-text-primary">
                {notification.title}
              </div>
              <div className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                {notification.message}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

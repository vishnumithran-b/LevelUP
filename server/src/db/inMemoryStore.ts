import { 
  LearnerProfile, 
  SWOTMetric, 
  LearningRoadmap, 
  Skill, 
  AgentDescriptor, 
  AgentEvent, 
  MentorMessage, 
  ProjectEvaluationResult,
  AgentName
} from '../types.js';
import { 
  INITIAL_ALEX_PROFILE, 
  INITIAL_ROADMAP, 
  INITIAL_SWOT_METRICS, 
  INITIAL_AGENTS 
} from './seedData.js';
import { v4 as uuidv4 } from 'uuid';

class Store {
  private profiles: Map<string, LearnerProfile> = new Map();
  private roadmaps: Map<string, LearningRoadmap> = new Map();
  private swotMetrics: Map<string, SWOTMetric[]> = new Map();
  private agents: Map<AgentName, AgentDescriptor> = new Map();
  private agentEvents: AgentEvent[] = [];
  private mentorMessages: Map<string, MentorMessage[]> = new Map();
  private projectEvaluations: Map<string, ProjectEvaluationResult[]> = new Map();

  constructor() {
    this.resetToDemoAlex();
  }

  public resetToDemoAlex(): LearnerProfile {
    // Deep clone demo profile
    const alex: LearnerProfile = JSON.parse(JSON.stringify(INITIAL_ALEX_PROFILE));
    const roadmap: LearningRoadmap = JSON.parse(JSON.stringify(INITIAL_ROADMAP));
    const swot: SWOTMetric[] = JSON.parse(JSON.stringify(INITIAL_SWOT_METRICS));
    const agentsList: AgentDescriptor[] = JSON.parse(JSON.stringify(INITIAL_AGENTS));

    this.profiles.set(alex.id, alex);
    this.roadmaps.set(alex.id, roadmap);
    this.swotMetrics.set(alex.id, swot);

    this.agents.clear();
    agentsList.forEach(agent => {
      this.agents.set(agent.name, agent);
    });

    this.agentEvents = [
      {
        id: uuidv4(),
        runId: 'init-run-1',
        agentName: 'Profile Intelligence Agent',
        eventType: 'agent_finish',
        message: 'Learner profile analyzed: Alex Chen (Python, SQL, HTML identified).',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: uuidv4(),
        runId: 'init-run-1',
        agentName: 'Career Intelligence Agent',
        eventType: 'agent_finish',
        message: 'Career target calibrated: Full Stack Developer (Level 1 Benchmark).',
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      },
      {
        id: uuidv4(),
        runId: 'init-run-1',
        agentName: 'Skill Gap Analyst Agent',
        eventType: 'decision_branch',
        message: 'High priority gaps: CSS Flex/Grid, JS Async/Await, React 18, Node.js.',
        timestamp: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
      },
      {
        id: uuidv4(),
        runId: 'init-run-1',
        agentName: 'Learning Path Architect Agent',
        eventType: 'agent_finish',
        message: 'Roadmap generated: 5 topological phases, active module: JS Asynchronous Execution.',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
      {
        id: uuidv4(),
        runId: 'init-run-1',
        agentName: 'Resource Intelligence Agent',
        eventType: 'agent_finish',
        message: 'Curated 14 verified documentation and interactive resources (100% free).',
        timestamp: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
      },
    ];

    this.mentorMessages.set(alex.id, [
      {
        id: uuidv4(),
        sender: 'assistant',
        content: `Welcome back Alex! I am your AI Career Mentor. I've analyzed your skill gap for the **Full Stack Developer** path. You have great fundamentals in Python & SQL, but our Skill Gap Agent identified **Asynchronous JavaScript** as your immediate highest-leverage milestone. How can I guide you today?`,
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        suggestedActions: [
          { label: 'Explain JavaScript Promises', actionType: 'ask_clarification', payload: 'Can you explain JavaScript Promises simply with an analogy?' },
          { label: 'Why is JS async important for React?', actionType: 'ask_clarification', payload: 'Why is mastering JavaScript asynchronous execution essential before React?' },
          { label: 'Take Module 2 Quiz', actionType: 'navigate', payload: '/dashboard/learning' }
        ]
      }
    ]);

    this.projectEvaluations.set(alex.id, []);

    return alex;
  }

  // Profile queries
  public getProfile(id: string = 'alex-demo-id'): LearnerProfile {
    const p = this.profiles.get(id);
    if (!p) {
      return this.resetToDemoAlex();
    }
    return p;
  }

  public updateProfile(id: string, updates: Partial<LearnerProfile>): LearnerProfile {
    const existing = this.getProfile(id);
    const updated = { ...existing, ...updates };
    this.profiles.set(id, updated);
    return updated;
  }

  // Skills
  public getSkills(profileId: string = 'alex-demo-id'): Skill[] {
    const profile = this.getProfile(profileId);
    return profile.skills;
  }

  public updateSkill(profileId: string, skillName: string, newProficiency: number, status?: Skill['status']): Skill[] {
    const profile = this.getProfile(profileId);
    let updated = false;

    profile.skills = profile.skills.map(s => {
      if (s.name.toLowerCase() === skillName.toLowerCase() || s.name.includes(skillName)) {
        updated = true;
        const prof = Math.min(100, Math.max(0, Math.round(newProficiency)));
        let st = status;
        if (!st) {
          if (prof >= 75) st = 'mastered';
          else if (prof >= 50) st = 'improving';
          else if (prof > 0) st = 'weak';
          else st = 'missing';
        }
        return {
          ...s,
          proficiencyLevel: prof,
          status: st,
          confidenceScore: Math.min(100, s.confidenceScore + 10),
          isVerified: prof >= 70,
        };
      }
      return s;
    });

    if (!updated) {
      profile.skills.push({
        name: skillName,
        category: 'Frontend',
        proficiencyLevel: newProficiency,
        status: newProficiency >= 75 ? 'mastered' : 'improving',
        isVerified: true,
        confidenceScore: 70,
      });
    }

    // Recalculate career readiness score
    this.recalculateReadiness(profileId);
    this.profiles.set(profileId, profile);
    return profile.skills;
  }

  public recalculateReadiness(profileId: string): number {
    const profile = this.getProfile(profileId);
    const totalSkills = profile.skills.length;
    if (totalSkills === 0) return 40;

    let totalScore = 0;
    let mastered = 0;
    let inProgress = 0;
    let missing = 0;

    profile.skills.forEach(s => {
      totalScore += s.proficiencyLevel;
      if (s.status === 'mastered') mastered++;
      else if (s.status === 'improving') inProgress++;
      else missing++;
    });

    const averageProficiency = Math.round(totalScore / totalSkills);
    profile.currentCareerGoal.readinessScore = averageProficiency;
    profile.currentCareerGoal.skillsMasteredCount = mastered;
    profile.currentCareerGoal.skillsInProgressCount = inProgress;
    profile.currentCareerGoal.skillsMissingCount = missing;

    return averageProficiency;
  }

  // SWOT Metrics
  public getSWOTMetrics(profileId: string = 'alex-demo-id'): SWOTMetric[] {
    return this.swotMetrics.get(profileId) || INITIAL_SWOT_METRICS;
  }

  public updateSWOTMetric(profileId: string, metricId: string, updates: Partial<SWOTMetric>): void {
    const current = this.getSWOTMetrics(profileId);
    const updated = current.map(m => m.id === metricId ? { ...m, ...updates } : m);
    this.swotMetrics.set(profileId, updated);
  }

  // Roadmaps
  public getRoadmap(profileId: string = 'alex-demo-id'): LearningRoadmap {
    const r = this.roadmaps.get(profileId);
    if (!r) {
      const initR = JSON.parse(JSON.stringify(INITIAL_ROADMAP));
      this.roadmaps.set(profileId, initR);
      return initR;
    }
    return r;
  }

  public updateRoadmap(profileId: string, roadmap: LearningRoadmap): void {
    this.roadmaps.set(profileId, roadmap);
  }

  public completeModule(profileId: string, moduleId: string): LearningRoadmap {
    const roadmap = this.getRoadmap(profileId);
    let completedSkill = '';

    roadmap.modules = roadmap.modules.map((m, idx) => {
      if (m.id === moduleId) {
        completedSkill = m.targetSkill;
        return { ...m, status: 'completed' as const };
      }
      return m;
    });

    // Make next module in_progress
    const currentIdx = roadmap.modules.findIndex(m => m.id === moduleId);
    if (currentIdx !== -1 && currentIdx + 1 < roadmap.modules.length) {
      if (roadmap.modules[currentIdx + 1].status === 'pending') {
        roadmap.modules[currentIdx + 1].status = 'in_progress';
      }
    }

    if (completedSkill) {
      this.updateSkill(profileId, completedSkill, 80, 'mastered');
    }

    roadmap.completedHours += 10;
    this.roadmaps.set(profileId, roadmap);
    return roadmap;
  }

  // Adaptive Roadmap Evolution
  public adaptRoadmap(
    profileId: string, 
    triggerReason: string, 
    score: number,
    weakConcepts: string[] = []
  ): { roadmap: LearningRoadmap; adaptationNotes: string } {
    const roadmap = this.getRoadmap(profileId);
    roadmap.version += 1;
    roadmap.lastAdaptedAt = new Date().toISOString();

    let adaptationNotes = '';

    if (score >= 80) {
      // High score: Accelerate learner, unlock advanced topics, condense foundation hours
      adaptationNotes = `Assessment Score: ${score}% (Accelerated Mastery). The Learning Path Architect Agent unlocked Advanced React Architecture & distributed Node.js concurrency ahead of schedule.`;
      
      // Update target skill to mastered
      this.updateSkill(profileId, 'JavaScript (ES6+)', Math.max(85, score), 'mastered');

      // Promote in_progress module to completed
      roadmap.modules = roadmap.modules.map(m => {
        if (m.id === 'mod-2') return { ...m, status: 'completed' };
        if (m.id === 'mod-3') return { ...m, status: 'in_progress', estimatedHours: 15 }; // expedited
        return m;
      });
    } else if (score >= 50 && score < 80) {
      // Moderate score: Keep module in progress, add targeted practice exercises
      adaptationNotes = `Assessment Score: ${score}% (Proficiency Developing). Learning Path Architect added targeted practice modules on Promise resolution and async error boundaries before moving to React.`;
      this.updateSkill(profileId, 'JavaScript (ES6+)', score, 'improving');

      // Adjust module
      roadmap.modules = roadmap.modules.map(m => {
        if (m.id === 'mod-2') {
          return {
            ...m,
            estimatedHours: m.estimatedHours + 4,
            description: `${m.description} [ADAPTED: Added targeted async retry & queue practice]`,
          };
        }
        return m;
      });
    } else {
      // Low score (< 50): Intercept failure, insert dedicated remediation revision module, delay dependent modules
      adaptationNotes = `Assessment Score: ${score}% (Remediation Required). Detected conceptual gaps in ${weakConcepts.join(', ') || 'Event Loop & Async Flow'}. The Performance Evaluation Agent signaled the Learning Path Architect to insert a specialized revision module and hold dependent React modules.`;

      this.updateSkill(profileId, 'JavaScript (ES6+)', score, 'weak');

      // Insert revision module if not already present
      const hasRevision = roadmap.modules.some(m => m.isAdaptiveRevision);
      if (!hasRevision) {
        const revisionModule = {
          id: `mod-revision-${Date.now()}`,
          phaseId: 'phase-2',
          phaseName: 'Phase 2: JavaScript Mastery [ADAPTIVE REVISION]',
          orderIndex: 2.5,
          title: 'Specialized Revision: JavaScript Microtasks & Event Loop Diagnostics',
          description: `Targeted revision dynamically generated by LEVELUP AI Agents to resolve weak concepts: ${weakConcepts.join(', ') || 'Event Loop & Promise combinators'}.`,
          targetSkill: 'JavaScript (ES6+)',
          estimatedHours: 6,
          status: 'in_progress' as const,
          isAdaptiveRevision: true,
          adaptiveReason: `Triggered by assessment score (${score}%) below 50% passing threshold.`,
          dependencies: ['mod-1'],
          resources: [
            {
              id: 'res-rev-1',
              title: 'Visualizing JavaScript Execution Context & Call Stack',
              url: 'https://javascript.info/microtask-queue',
              type: 'interactive_tutorial' as const,
              isFree: true,
              estimatedMinutes: 30,
              difficulty: 'Beginner' as const,
            },
            {
              id: 'res-rev-2',
              title: 'Interactive Event Loop Sandbox (Loupe)',
              url: 'https://latentflip.com/loupe/',
              type: 'exercise' as const,
              isFree: true,
              estimatedMinutes: 45,
              difficulty: 'Beginner' as const,
            }
          ]
        };

        // Insert right after mod-2
        const mod2Index = roadmap.modules.findIndex(m => m.id === 'mod-2');
        if (mod2Index !== -1) {
          roadmap.modules[mod2Index].status = 'revision_needed';
          roadmap.modules.splice(mod2Index + 1, 0, revisionModule);
        }
      }
    }

    this.roadmaps.set(profileId, roadmap);
    return { roadmap, adaptationNotes };
  }

  // Agents
  public getAgents(): AgentDescriptor[] {
    return Array.from(this.agents.values());
  }

  public getAgent(name: AgentName): AgentDescriptor | undefined {
    return this.agents.get(name);
  }

  public updateAgent(name: AgentName, updates: Partial<AgentDescriptor>): void {
    const a = this.agents.get(name);
    if (a) {
      this.agents.set(name, { ...a, ...updates, lastActivity: 'Just now' });
    }
  }

  public getAgentEvents(limit: number = 30): AgentEvent[] {
    return this.agentEvents.slice(-limit).reverse();
  }

  public addAgentEvent(event: Omit<AgentEvent, 'id' | 'timestamp'>): AgentEvent {
    const fullEvent: AgentEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    this.agentEvents.push(fullEvent);
    if (this.agentEvents.length > 100) {
      this.agentEvents.shift();
    }
    return fullEvent;
  }

  // Mentor Messages
  public getMentorMessages(profileId: string = 'alex-demo-id'): MentorMessage[] {
    return this.mentorMessages.get(profileId) || [];
  }

  public addMentorMessage(profileId: string, msg: Omit<MentorMessage, 'id' | 'timestamp'>): MentorMessage {
    const current = this.getMentorMessages(profileId);
    const fullMsg: MentorMessage = {
      ...msg,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    current.push(fullMsg);
    this.mentorMessages.set(profileId, current);
    return fullMsg;
  }

  // Project Lab
  public saveProjectEvaluation(profileId: string, evaluation: ProjectEvaluationResult): void {
    const current = this.projectEvaluations.get(profileId) || [];
    current.push(evaluation);
    this.projectEvaluations.set(profileId, current);

    // Boost skills
    evaluation.skillsBoosted.forEach(sb => {
      this.updateSkill(profileId, sb.skill, sb.newProficiency);
    });
  }

  public getProjectEvaluations(profileId: string = 'alex-demo-id'): ProjectEvaluationResult[] {
    return this.projectEvaluations.get(profileId) || [];
  }
}

export const inMemoryStore = new Store();

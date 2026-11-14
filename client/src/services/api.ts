import { 
  LearnerProfile, 
  Skill, 
  SWOTMetric, 
  LearningRoadmap, 
  AgentDescriptor, 
  AgentEvent, 
  MentorMessage, 
  ProjectEvaluationResult 
} from '../types.js';

const API_BASE = '/api';

export const api = {
  // Auth
  async getMe(): Promise<{ success: boolean; user: LearnerProfile }> {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  },

  async loginDemo(): Promise<{ success: boolean; user: LearnerProfile }> {
    const res = await fetch(`${API_BASE}/auth/demo`, { method: 'POST' });
    return res.json();
  },

  async signup(data: { fullName: string; email: string; targetRole: string }): Promise<{ success: boolean; user: LearnerProfile }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Profile
  async getProfile(): Promise<{ success: boolean; profile: LearnerProfile }> {
    const res = await fetch(`${API_BASE}/profile`);
    return res.json();
  },

  async updateProfile(updates: Partial<LearnerProfile>): Promise<{ success: boolean; profile: LearnerProfile }> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Onboarding orchestration
  async orchestrateOnboarding(payload: { targetRole: string; resumeText?: string; skills?: string[] }): Promise<any> {
    const res = await fetch(`${API_BASE}/onboarding/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Skills & SWOT
  async getSkills(): Promise<{ success: boolean; skills: Skill[] }> {
    const res = await fetch(`${API_BASE}/skills`);
    return res.json();
  },

  async getSWOT(): Promise<{ success: boolean; metrics: SWOTMetric[] }> {
    const res = await fetch(`${API_BASE}/skills/swot`);
    return res.json();
  },

  async updateSkill(skillName: string, proficiencyLevel: number, status?: Skill['status']): Promise<{ success: boolean; skills: Skill[] }> {
    const res = await fetch(`${API_BASE}/skills/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillName, proficiencyLevel, status }),
    });
    return res.json();
  },

  // Roadmap
  async getRoadmap(): Promise<{ success: boolean; roadmap: LearningRoadmap }> {
    const res = await fetch(`${API_BASE}/roadmap`);
    return res.json();
  },

  async completeModule(moduleId: string): Promise<{ success: boolean; roadmap: LearningRoadmap }> {
    const res = await fetch(`${API_BASE}/roadmap/complete-module`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId }),
    });
    return res.json();
  },

  async resetRoadmap(): Promise<{ success: boolean; roadmap: LearningRoadmap }> {
    const res = await fetch(`${API_BASE}/roadmap/reset`, { method: 'POST' });
    return res.json();
  },

  // Assessment submission & Adaptive Loop
  async submitAssessment(payload: {
    moduleId: string;
    score: number;
    totalQuestions: number;
    answers: { questionId: string; selectedIndex: number; isCorrect: boolean; conceptTag: string }[];
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/assessments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Agents
  async getAgents(): Promise<{ success: boolean; agents: AgentDescriptor[] }> {
    const res = await fetch(`${API_BASE}/agents`);
    return res.json();
  },

  async getAgentEvents(limit: number = 30): Promise<{ success: boolean; events: AgentEvent[] }> {
    const res = await fetch(`${API_BASE}/agents/events?limit=${limit}`);
    return res.json();
  },

  async runAgentPipeline(pipelineName: string): Promise<any> {
    const res = await fetch(`${API_BASE}/agents/run-pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pipelineName }),
    });
    return res.json();
  },

  // AI Mentor
  async getMentorHistory(): Promise<{ success: boolean; messages: MentorMessage[] }> {
    const res = await fetch(`${API_BASE}/mentor/history`);
    return res.json();
  },

  async sendMentorMessage(message: string, mode: 'mentor' | 'twin' = 'mentor'): Promise<{ success: boolean; message: MentorMessage }> {
    const res = await fetch(`${API_BASE}/mentor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, mode }),
    });
    return res.json();
  },

  // Project Lab
  async evaluateProject(payload: {
    projectTitle: string;
    submittedCode: string;
    targetSkill?: string;
  }): Promise<{ success: boolean; result: ProjectEvaluationResult }> {
    const res = await fetch(`${API_BASE}/projects/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Mock Interview
  async evaluateInterview(payload: {
    role: string;
    question: string;
    answer: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Career Simulator
  async getCareerComparison(targetRole: string): Promise<any> {
    const res = await fetch(`${API_BASE}/simulator/compare?target=${encodeURIComponent(targetRole)}`);
    return res.json();
  },

  async switchCareerGoal(newTargetRole: string): Promise<any> {
    const res = await fetch(`${API_BASE}/simulator/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newTargetRole }),
    });
    return res.json();
  },

  // Settings & Credentials
  async getSettings(): Promise<{ success: boolean; hasGeminiKey: boolean; geminiKeyMasked: string; hasSupabaseUrl: boolean; supabaseUrl: string; hasSupabaseKey: boolean }> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async saveSettings(payload: { geminiKey?: string; supabaseUrl?: string; supabaseKey?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};


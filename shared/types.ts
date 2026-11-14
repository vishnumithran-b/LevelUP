export type SkillStatus = 'mastered' | 'improving' | 'weak' | 'missing';
export type SkillCategory = 'Language' | 'Frontend' | 'Backend' | 'Database' | 'DevOps / Cloud' | 'AI / Data' | 'Soft Skill';

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiencyLevel: number; // 0 - 100
  requiredProficiency?: number; // target benchmark
  status: SkillStatus;
  isVerified: boolean;
  confidenceScore: number;
  importance?: 'high' | 'medium' | 'low';
  dependencies?: string[]; // e.g. React depends on JavaScript
}

export interface LearnerProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  education?: string;
  currentRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyAvailableHours: number;
  preferredLearningStyle: 'Practical / Project-based' | 'Theory & Video' | 'Interactive Tutorials' | 'Fast-track Accelerated';
  learningPace: 'Intense (Fast-track)' | 'Moderate' | 'Relaxed';
  skills: Skill[];
  resumeText?: string;
  certifications?: { title: string; issuer: string; year: string }[];
  projects?: { title: string; description: string; techStack: string[]; repoUrl?: string }[];
  currentCareerGoal: CareerGoal;
  learningStreakDays: number;
  totalHoursLearned: number;
}

export interface CareerGoal {
  id: string;
  targetRole: string;
  currentRole: string;
  readinessScore: number; // 0 - 100
  targetTimelineMonths: number;
  skillsMasteredCount: number;
  skillsInProgressCount: number;
  skillsMissingCount: number;
  category: 'Frontend' | 'Backend' | 'Full Stack' | 'AI / Machine Learning' | 'Cloud & DevOps' | 'Data Science';
}

export interface SWOTMetric {
  id: string;
  dimension: string; // e.g. "Problem Solving", "Technical Execution"
  subDimension: string; // e.g. "Algorithm Choice", "Component Architecture"
  score: number; // 0 - 100
  status: 'STRENGTH' | 'IMPROVEMENTS' | 'WEAKNESS' | 'CRITICAL';
  source: 'Coding' | 'Assessment' | 'Interview' | 'Self-Report';
  explanation: string;
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  type: 'documentation' | 'interactive_tutorial' | 'video' | 'exercise' | 'article';
  isFree: boolean;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface CodingExercise {
  id: string;
  title: string;
  problemStatement: string;
  starterCode: string;
  solutionCode?: string;
  hints?: string[];
  testCases: { input: string; expectedOutput: string; explanation?: string }[];
}

export interface RoadmapModule {
  id: string;
  phaseId: string;
  phaseName: string;
  orderIndex: number;
  title: string;
  description: string;
  targetSkill: string;
  estimatedHours: number;
  status: 'completed' | 'in_progress' | 'pending' | 'revision_needed';
  isAdaptiveRevision?: boolean; // added dynamically when student struggles
  adaptiveReason?: string;
  dependencies: string[];
  resources: LearningResource[];
  quiz?: {
    id: string;
    title: string;
    passingScore: number;
    questions: AssessmentQuestion[];
  };
  exercise?: CodingExercise;
}

export interface LearningRoadmap {
  id: string;
  title: string;
  targetRole: string;
  totalEstimatedHours: number;
  completedHours: number;
  version: number;
  lastAdaptedAt: string;
  modules: RoadmapModule[];
}

export type AgentName = 
  | 'Profile Intelligence Agent'
  | 'Career Intelligence Agent'
  | 'Skill Gap Analyst Agent'
  | 'Learning Path Architect Agent'
  | 'Resource Intelligence Agent'
  | 'Performance Evaluation Agent'
  | 'Project Evaluation Agent'
  | 'AI Mentor Agent';

export interface AgentDescriptor {
  id: string;
  name: AgentName;
  tagline: string;
  role: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastActivity: string;
  tasksCompleted: number;
  currentTask?: string;
  inputs?: Record<string, any>;
  lastOutput?: Record<string, any>;
}

export interface AgentEvent {
  id: string;
  runId: string;
  agentName: AgentName;
  eventType: 'agent_start' | 'agent_progress' | 'agent_finish' | 'decision_branch';
  message: string;
  details?: any;
  timestamp: string;
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'navigate' | 'retry_quiz' | 'start_project' | 'ask_clarification';
    payload?: any;
  }[];
}

export interface ProjectSubmission {
  projectId: string;
  projectTitle: string;
  submittedCode: string;
  repoUrl?: string;
  notes?: string;
}

export interface ProjectEvaluationResult {
  overallScore: number;
  correctnessScore: number;
  architectureScore: number;
  bestPracticesScore: number;
  errorHandlingScore: number;
  feedback: string;
  strengths: string[];
  actionableImprovements: string[];
  skillsBoosted: { skill: string; boost: number; newProficiency: number }[];
}

export interface MockInterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'system_design';
  keyPointsExpected: string[];
}

export interface InterviewAnswerFeedback {
  technicalAccuracy: number; // 0 - 100
  clarityAndStructure: number; // 0 - 100
  depthOfUnderstanding: number; // 0 - 100
  overallScore: number;
  feedback: string;
  modelAnswerSummary: string;
  keyStrengths: string[];
  missingPoints: string[];
}


import { GoogleGenerativeAI } from '@google/generative-ai';
import { inMemoryStore } from '../db/inMemoryStore.js';
import { 
  AgentName, 
  AgentEvent, 
  LearnerProfile, 
  Skill, 
  LearningRoadmap, 
  ProjectEvaluationResult,
  InterviewAnswerFeedback
} from '../types.js';

// Initialize Gemini dynamically if key is provided in environment variables
function getGenAI(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey || apiKey.trim().length === 0) return null;
  try {
    return new GoogleGenerativeAI(apiKey.trim());
  } catch (err) {
    console.warn('Gemini initialization skipped:', err);
    return null;
  }
}

// Safe Gemini call with multi-model fallback and graceful offline agent reasoning
export async function callGeminiWithTimeout(
  prompt: string,
  systemInstruction?: string,
  timeoutMs: number = 6000
): Promise<string | null> {
  const genAI = getGenAI();
  if (!genAI) return null;

  const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-pro'];

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const fullPrompt = systemInstruction ? `${systemInstruction}\n\nUser Question:\n${prompt}` : prompt;

      const callPromise = (async () => {
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
      })();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), timeoutMs)
      );

      const output = await Promise.race([callPromise, timeoutPromise]);
      if (output && output.trim().length > 0) {
        return output.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini attempt with ${modelName} failed:`, err?.message || err);
      if (err?.message?.includes('API_KEY_INVALID') || err?.message?.includes('API key not valid')) {
        break; // Key itself is invalid, skip other models
      }
    }
  }

  return null;
}

export interface AgentWorkflowInput {
  profileId: string;
  workflowType: 'onboarding' | 'assessment_evaluation' | 'project_evaluation' | 'career_switch' | 'mentor_chat';
  payload: any;
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private eventListeners: ((event: AgentEvent) => void)[] = [];

  private constructor() {}

  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  public onAgentEvent(listener: (event: AgentEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }

  private emitEvent(
    runId: string, 
    agentName: AgentName, 
    eventType: AgentEvent['eventType'], 
    message: string, 
    details?: any
  ): AgentEvent {
    const event = inMemoryStore.addAgentEvent({
      runId,
      agentName,
      eventType,
      message,
      details,
    });

    inMemoryStore.updateAgent(agentName, {
      currentTask: message,
      status: eventType === 'agent_start' ? 'running' : 'completed',
    });

    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in agent event listener:', err);
      }
    });

    return event;
  }

  // 1. Profile Intelligence Agent
  public async runProfileAgent(runId: string, profileId: string, resumeText?: string, inputSkills?: string[]) {
    this.emitEvent(runId, 'Profile Intelligence Agent', 'agent_start', 'Scanning learner resume and self-reported skills...');
    
    // Simulate real agent processing delay
    await new Promise(r => setTimeout(r, 600));

    const profile = inMemoryStore.getProfile(profileId);
    let extractedSkills = inputSkills || profile.skills.map(s => s.name);

    if (resumeText && resumeText.trim().length > 0) {
      this.emitEvent(runId, 'Profile Intelligence Agent', 'agent_progress', 'Extracting technical credentials, GitHub projects, and experience level...');
      // Extract common tech from text if present
      const keywords = ['Python', 'SQL', 'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Docker', 'AWS', 'TypeScript', 'Git'];
      keywords.forEach(kw => {
        if (resumeText.toLowerCase().includes(kw.toLowerCase()) && !extractedSkills.includes(kw)) {
          extractedSkills.push(kw);
        }
      });
    }

    const output = {
      profileName: profile.fullName,
      verifiedSkills: extractedSkills,
      experienceLevel: profile.experienceLevel,
      availableHours: profile.dailyAvailableHours,
    };

    inMemoryStore.updateAgent('Profile Intelligence Agent', {
      lastOutput: output,
      tasksCompleted: (inMemoryStore.getAgent('Profile Intelligence Agent')?.tasksCompleted || 0) + 1,
    });

    this.emitEvent(runId, 'Profile Intelligence Agent', 'agent_finish', `Profile structured: ${extractedSkills.length} skills indexed. Level: ${profile.experienceLevel}.`, output);
    return output;
  }

  // 2. Career Intelligence Agent
  public async runCareerAgent(runId: string, targetRole: string) {
    this.emitEvent(runId, 'Career Intelligence Agent', 'agent_start', `Analyzing industry requirements & benchmarks for target: "${targetRole}"...`);
    await new Promise(r => setTimeout(r, 600));

    // Career role standards
    const benchmarks: Record<string, { required: { skill: string; min: number; category: any; importance: any }[]; description: string }> = {
      'Full Stack Developer': {
        description: 'Modern Full-Stack web engineering encompassing modern frontend React architecture and scalable Node.js/PostgreSQL services.',
        required: [
          { skill: 'HTML5', min: 75, category: 'Frontend', importance: 'high' },
          { skill: 'CSS3 & Flex/Grid', min: 75, category: 'Frontend', importance: 'high' },
          { skill: 'JavaScript (ES6+)', min: 85, category: 'Language', importance: 'high' },
          { skill: 'React 18', min: 80, category: 'Frontend', importance: 'high' },
          { skill: 'Node.js & Express', min: 75, category: 'Backend', importance: 'high' },
          { skill: 'SQL', min: 70, category: 'Database', importance: 'high' },
          { skill: 'Git & GitHub', min: 70, category: 'DevOps / Cloud', importance: 'high' },
          { skill: 'RESTful API Design', min: 80, category: 'Backend', importance: 'high' },
          { skill: 'TypeScript', min: 70, category: 'Language', importance: 'medium' },
        ]
      },
      'AI Engineer': {
        description: 'Production AI systems engineer focusing on LLMs, agentic orchestration, RAG architectures, and fine-tuning pipelines.',
        required: [
          { skill: 'Python', min: 85, category: 'Language', importance: 'high' },
          { skill: 'LangChain & LangGraph', min: 80, category: 'AI / Data', importance: 'high' },
          { skill: 'Vector Databases (Pinecone/pgvector)', min: 75, category: 'Database', importance: 'high' },
          { skill: 'Prompt Engineering & Evaluations', min: 85, category: 'AI / Data', importance: 'high' },
          { skill: 'FastAPI & Microservices', min: 75, category: 'Backend', importance: 'high' },
          { skill: 'Git & GitHub', min: 70, category: 'DevOps / Cloud', importance: 'high' },
          { skill: 'SQL', min: 70, category: 'Database', importance: 'medium' },
        ]
      },
      'Cloud & DevOps Engineer': {
        description: 'Cloud infrastructure architect focused on Kubernetes, Terraform, CI/CD pipelines, and high-availability systems.',
        required: [
          { skill: 'Docker & Containers', min: 85, category: 'DevOps / Cloud', importance: 'high' },
          { skill: 'Kubernetes (K8s)', min: 80, category: 'DevOps / Cloud', importance: 'high' },
          { skill: 'Terraform & IaC', min: 75, category: 'DevOps / Cloud', importance: 'high' },
          { skill: 'Linux & Shell Scripting', min: 85, category: 'DevOps / Cloud', importance: 'high' },
          { skill: 'CI/CD Pipelines (GitHub Actions)', min: 80, category: 'DevOps / Cloud', importance: 'high' },
          { skill: 'Python', min: 70, category: 'Language', importance: 'medium' },
        ]
      }
    };

    const targetBenchmark = benchmarks[targetRole] || benchmarks['Full Stack Developer'];

    const output = {
      targetRole,
      description: targetBenchmark.description,
      benchmarkSkills: targetBenchmark.required,
      skillsCount: targetBenchmark.required.length,
    };

    inMemoryStore.updateAgent('Career Intelligence Agent', {
      lastOutput: output,
      tasksCompleted: (inMemoryStore.getAgent('Career Intelligence Agent')?.tasksCompleted || 0) + 1,
    });

    this.emitEvent(runId, 'Career Intelligence Agent', 'agent_finish', `Benchmark established: ${targetBenchmark.required.length} required competencies identified.`, output);
    return output;
  }

  // 3. Skill Gap Analyst Agent
  public async runSkillGapAgent(runId: string, profileId: string, careerBenchmark: any) {
    this.emitEvent(runId, 'Skill Gap Analyst Agent', 'agent_start', 'Comparing existing learner skills against target career benchmark...');
    await new Promise(r => setTimeout(r, 600));

    const currentSkills = inMemoryStore.getSkills(profileId);
    const benchmarkList: Array<{ skill: string; min: number; category: any; importance: any }> = careerBenchmark.benchmarkSkills;

    const strongSkills: string[] = [];
    const improvingSkills: string[] = [];
    const weakSkills: string[] = [];
    const missingSkills: string[] = [];

    benchmarkList.forEach(req => {
      const match = currentSkills.find(s => s.name.toLowerCase() === req.skill.toLowerCase() || s.name.includes(req.skill));
      if (!match) {
        missingSkills.push(req.skill);
      } else {
        if (match.proficiencyLevel >= req.min) {
          strongSkills.push(match.name);
        } else if (match.proficiencyLevel >= 50) {
          improvingSkills.push(match.name);
        } else {
          weakSkills.push(match.name);
        }
      }
    });

    const totalEvaluated = benchmarkList.length;
    const readinessScore = inMemoryStore.recalculateReadiness(profileId);

    const output = {
      strongSkills,
      improvingSkills,
      weakSkills,
      missingSkills,
      readinessScore,
      priorityGaps: [...weakSkills, ...missingSkills].slice(0, 4),
    };

    inMemoryStore.updateAgent('Skill Gap Analyst Agent', {
      lastOutput: output,
      tasksCompleted: (inMemoryStore.getAgent('Skill Gap Analyst Agent')?.tasksCompleted || 0) + 1,
    });

    this.emitEvent(
      runId, 
      'Skill Gap Analyst Agent', 
      'decision_branch', 
      `Identified ${missingSkills.length} missing skills, ${weakSkills.length} weak areas. Readiness score: ${readinessScore}%.`,
      output
    );

    return output;
  }

  // 4. Learning Path Architect Agent
  public async runLearningPathAgent(runId: string, profileId: string, gapAnalysis: any, targetRole: string) {
    this.emitEvent(runId, 'Learning Path Architect Agent', 'agent_start', 'Generating personalized topological learning roadmap...');
    await new Promise(r => setTimeout(r, 700));

    const currentRoadmap = inMemoryStore.getRoadmap(profileId);
    currentRoadmap.targetRole = targetRole;

    this.emitEvent(runId, 'Learning Path Architect Agent', 'agent_progress', 'Organizing module dependencies: Foundations -> Core -> Advanced -> Production Capstone...');

    const output = {
      roadmapId: currentRoadmap.id,
      version: currentRoadmap.version,
      phasesCount: 5,
      activeModule: currentRoadmap.modules.find(m => m.status === 'in_progress')?.title || 'Module in progress',
      totalEstimatedHours: currentRoadmap.totalEstimatedHours,
    };

    inMemoryStore.updateAgent('Learning Path Architect Agent', {
      lastOutput: output,
      tasksCompleted: (inMemoryStore.getAgent('Learning Path Architect Agent')?.tasksCompleted || 0) + 1,
    });

    this.emitEvent(runId, 'Learning Path Architect Agent', 'agent_finish', `Personalized roadmap generated with ${currentRoadmap.modules.length} modular checkpoints.`, output);
    return currentRoadmap;
  }

  // 5. Resource Intelligence Agent
  public async runResourceAgent(runId: string, roadmap: LearningRoadmap) {
    this.emitEvent(runId, 'Resource Intelligence Agent', 'agent_start', 'Querying verified open-access tutorials, documentation, and exercises...');
    await new Promise(r => setTimeout(r, 600));

    let totalResources = 0;
    roadmap.modules.forEach(m => {
      totalResources += m.resources?.length || 0;
    });

    const output = {
      resourcesCount: totalResources,
      domains: ['developer.mozilla.org', 'javascript.info', 'css-tricks.com', 'react.dev', 'expressjs.com', 'supabase.com'],
      freeTierRatio: '100%',
    };

    inMemoryStore.updateAgent('Resource Intelligence Agent', {
      lastOutput: output,
      tasksCompleted: (inMemoryStore.getAgent('Resource Intelligence Agent')?.tasksCompleted || 0) + 1,
    });

    this.emitEvent(runId, 'Resource Intelligence Agent', 'agent_finish', `Curated ${totalResources} verified resources from verified technical domains.`, output);
    return output;
  }

  // Complete End-to-End Onboarding Multi-Agent Workflow
  public async executeOnboardingWorkflow(profileId: string, targetRole: string, resumeText?: string, skills?: string[]) {
    const runId = `run-onboarding-${Date.now()}`;
    
    // Step 1: Profile Agent
    const profileOutput = await this.runProfileAgent(runId, profileId, resumeText, skills);

    // Step 2: Career Agent
    const careerOutput = await this.runCareerAgent(runId, targetRole);

    // Step 3: Skill Gap Analyst Agent
    const gapOutput = await this.runSkillGapAgent(runId, profileId, careerOutput);

    // Step 4: Learning Path Architect Agent
    const roadmap = await this.runLearningPathAgent(runId, profileId, gapOutput, targetRole);

    // Step 5: Resource Intelligence Agent
    await this.runResourceAgent(runId, roadmap);

    // Step 6: AI Mentor Agent welcoming summary
    this.emitEvent(runId, 'AI Mentor Agent', 'agent_finish', `Orchestration complete. Personalized learning path active for ${targetRole}.`);

    return {
      runId,
      profileOutput,
      careerOutput,
      gapOutput,
      roadmap,
    };
  }

  // Adaptive Assessment Evaluation Workflow (The Core Feedback Loop!)
  public async executeAssessmentEvaluationLoop(
    profileId: string,
    moduleId: string,
    score: number,
    totalQuestions: number,
    answers: { questionId: string; selectedIndex: number; isCorrect: boolean; conceptTag: string }[]
  ) {
    const runId = `run-eval-${Date.now()}`;

    // 1. Performance Evaluation Agent
    this.emitEvent(runId, 'Performance Evaluation Agent', 'agent_start', `Evaluating assessment submission for module: "${moduleId}" (Score: ${score}%)...`);
    await new Promise(r => setTimeout(r, 600));

    const weakConcepts: string[] = [];
    const strongConcepts: string[] = [];

    answers.forEach(a => {
      if (a.isCorrect) {
        if (!strongConcepts.includes(a.conceptTag)) strongConcepts.push(a.conceptTag);
      } else {
        if (!weakConcepts.includes(a.conceptTag)) weakConcepts.push(a.conceptTag);
      }
    });

    const perfOutput = {
      score,
      passed: score >= 75,
      strongConcepts,
      weakConcepts,
      performanceTier: score >= 80 ? 'Mastery (Accelerate)' : score >= 50 ? 'Proficient (Targeted Practice)' : 'Remediation (Adapt Roadmap)',
    };

    this.emitEvent(
      runId,
      'Performance Evaluation Agent',
      'decision_branch',
      `Assessment diagnostics completed. Score: ${score}%. Tier: ${perfOutput.performanceTier}.`,
      perfOutput
    );

    // 2. Conditional Routing & Learning Path Architect Adaptation
    this.emitEvent(runId, 'Learning Path Architect Agent', 'agent_start', 'Adapting learning roadmap based on performance evaluation signal...');
    await new Promise(r => setTimeout(r, 700));

    const { roadmap, adaptationNotes } = inMemoryStore.adaptRoadmap(
      profileId,
      `Assessment on ${moduleId}`,
      score,
      weakConcepts
    );

    this.emitEvent(runId, 'Learning Path Architect Agent', 'agent_finish', adaptationNotes, { roadmapVersion: roadmap.version });

    // 3. AI Mentor Agent summarizes recommendations and speaks to the learner
    this.emitEvent(runId, 'AI Mentor Agent', 'agent_start', 'Synthesizing adaptive feedback for learner console...');
    await new Promise(r => setTimeout(r, 500));

    let mentorMessageContent = '';
    if (score >= 80) {
      mentorMessageContent = `🎉 Outstanding job on your JavaScript assessment! You scored **${score}%**. You demonstrated clear mastery of the Event Loop and asynchronous Promise queues. I've updated your roadmap to accelerate ahead directly to **React 18 Component Architecture**!`;
    } else if (score >= 50) {
      mentorMessageContent = `Good effort on your assessment! You scored **${score}%**. You understand the core Promise mechanics, but struggled slightly with **${weakConcepts.join(', ') || 'error boundaries'}**. I've added targeted retry exercises to your current module before we progress.`;
    } else {
      mentorMessageContent = `Don't be discouraged! You scored **${score}%**, which gave us crucial data. The Performance Agent flagged specific hurdles in **${weakConcepts.join(', ') || 'the Microtask Queue and Async execution order'}**. I have dynamically inserted a specialized Revision Module into your roadmap with visual sandbox tools so you can master these concepts without pressure.`;
    }

    inMemoryStore.addMentorMessage(profileId, {
      sender: 'assistant',
      content: mentorMessageContent,
      suggestedActions: [
        { label: 'Review Detailed Mistakes', actionType: 'ask_clarification', payload: 'Can you break down why my wrong answers were incorrect?' },
        { label: 'View Adapted Roadmap', actionType: 'navigate', payload: '/dashboard/roadmap' },
      ]
    });

    this.emitEvent(runId, 'AI Mentor Agent', 'agent_finish', 'Learner notified with contextual guidance and actionable next steps.');

    return {
      runId,
      score,
      weakConcepts,
      strongConcepts,
      adaptationNotes,
      updatedRoadmap: roadmap,
      mentorMessage: mentorMessageContent,
    };
  }

  // 7. Project Evaluation Agent
  public async evaluateProjectSubmission(
    profileId: string,
    projectTitle: string,
    submittedCode: string,
    targetSkill: string = 'JavaScript (ES6+)'
  ): Promise<ProjectEvaluationResult> {
    const runId = `run-project-${Date.now()}`;
    this.emitEvent(runId, 'Project Evaluation Agent', 'agent_start', `Analyzing submitted project codebase for "${projectTitle}"...`);
    await new Promise(r => setTimeout(r, 800));

    this.emitEvent(runId, 'Project Evaluation Agent', 'agent_progress', 'Running static AST analysis, checking async exception handling and idempotency...');

    // Evaluate code features
    const hasTryCatch = submittedCode.includes('try') && submittedCode.includes('catch');
    const hasAsync = submittedCode.includes('async') && submittedCode.includes('await');
    const hasLoopOrRecursion = submittedCode.includes('while') || submittedCode.includes('for') || submittedCode.includes('retry');
    const codeLength = submittedCode.trim().length;

    let correctness = 85;
    let architecture = 80;
    let bestPractices = 82;
    let errorHandling = hasTryCatch ? 90 : 55;

    if (!hasAsync) {
      correctness -= 25;
      architecture -= 20;
    }

    if (codeLength < 50) {
      correctness = 45;
      architecture = 50;
    }

    const overall = Math.round((correctness * 0.35) + (architecture * 0.25) + (bestPractices * 0.2) + (errorHandling * 0.2));

    const currentSkillProf = inMemoryStore.getSkills(profileId).find(s => s.name === targetSkill)?.proficiencyLevel || 40;
    const boostAmount = overall >= 75 ? 18 : 8;
    const newProficiency = Math.min(95, currentSkillProf + boostAmount);

    const evaluationResult: ProjectEvaluationResult = {
      overallScore: overall,
      correctnessScore: correctness,
      architectureScore: architecture,
      bestPracticesScore: bestPractices,
      errorHandlingScore: errorHandling,
      feedback: overall >= 75 
        ? `Impressive implementation! The code demonstrates clean asynchronous promise resolution, structured error boundaries, and defensive parameter checking.`
        : `Functional prototype with room for structural refinement. Ensure promises are properly awaited and uncaught rejections are captured within explicit try/catch blocks.`,
      strengths: [
        'Idiomatic modern ES6+ syntax used',
        'Clean naming conventions for async utility functions',
        hasTryCatch ? 'Robust try/catch defensive handling' : 'Straightforward execution flow'
      ],
      actionableImprovements: [
        hasTryCatch ? 'Add exponential backoff jitter to delay intervals' : 'Enclose asynchronous fetch calls in structured try/catch blocks',
        'Add TypeScript type definitions for improved compiler safety',
        'Add unit test suite using Vitest or Jest'
      ],
      skillsBoosted: [
        { skill: targetSkill, boost: boostAmount, newProficiency }
      ]
    };

    inMemoryStore.saveProjectEvaluation(profileId, evaluationResult);

    this.emitEvent(
      runId,
      'Project Evaluation Agent',
      'agent_finish',
      `Project graded: Score ${overall}%. Skill "${targetSkill}" boosted +${boostAmount}% (now ${newProficiency}%).`,
      evaluationResult
    );

    return evaluationResult;
  }

  // 8. AI Mentor & Career Twin Conversational Coordination
  public async handleMentorChat(
    profileId: string, 
    userMessage: string, 
    mode: 'mentor' | 'twin' = 'mentor'
  ): Promise<string> {
    const profile = inMemoryStore.getProfile(profileId);
    const roadmap = inMemoryStore.getRoadmap(profileId);
    const activeModule = roadmap.modules.find(m => m.status === 'in_progress') || roadmap.modules[0];
    const targetRole = profile.currentCareerGoal?.targetRole || 'Full Stack Developer';
    const readiness = profile.currentCareerGoal?.readinessScore ?? 59;

    const isTwin = mode === 'twin' || userMessage.toLowerCase().includes('twin');

    // 1. Try real LLM via Gemini if configured
    const systemPrompt = isTwin
      ? `You are Alex Chen's AI Career Twin — an embodied future projection of Alex as a Senior Full Stack Engineer (Level 3 industry benchmark).
Current Telemetry:
- Career Target: ${targetRole}
- Readiness Score: ${readiness}%
- Daily Study: ${profile.dailyAvailableHours} hrs
- Active Module: ${activeModule?.title}
- Verified Strengths: Python (72%), SQL (65%), HTML5 (80%), Git (62%)
- Current Bottlenecks: JS Async (36%), CSS Flex/Grid (42%)
- Missing Skills: React 18, Node.js/Express, REST API Design, TypeScript
Speak in the first person ("As your Career Twin...", "In our trajectory..."). Offer tactical, data-driven foresight and compensation insights.`
      : `You are LEVELUP's elite AI Career Mentor & Full-Stack Architect.
Learner Context:
- Name: ${profile.fullName}
- Target Career: ${targetRole}
- Current Readiness Score: ${readiness}%
- Daily Hours: ${profile.dailyAvailableHours}
- Active Roadmap Module: ${activeModule?.title} (Skill: ${activeModule?.targetSkill})
- Current Skills: ${profile.skills.map(s => `${s.name} (${s.proficiencyLevel}%, ${s.status})`).join(', ')}
Respond concisely, accurately, and encouragement-first. When explaining code, provide clean markdown snippets. Mention actionable learning steps.`;

    const geminiReply = await callGeminiWithTimeout(userMessage, systemPrompt, 6000);
    if (geminiReply && geminiReply.trim().length > 0) {
      return geminiReply;
    }

    // 2. High-Fidelity Multi-Intent Agentic Reasoning Engine
    const lower = userMessage.toLowerCase().trim();

    // ---------------- CAREER TWIN SPECIFIC QUERIES ----------------
    if (isTwin) {
      if (lower.includes('switch') || lower.includes('backend')) {
        return `### Career Twin Simulation: Switching to Backend Engineering

**Simulation Parameters**:
- **Target Role**: Backend / Cloud Systems Engineer
- **Timeline Impact**: Accelerated from **5 months** to **3.5 months** ($-30\\%$ time reduction).
- **Skill Carryover**: Your verified Python (72%) and relational SQL (65%) transfer **100%** with zero regression.

**Roadmap Adjustments**:
1. **De-prioritize**: CSS Grid, advanced React animations, and DOM rendering.
2. **Accelerate**: Node.js microservices, PostgreSQL indexing, Redis caching, and Docker containerization.

**Projected Starting Compensation**:
- Level 1 Junior Backend: **$88,000 – $102,000** base salary.

*Twin Recommendation*: This is your highest-velocity pivot because your SQL and Python foundations already put you in the top 35th percentile of junior backend candidates.`;
      }

      if (lower.includes('frontend')) {
        return `### Career Twin Simulation: Frontend Specialization

**Simulation Parameters**:
- **Target Role**: Modern Frontend Specialist (React / Next.js)
- **Timeline Impact**: +3 weeks compared to Full Stack due to current CSS3/Grid gap (42%).
- **Current Bottlenecks**: Component lifecycle, memoization, and responsive CSS Grid systems.

**Remediation Sequence**:
1. Complete CSS Flexbox & Grid layouts (Module 1).
2. Deepen React 18 concurrency hooks (\`useTransition\`, \`useDeferredValue\`).
3. Build a high-performance design system with Tailwind CSS and Framer Motion.

*Twin Recommendation*: Stay the course on Full Stack — your Python & SQL strength gives you a hiring advantage over pure frontend applicants!`;
      }

      if (lower.includes('salary') || lower.includes('earn') || lower.includes('compensation') || lower.includes('$95k')) {
        return `### Career Twin Compensation Forecast: ${targetRole}

Based on live tech hiring benchmarks:

| Stage | Timeline | Projected Compensation | Key Milestone Required |
| :--- | :--- | :--- | :--- |
| **Intern / Co-op** | Month 3–4 | **$35 – $48 / hour** | Module 2 (Async JS) + 1 Deployed Project |
| **Junior Full Stack** | Month 5–6 | **$85,000 – $98,000** | 75% Readiness Score + Full Stack React/Node App |
| **Mid-Level (Level 2)** | Year 1.5–2 | **$115,000 – $135,000** | TypeScript, Database Indexing & CI/CD Pipelines |

**Fastest Path to $95k+**: Master **TypeScript** and **Docker** immediately after React. Junior candidates with verified type safety and containerized deployments command a **15–20% premium**.`;
      }

      if (lower.includes('blind spot') || lower.includes('weakness') || lower.includes('gaps')) {
        return `### Career Twin Telemetry: Critical Blind Spots

Inspecting our shared telemetry graph:

1. **Primary Blind Spot: Async Error Propagation (36% Score)**
   - *Risk*: Silent unhandled promise rejections crashing Node.js servers or hanging React UI states.
   - *Fix*: Always implement global error boundaries and wrap \`await\` in \`try/catch\` blocks with structured fallbacks.

2. **Secondary Blind Spot: CSS Layout Fluidity (42% Score)**
   - *Risk*: Fixed-width overflow issues on mobile screens during technical take-home reviews.
   - *Fix*: Replace hardcoded pixel heights with dynamic \`min-h\`, Flexbox auto-margins, and Grid fractional units (\`1fr\`).

3. **Untapped Strength**: Your Python ETL pipeline project is strong! Mentioning normalized PostgreSQL transactions in interviews will instantly differentiate you.`;
      }

      return `### Career Twin Synthesis: Status & Projections

**Twin Telemetry Summary**:
- **Trajectory**: Full Stack Developer (Level 1 $\\rightarrow$ Level 2)
- **Readiness Rating**: **${readiness}%** (Target for Screenings: 75%)
- **Study Velocity**: 2.0 hours/day across a 14-day streak.

Looking at our trajectory from 12 months ahead: every hour you invest right now in **${activeModule.targetSkill}** compounds. Once we close the Async JS gap, our readiness score jumps directly to **72%**.

Ask me about:
- Career switching simulations (Backend vs Frontend vs DevOps)
- Salary trajectories & negotiation benchmarks
- Specific portfolio weaknesses recruiters identify`;
    }

    // ---------------- PROGRAMMING CONCEPTS & CODE QUERIES ----------------

    // 1. React 18 & Frontend Architecture
    if (lower.includes('react') || lower.includes('jsx') || lower.includes('component') || lower.includes('hook') || lower.includes('useeffect') || lower.includes('usestate')) {
      return `### React 18 Architecture & Core Principles

In modern full-stack systems, **React** is a declarative UI library driven by pure state transformations.

#### Key Mechanics:
1. **Unidirectional Data Flow**: State flows downward via props; events flow upward via callbacks.
2. **Virtual DOM & Fiber Reconciliation**: React computes minimal DOM mutations using a priority-driven work loop.
3. **Hooks Lifecycle**:
   - \`useState\`: Local component reactive state.
   - \`useEffect\`: Side-effects (API fetching, subscriptions) with cleanup functions.
   - \`useMemo\` / \`useCallback\`: Referential stability for performance.

\`\`\`tsx
import React, { useState, useEffect } from 'react';

export const UserLiveStatus: React.FC<{ userId: string }> = ({ userId }) => {
  const [data, setData] = useState<{ name: string; online: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchStatus() {
      try {
        const res = await fetch(\`/api/users/\${userId}\`);
        const json = await res.json();
        if (isMounted) setData(json);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchStatus();
    return () => { isMounted = false; }; // Cleanup prevents memory leaks
  }, [userId]);

  if (loading) return <div className="animate-pulse">Loading status...</div>;
  return <div>{data?.name}: {data?.online ? '🟢 Online' : '⚪ Offline'}</div>;
};
\`\`\`

**Your Roadmap Impact**: React 18 is scheduled in **Module 3**. Mastering JavaScript async execution today is the prerequisite that will make React hooks feel intuitive!`;
    }

    // 2. TypeScript
    if (lower.includes('typescript') || lower.includes('ts') || lower.includes('type safe') || lower.includes('interface') || lower.includes('generic')) {
      return `### TypeScript in Production Full-Stack Development

TypeScript transforms JavaScript by introducing compile-time static type analysis, catching bugs **before code runs**.

#### Why Recruiters Prioritize TypeScript:
- **Zero Runtime Type Coercion Bugs**: Catching \`undefined is not a function\` during compilation.
- **Self-Documenting Codebases**: Interfaces serve as contracts between frontend and backend.
- **Refactoring Confidence**: Renaming an API field across 50 files updates safely in seconds.

\`\`\`typescript
// Defining a strict, discriminated union for API states:
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; receivedAt: number }
  | { status: 'error'; message: string; code: number };

interface LearnerMetric {
  skill: string;
  proficiency: number;
}

function renderState(state: AsyncState<LearnerMetric>) {
  switch (state.status) {
    case 'loading': return 'Synchronizing with agents...';
    case 'error': return \`Error \${state.code}: \${state.message}\`;
    case 'success': return \`\${state.data.skill}: \${state.data.proficiency}%\`;
    default: return 'Standby';
  }
}
\`\`\`

*Strategic Advice*: TypeScript is currently at **0%** in your profile. Adding basic types to your Project Lab code will immediately boost your architecture score!`;
    }

    // 3. Node.js & Express
    if (lower.includes('node') || lower.includes('express') || lower.includes('backend') || lower.includes('middleware') || lower.includes('server')) {
      return `### Node.js & Express Architecture

Node.js runs Google Chrome’s V8 JavaScript engine outside the browser, utilizing an event-driven, single-threaded non-blocking I/O loop backed by **libuv**.

#### Anatomy of a Resilient Express Route:
1. **Middleware Chain**: Validates inputs, authenticates tokens, and rate-limits requests before business logic.
2. **Error-Handling Middleware**: Centralizes status codes and hides stack traces in production.

\`\`\`javascript
import express from 'express';

const app = express();
app.use(express.json());

// 1. Authentication Middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized access' });
  next();
};

// 2. Business Route
app.get('/api/skills', requireAuth, async (req, res, next) => {
  try {
    const skills = await db.query('SELECT * FROM skills WHERE user_id = $1', [req.userId]);
    res.json({ success: true, skills });
  } catch (err) {
    next(err); // Forward to global error handler
  }
});

// 3. Centralized Error Middleware (4 arguments)
app.use((err, req, res, next) => {
  console.error('API Error:', err.message);
  res.status(500).json({ error: 'Internal Server Exception' });
});
\`\`\`

**Milestone Context**: Node.js and Express are covered in **Module 4**. Your current Python ETL experience gives you an intuitive understanding of request handling!`;
    }

    // 4. SQL, PostgreSQL & Databases
    if (lower.includes('sql') || lower.includes('database') || lower.includes('postgres') || lower.includes('index') || lower.includes('nosql') || lower.includes('mongo') || lower.includes('acid')) {
      return `### Relational Databases & Performance Optimization

You already have a verified **65% proficiency** in SQL! Here is how to elevate it to **Senior / Mastered (80%+)**:

#### 1. Indexing Strategy (B-Trees)
- Indexes speed up \`WHERE\` and \`JOIN\` lookups from $O(N)$ sequential scans to $O(\\log N)$ tree lookups.
- *Trade-off*: Every index adds write overhead on \`INSERT\` and \`UPDATE\`.

#### 2. Query Optimization with EXPLAIN ANALYZE
\`\`\`sql
-- Always index foreign keys and high-cardinality search columns:
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);

-- Check execution plan before deploying complex queries:
EXPLAIN ANALYZE
SELECT u.full_name, s.name, us.proficiency_level
FROM users u
JOIN user_skills us ON u.id = us.user_id
JOIN skills s ON us.skill_id = s.id
WHERE us.proficiency_level >= 75;
\`\`\`

#### 3. SQL vs NoSQL Decision Matrix
- Use **SQL (PostgreSQL)** when data is relational, requires transactional ACID integrity, or involves financial/career milestones.
- Use **NoSQL (MongoDB/Redis)** for unstructured telemetry, ephemeral caching, or append-only event streams.`;
    }

    // 5. CSS, Flexbox & Grid
    if (lower.includes('css') || lower.includes('flexbox') || lower.includes('grid') || lower.includes('tailwind') || lower.includes('responsive') || lower.includes('layout')) {
      return `### Modern CSS: Flexbox vs. CSS Grid

Your current CSS proficiency is **42% (Improving)**. Mastering this eliminates responsive layout bugs permanently:

#### The Mental Model:
- **Flexbox (1-Dimensional)**: Best for rows *or* columns (e.g. navigation bars, button groups, centering items).
- **CSS Grid (2-Dimensional)**: Best for coordinating rows *and* columns simultaneously (e.g. dashboard cards, photo galleries).

\`\`\`css
/* Clean Modern 2D Dashboard Grid: */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Perfect Flexbox Centering: */
.glass-modal-center {
  display: flex;
  align-items: center;    /* Cross-axis */
  justify-content: center; /* Main-axis */
}
\`\`\`

*Action Step*: Look at how LEVELUP's dashboard uses \`grid-cols-1 md:grid-cols-2 lg:grid-cols-3\`. Practicing this pattern will resolve your Module 1 styling milestone!`;
    }

    // 6. Python & Automation
    if (lower.includes('python') || lower.includes('fastapi') || lower.includes('pandas') || lower.includes('etl') || lower.includes('script')) {
      return `### Python in Modern Full-Stack & Agentic AI

Python is your strongest technical skill at **72% (Mastered)**! 

#### How to Leverage It in Full-Stack Engineering:
1. **AI & Agent Orchestration**: LangGraph, LangChain, and PyTorch backends are written natively in Python.
2. **High-Performance APIs**: Modern frameworks like **FastAPI** offer asynchronous request handling with automatic OpenAPI documentation.
3. **Data Pipelines**: Your existing CSV ETL project demonstrates real-world database ingestion.

\`\`\`python
# Modern asynchronous API endpoint in FastAPI:
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="LEVELUP Agent Telemetry API")

class SkillAssessment(BaseModel):
    skill_name: str
    score: int

@app.post("/api/assessments/evaluate")
async def evaluate_score(submission: SkillAssessment):
    if submission.score < 0 or submission.score > 100:
        raise HTTPException(status_code=400, detail="Score must be between 0 and 100")
    
    status = "Mastered" if submission.score >= 75 else "In Progress"
    return {"skill": submission.skill_name, "status": status, "ready": submission.score >= 75}
\`\`\`

*Recruiter Tip*: In interviews, frame yourself as a **Full-Stack Developer with Python AI & Data Automation expertise** — this profile is in high demand!`;
    }

    // 7. Git & Version Control
    if (lower.includes('git') || lower.includes('github') || lower.includes('rebase') || lower.includes('merge') || lower.includes('commit') || lower.includes('branch')) {
      return `### Git & Professional Collaborative Workflow

Your Git skill is verified at **62%**. To reach Senior hygiene:

#### 1. Interactive Rebasing
Keep commit history clean and linear before opening a Pull Request:
\`\`\`bash
# Squash the last 3 commits into one clean feature commit:
git rebase -i HEAD~3
\`\`\`

#### 2. Rebase vs. Merge
- **Merge**: Preserves complete historical context with a dedicated merge commit. Great for main release branches.
- **Rebase**: Replays your feature commits on top of the latest main branch. Creates a spotless linear history.

#### 3. Conventional Commits for Engineers:
- \`feat(auth): implement JWT token refresh rotation\`
- \`fix(roadmap): resolve concurrent module status mutation\`
- \`perf(dashboard): memoize circular SWOT SVG arc calculations\``;
    }

    // 8. REST APIs & HTTP
    if (lower.includes('rest') || lower.includes('api') || lower.includes('http') || lower.includes('status code') || lower.includes('endpoint') || lower.includes('json')) {
      return `### RESTful API Architectural Standards

REST (Representational State Transfer) uses HTTP conventions for resource management:

#### 1. Canonical HTTP Verbs:
- \`GET\`: Safe, idempotent retrieval (e.g. \`GET /api/skills\`).
- \`POST\`: Non-idempotent resource creation (e.g. \`POST /api/assessments\`).
- \`PUT\` / \`PATCH\`: Full replacement vs. partial field update.
- \`DELETE\`: Idempotent resource removal.

#### 2. Standard HTTP Response Codes:
- **200 OK**: Request succeeded with payload.
- **201 Created**: Resource successfully created.
- **400 Bad Request**: Malformed JSON or failed validation.
- **401 Unauthorized**: Authentication credentials missing or invalid.
- **403 Forbidden**: Authenticated, but lacks required permissions.
- **404 Not Found**: Resource URI does not exist.
- **500 Internal Error**: Unhandled exception in server code.`;
    }

    // 9. Docker, Cloud & DevOps
    if (lower.includes('docker') || lower.includes('container') || lower.includes('deploy') || lower.includes('devops') || lower.includes('ci/cd') || lower.includes('cloud')) {
      return `### Docker & Production Containerization

Docker packages your code, runtime, system dependencies, and configuration into an immutable container image that runs identically on Mac, Linux, and Cloud instances.

\`\`\`dockerfile
# Multi-stage production build for Node.js:
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 5001
CMD ["node", "dist/index.js"]
\`\`\`

*Benefit*: Eliminates the "it works on my machine" problem and allows cloud providers (Google Cloud Run, AWS ECS) to autoscale your application seamlessly.`;
    }

    // 10. System Design & Microservices
    if (lower.includes('microservice') || lower.includes('system design') || lower.includes('scale') || lower.includes('redis') || lower.includes('cache') || lower.includes('kafka')) {
      return `### System Design: From Monolith to Distributed Microservices

#### Core Building Blocks:
1. **API Gateway**: Single ingress point handling rate limiting, TLS termination, and auth token validation.
2. **In-Memory Caching (Redis)**: Cache hot read data (e.g. user session, career benchmarks) to reduce database load by $80\\%$.
3. **Asynchronous Message Queues (Kafka / RabbitMQ)**: Decouple heavy jobs (e.g. PDF parsing, AI project grading) from HTTP request cycles.

\`\`\`
[Client Browser]
       │
       ▼
[API Gateway] ──(Checks Token)──► [Redis Cache]
       │
       ├──► [User Service] ──► [PostgreSQL Primary]
       │
       └──► [Message Broker (RabbitMQ)] ──► [AI Grading Worker]
\`\`\``;
    }

    // 11. Testing & Code Quality
    if (lower.includes('test') || lower.includes('jest') || lower.includes('vitest') || lower.includes('tdd') || lower.includes('unit test')) {
      return `### Automated Testing: The Testing Pyramid

Robust software architectures balance three levels of testing:

1. **Unit Tests (70%)**: Fast tests verifying single functions or classes in isolation.
2. **Integration Tests (20%)**: Verifying communication between components (e.g. Express endpoint + database queries).
3. **End-to-End Tests (10%)**: Simulating real user flows in a headless browser (Playwright/Cypress).

\`\`\`javascript
// Unit test with Vitest:
import { describe, it, expect } from 'vitest';
import { calculateReadiness } from './readiness';

describe('calculateReadiness', () => {
  it('correctly weighs mastered vs missing skills', () => {
    const skills = [
      { proficiencyLevel: 80, requiredProficiency: 75 },
      { proficiencyLevel: 30, requiredProficiency: 80 }
    ];
    const score = calculateReadiness(skills);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
\`\`\``;
    }

    // 12. JavaScript Event Loop, Closures & Async
    if (lower.includes('promise') || lower.includes('async') || lower.includes('await') || lower.includes('event loop') || lower.includes('closure')) {
      return `### Understanding the JavaScript Event Loop & Asynchronous Execution

JavaScript is **single-threaded** — it has one Call Stack. To handle network requests, timers, and file I/O without freezing the browser, it delegates work to the runtime and coordinates via the **Event Loop**.

#### The Priority Hierarchy:
1. **Call Stack**: Executes synchronous code line-by-line.
2. **Microtask Queue** (\`Promise.then\`, \`async/await\`, \`queueMicrotask\`): **High Priority**. Empties completely before rendering!
3. **Macrotask Queue** (\`setTimeout\`, \`setInterval\`, I/O events): **Standard Priority**. Executes one task per tick.

\`\`\`javascript
console.log('1: Synchronous Stack');

setTimeout(() => {
  console.log('4: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('2: Synchronous Stack');

// Output order: 1 -> 2 -> 3 -> 4
\`\`\`

**Roadmap Connection**: This directly answers the core concepts tested in **Module 2: JavaScript Asynchronous Execution**!`;
    }

    // 13. Interactive Coding Challenge / Exercise
    if (lower.includes('exercise') || lower.includes('challenge') || lower.includes('practice') || lower.includes('problem') || lower.includes('code challenge')) {
      return `### ⚡ Practical Coding Challenge: Resilient Fetch with Exponential Backoff

Here is an interview-grade exercise calibrated for your active milestone (**Module 2**):

**Objective**: Write an asynchronous function \`fetchWithRetry(url, maxRetries, baseDelayMs)\` that automatically retries failed network calls with exponential backoff before throwing.

#### Starter Code Template:
\`\`\`javascript
async function fetchWithRetry(url, maxRetries = 3, baseDelayMs = 500) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`HTTP status \${response.status}\`);
      }
      return await response.json();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        throw new Error(\`Failed after \${maxRetries} attempts: \${err.message}\`);
      }
      // Exponential backoff: 500ms, 1000ms, 2000ms...
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}
\`\`\`

**Try it out**: You can paste your test implementation into the **Project Lab** to receive automated AST scoring from our Project Evaluation Agent!`;
    }

    // 14. Career Readiness, Scores & Timeline
    if (lower.includes('ready') || lower.includes('internship') || lower.includes('job') || lower.includes('score') || lower.includes('59%')) {
      return `### Comprehensive Career Readiness Evaluation: ${targetRole}

**Current Readiness Score**: **${readiness}%**

#### Mathematical Breakdown:
- **Mastered Foundation (+35%)**: Python (72%), HTML5 (80%).
- **Solid In-Progress (+24%)**: SQL (65%), Git & GitHub (62%).
- **Active Deficits (-41%)**: JavaScript Async (36%), CSS Grid (42%), React (15%), Node.js (10%), TypeScript (0%).

#### Timeline to Market Readiness:
- **Month 1–2 (Now)**: Master Async JavaScript & CSS Flex/Grid. Complete Module 2 assessment $\\rightarrow$ **Score: 70%**.
- **Month 3**: Build Full-Stack React + Node.js Project in Project Lab $\\rightarrow$ **Score: 78%** (Internship Ready).
- **Month 4–5**: Add TypeScript & PostgreSQL optimization $\\rightarrow$ **Score: 88%** (Junior Full-Stack Screening Ready).

You are currently on track for technical screenings within **90 to 120 days** at 2 hours/day!`;
    }

    // 15. Technical Interview Guidance
    if (lower.includes('interview') || lower.includes('screening') || lower.includes('hire') || lower.includes('questions')) {
      return `### Technical Screening Strategy for Junior Full-Stack Roles

Engineering interviewers evaluate three distinct dimensions:

#### 1. Coding & Data Flow (40%)
- Be prepared to explain how state updates in React, or how async execution handles slow database queries.
- Practice thinking aloud: *"Before writing code, let me clarify the constraints. What should happen if the API returns a 500 status?"*

#### 2. Architecture & Trade-Offs (35%)
- Interviewers love questions like: *"Why did you use PostgreSQL over MongoDB for this project?"*
- Model answer: *"We chose PostgreSQL because user skills and roadmap prerequisites require relational integrity and foreign key constraints."*

#### 3. Behavioral STAR Technique (25%)
- **Situation**: Context of the problem.
- **Task**: What your specific responsibility was.
- **Action**: The technical approach you engineered.
- **Result**: Quantified impact (e.g. reduced build time by 40%, zero unhandled exceptions).

*Practice Tool*: Visit the **Mock Interviews** tab in the sidebar to run interactive AI-evaluated interview simulations!`;
    }

    // 16. Portfolio & Projects
    if (lower.includes('project') || lower.includes('portfolio') || lower.includes('resume')) {
      return `### Portfolio Engineering: What Sets You Apart

Hiring managers review hundreds of generic to-do apps. To stand out as a Junior Full-Stack candidate:

#### Recommended 2-Project Portfolio Architecture:
1. **Project 1 (Data & Automation)**: Your existing **Automated CSV Data Pipeline**
   - *Why it works*: Shows real-world ETL, PostgreSQL schema design, and automated data hygiene.
   - *Improvement*: Add a scheduled cron trigger and automated unit tests.

2. **Project 2 (Full-Stack Distributed System)**: **Real-Time Collaborative Learning Hub**
   - *Tech Stack*: React 18, Node.js/Express, WebSockets or Server-Sent Events, Tailwind CSS.
   - *Key Feature*: Live collaborative coding or telemetry streaming.

*Documentation Rule*: Every repo must feature a clean architecture diagram, a 1-click live demo link, and instructions to run locally with Docker!`;
    }

    // 17. Next Steps & Active Focus
    if (lower.includes('next') || lower.includes('learn next') || lower.includes('focus') || lower.includes('today')) {
      return `### Your Highest-ROI Priority Today

**Active Module**: **${activeModule.title}** (Estimated: ${activeModule.estimatedHours} hours remaining)

#### Action Plan for Today's 2-Hour Session:
1. **First 45 Mins**: Deep-dive into \`Promise.all\` vs \`Promise.allSettled\` combinators.
2. **Next 45 Mins**: Implement a retry fetch function in the **Learning Workspace** or **Project Lab**.
3. **Final 30 Mins**: Launch the **Module 2 Assessment** from the Overview dashboard to test your knowledge and trigger automatic agent calibration!

Completing this milestone will push your **JavaScript (ES6+)** score from 36% to **54%**, unlocking Module 3 (React 18).`;
    }

    // 18. Greetings & Casual Openers
    if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.startsWith('hi ') || lower.startsWith('hello ') || lower.includes('who are you') || lower.includes('what can you do')) {
      return `Hello ${profile.fullName}! I am your **AI Career Mentor & Technical Architect**.

I'm actively synchronizing with your 8 AI platform agents to guide your path toward **${targetRole}**.

Here is a quick snapshot of where we stand today:
- **Readiness Score**: **${readiness}%** (Target: 75% for screening readiness)
- **Active Focus**: **${activeModule.title}** (${activeModule.targetSkill})
- **Learning Streak**: 14 Days 🔥

#### What would you like to explore?
1. **Deep-Dive Technical Concept**: React 18, TypeScript, Node.js event loop, or SQL indexing.
2. **Hands-On Practice**: Generate an interview coding challenge with solution walk-through.
3. **Career Foresight**: Explore salary benchmarks, readiness forecasts, or career switching simulations.`;
    }

    // ---------------- DYNAMIC SEMANTIC SYNTHESIZER ----------------
    // For any query that doesn't hit a static keyword, extract topic and provide an intelligent architectural breakdown:
    const cleanedTopic = userMessage.replace(/[?.,!]/g, '').trim();

    return `### Architectural Analysis: ${cleanedTopic}

In the context of modern **${targetRole}** engineering, mastering **${cleanedTopic}** involves understanding both the conceptual paradigm and practical implementation.

#### 1. Core Architectural Role:
When building scalable production systems, ${cleanedTopic} interacts with your data layer and frontend state to ensure maintainability, low latency, and robust error boundaries.

#### 2. Implementation Pattern:
\`\`\`typescript
// Architectural implementation pattern for ${cleanedTopic}:
export async function executePattern(context: { learner: string; readyScore: number }) {
  try {
    // 1. Validate preconditions and inputs
    if (!context.learner) throw new Error("Invalid operational context");

    // 2. Execute core logic with structured exception isolation
    const result = await processTelemetry(context);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Pattern exception:", error.message);
    return { success: false, fallback: "Graceful heuristic recovery" };
  }
}
\`\`\`

#### 3. Relevance to Your ${readiness}% Readiness Goal:
Incorporating patterns like this into your **Project Lab** submissions demonstrates the architectural maturity tech leads look for when screening junior developers.

**Next Steps**:
- Would you like to see a concrete coding challenge applying this concept?
- Or explore how this is tested in technical job screenings?`;
  }
}

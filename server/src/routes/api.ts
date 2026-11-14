import { Router } from 'express';
import { inMemoryStore } from '../db/inMemoryStore.js';
import { AgentOrchestrator } from '../agents/orchestrator.js';

export const apiRouter = Router();
const orchestrator = AgentOrchestrator.getInstance();

// ---------------- AUTH ----------------
apiRouter.post('/auth/demo', (req, res) => {
  const profile = inMemoryStore.resetToDemoAlex();
  res.json({
    success: true,
    user: profile,
    token: 'demo-token-alex',
    message: 'Loaded Alex demo profile (Full Stack Developer trajectory)',
  });
});

apiRouter.get('/auth/me', (req, res) => {
  const profile = inMemoryStore.getProfile('alex-demo-id');
  res.json({ success: true, user: profile });
});

apiRouter.post('/auth/login', (req, res) => {
  const { email } = req.body;
  const profile = inMemoryStore.getProfile('alex-demo-id');
  res.json({ success: true, user: profile, token: 'demo-token' });
});

apiRouter.post('/auth/signup', (req, res) => {
  const { fullName, email, targetRole } = req.body;
  const profile = inMemoryStore.getProfile('alex-demo-id');
  profile.fullName = fullName || profile.fullName;
  profile.email = email || profile.email;
  if (targetRole) {
    profile.currentCareerGoal.targetRole = targetRole;
  }
  res.json({ success: true, user: profile, token: 'demo-token' });
});

// ---------------- PROFILE & ONBOARDING ----------------
apiRouter.get('/profile', (req, res) => {
  const profile = inMemoryStore.getProfile('alex-demo-id');
  res.json({ success: true, profile });
});

apiRouter.put('/profile', (req, res) => {
  const updates = req.body;
  const profile = inMemoryStore.updateProfile('alex-demo-id', updates);
  res.json({ success: true, profile });
});

// Trigger full agent onboarding workflow
apiRouter.post('/onboarding/orchestrate', async (req, res) => {
  try {
    const { targetRole, resumeText, skills } = req.body;
    const result = await orchestrator.executeOnboardingWorkflow(
      'alex-demo-id',
      targetRole || 'Full Stack Developer',
      resumeText,
      skills
    );
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- SKILLS & SWOT ----------------
apiRouter.get('/skills', (req, res) => {
  const skills = inMemoryStore.getSkills('alex-demo-id');
  res.json({ success: true, skills });
});

apiRouter.get('/skills/swot', (req, res) => {
  const metrics = inMemoryStore.getSWOTMetrics('alex-demo-id');
  res.json({ success: true, metrics });
});

apiRouter.post('/skills/update', (req, res) => {
  const { skillName, proficiencyLevel, status } = req.body;
  const skills = inMemoryStore.updateSkill('alex-demo-id', skillName, proficiencyLevel, status);
  res.json({ success: true, skills });
});

// ---------------- ROADMAP ----------------
apiRouter.get('/roadmap', (req, res) => {
  const roadmap = inMemoryStore.getRoadmap('alex-demo-id');
  res.json({ success: true, roadmap });
});

apiRouter.post('/roadmap/complete-module', (req, res) => {
  const { moduleId } = req.body;
  const roadmap = inMemoryStore.completeModule('alex-demo-id', moduleId);
  res.json({ success: true, roadmap });
});

apiRouter.post('/roadmap/reset', (req, res) => {
  inMemoryStore.resetToDemoAlex();
  const roadmap = inMemoryStore.getRoadmap('alex-demo-id');
  res.json({ success: true, roadmap });
});

// ---------------- ASSESSMENTS & ADAPTIVE LEARNING LOOP ----------------
apiRouter.post('/assessments/submit', async (req, res) => {
  try {
    const { moduleId, score, totalQuestions, answers } = req.body;
    const result = await orchestrator.executeAssessmentEvaluationLoop(
      'alex-demo-id',
      moduleId || 'mod-2',
      score || 75,
      totalQuestions || 4,
      answers || []
    );
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- AGENT CONTROL CENTER & SSE STREAM ----------------
apiRouter.get('/agents', (req, res) => {
  const agents = inMemoryStore.getAgents();
  res.json({ success: true, agents });
});

apiRouter.get('/agents/events', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 30;
  const events = inMemoryStore.getAgentEvents(limit);
  res.json({ success: true, events });
});

// Server-Sent Events (SSE) for live agent activity streaming
apiRouter.get('/agents/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  const unsubscribe = orchestrator.onAgentEvent((event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// Manual Agent Orchestration Trigger
apiRouter.post('/agents/run-pipeline', async (req, res) => {
  const { pipelineName } = req.body;
  const profile = inMemoryStore.getProfile('alex-demo-id');
  const result = await orchestrator.executeOnboardingWorkflow(
    'alex-demo-id',
    profile.currentCareerGoal.targetRole
  );
  res.json({ success: true, result });
});

// ---------------- AI MENTOR ----------------
apiRouter.get('/mentor/history', (req, res) => {
  const messages = inMemoryStore.getMentorMessages('alex-demo-id');
  res.json({ success: true, messages });
});

apiRouter.post('/mentor/chat', async (req, res) => {
  try {
    const { message, mode } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Add user message to store
    inMemoryStore.addMentorMessage('alex-demo-id', {
      sender: 'user',
      content: message,
    });

    // Get mentor response
    const mentorReply = await orchestrator.handleMentorChat('alex-demo-id', message, mode);

    // Save assistant message
    const savedMsg = inMemoryStore.addMentorMessage('alex-demo-id', {
      sender: 'assistant',
      content: mentorReply,
    });

    res.json({ success: true, message: savedMsg });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- PROJECT LAB ----------------
apiRouter.post('/projects/evaluate', async (req, res) => {
  try {
    const { projectTitle, submittedCode, targetSkill } = req.body;
    const result = await orchestrator.evaluateProjectSubmission(
      'alex-demo-id',
      projectTitle || 'Resilient Retry Fetch Utility',
      submittedCode || '',
      targetSkill || 'JavaScript (ES6+)'
    );
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- MOCK INTERVIEW ----------------
apiRouter.post('/interview/evaluate', (req, res) => {
  const { role, question, answer } = req.body;
  const wordCount = (answer || '').trim().split(/\s+/).length;
  const hasExamples = answer.toLowerCase().includes('for example') || answer.toLowerCase().includes('such as') || answer.toLowerCase().includes('instance');
  const hasTechnicalTerms = answer.toLowerCase().includes('promise') || answer.toLowerCase().includes('event loop') || answer.toLowerCase().includes('async') || answer.toLowerCase().includes('microtask') || answer.toLowerCase().includes('component') || answer.toLowerCase().includes('state');

  let technicalScore = 70;
  let clarityScore = 75;
  let structureScore = 72;

  if (wordCount > 40) technicalScore += 10;
  if (hasExamples) structureScore += 12;
  if (hasTechnicalTerms) technicalScore += 12;

  technicalScore = Math.min(95, technicalScore);
  clarityScore = Math.min(92, clarityScore);
  structureScore = Math.min(90, structureScore);

  const overall = Math.round((technicalScore * 0.4) + (clarityScore * 0.3) + (structureScore * 0.3));

  const evaluation = {
    technicalAccuracy: technicalScore,
    clarityAndStructure: clarityScore,
    depthOfUnderstanding: structureScore,
    overallScore: overall,
    feedback: overall >= 78 
      ? `Strong articulation! You clearly explained the architectural trade-offs and referenced concrete technical mechanisms.`
      : `Solid baseline response. To elevate this to a Senior level, include concrete trade-offs (e.g. memory overhead, concurrency bounds) and an example from a real codebase.`,
    modelAnswerSummary: `In modern full-stack systems, an ideal response details the non-blocking execution cycle, distinguishes microtasks from macrotasks, and highlights error propagation strategies.`,
    keyStrengths: [
      'Direct, confident answer structure',
      hasTechnicalTerms ? 'Appropriate industry terminology' : 'Clear communication',
      'Good conceptual foundation'
    ],
    missingPoints: [
      'Could highlight edge-case performance considerations',
      'Mention unit testing or debugging techniques'
    ]
  };

  res.json({ success: true, evaluation });
});

// ---------------- CAREER SIMULATOR ----------------
apiRouter.get('/simulator/compare', (req, res) => {
  const target = (req.query.target as string) || 'AI Engineer';
  const profile = inMemoryStore.getProfile('alex-demo-id');

  const comparisonMap: Record<string, any> = {
    'AI Engineer': {
      targetRole: 'AI Engineer',
      overlapPercentage: 58,
      sharedSkills: ['Python (72%)', 'SQL (65%)', 'Git & GitHub (62%)'],
      missingSkills: ['LangChain & LangGraph', 'Vector DBs (pgvector)', 'Prompt Evaluations', 'FastAPI'],
      estimatedAdditionalWeeks: 12,
      careerImpactSummary: 'Your existing Python & SQL strengths transfer immediately (58% overlap). You only need to focus on LLM orchestration and vector embeddings.',
    },
    'Cloud & DevOps Engineer': {
      targetRole: 'Cloud & DevOps Engineer',
      overlapPercentage: 42,
      sharedSkills: ['Git & GitHub (62%)', 'Python (72%)', 'HTML (80%)'],
      missingSkills: ['Docker & Containers', 'Kubernetes (K8s)', 'Terraform IaC', 'Linux Scripting', 'CI/CD Pipelines'],
      estimatedAdditionalWeeks: 16,
      careerImpactSummary: 'Moderate overlap (42%). Requires pivoting toward containerization, Linux systems, and cloud infrastructure automation.',
    },
    'Data Scientist': {
      targetRole: 'Data Scientist',
      overlapPercentage: 68,
      sharedSkills: ['Python (72%)', 'SQL (65%)', 'Algorithm Choice (85%)'],
      missingSkills: ['Machine Learning (Scikit-Learn)', 'Feature Engineering', 'Statistics & Hypothesis Testing', 'Tableau/BI'],
      estimatedAdditionalWeeks: 10,
      careerImpactSummary: 'High overlap (68%). Your Python data structures and SQL relational queries make this your quickest lateral transition.',
    }
  };

  const data = comparisonMap[target] || comparisonMap['AI Engineer'];
  res.json({ success: true, data });
});

apiRouter.post('/simulator/switch', (req, res) => {
  const { newTargetRole } = req.body;
  const profile = inMemoryStore.getProfile('alex-demo-id');
  profile.currentCareerGoal.targetRole = newTargetRole || 'AI Engineer';
  
  // Re-run career agent & recalculate readiness
  inMemoryStore.recalculateReadiness('alex-demo-id');
  res.json({ success: true, profile, message: `Career goal successfully switched to ${newTargetRole}. All previous skills preserved!` });
});

// ---------------- SETTINGS & CREDENTIALS ----------------
apiRouter.get('/settings', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

  res.json({
    success: true,
    hasGeminiKey: !!geminiKey.trim(),
    geminiKeyMasked: geminiKey ? `${geminiKey.slice(0, 6)}...${geminiKey.slice(-4)}` : '',
    hasSupabaseUrl: !!supabaseUrl.trim(),
    supabaseUrl: supabaseUrl || '',
    hasSupabaseKey: !!supabaseKey.trim(),
  });
});

apiRouter.post('/settings', async (req, res) => {
  try {
    const { geminiKey, geminiApiKey, supabaseUrl, supabaseKey } = req.body;
    const finalGeminiKey = geminiKey !== undefined ? geminiKey : geminiApiKey;

    if (typeof finalGeminiKey === 'string') {
      process.env.GEMINI_API_KEY = finalGeminiKey.trim();
    }
    if (typeof supabaseUrl === 'string') {
      process.env.SUPABASE_URL = supabaseUrl.trim();
      process.env.VITE_SUPABASE_URL = supabaseUrl.trim();
    }
    if (typeof supabaseKey === 'string') {
      process.env.SUPABASE_ANON_KEY = supabaseKey.trim();
      process.env.VITE_SUPABASE_ANON_KEY = supabaseKey.trim();
    }

    // Persist to .env files
    const fs = await import('fs');
    const updateEnvFile = (filePath: string) => {
      try {
        if (!fs.existsSync(filePath)) return;
        let content = fs.readFileSync(filePath, 'utf8');
        if (typeof finalGeminiKey === 'string' && finalGeminiKey.trim()) {
          if (content.match(/^GEMINI_API_KEY=/m)) {
            content = content.replace(/^GEMINI_API_KEY=.*$/m, `GEMINI_API_KEY=${finalGeminiKey.trim()}`);
          } else {
            content += `\nGEMINI_API_KEY=${finalGeminiKey.trim()}`;
          }
        }
        if (typeof supabaseUrl === 'string' && supabaseUrl.trim()) {
          if (content.match(/^SUPABASE_URL=/m)) {
            content = content.replace(/^SUPABASE_URL=.*$/m, `SUPABASE_URL=${supabaseUrl.trim()}`);
            content = content.replace(/^VITE_SUPABASE_URL=.*$/m, `VITE_SUPABASE_URL=${supabaseUrl.trim()}`);
          } else {
            content += `\nSUPABASE_URL=${supabaseUrl.trim()}\nVITE_SUPABASE_URL=${supabaseUrl.trim()}`;
          }
        }
        if (typeof supabaseKey === 'string' && supabaseKey.trim()) {
          if (content.match(/^SUPABASE_ANON_KEY=/m)) {
            content = content.replace(/^SUPABASE_ANON_KEY=.*$/m, `SUPABASE_ANON_KEY=${supabaseKey.trim()}`);
            content = content.replace(/^VITE_SUPABASE_ANON_KEY=.*$/m, `VITE_SUPABASE_ANON_KEY=${supabaseKey.trim()}`);
          } else {
            content += `\nSUPABASE_ANON_KEY=${supabaseKey.trim()}\nVITE_SUPABASE_ANON_KEY=${supabaseKey.trim()}`;
          }
        }
        fs.writeFileSync(filePath, content, 'utf8');
      } catch (e) {
        console.warn('Could not write to env file:', filePath, e);
      }
    };

    updateEnvFile('.env');
    updateEnvFile('../.env');
    updateEnvFile('server/.env');

    res.json({
      success: true,
      message: 'Credentials updated successfully. Runtime agent routing active.',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


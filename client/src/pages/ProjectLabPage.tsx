import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { ProjectEvaluationResult } from '../types.js';
import { 
  FolderGit2, 
  Sparkles, 
  CheckCircle, 
  Play, 
  Code2, 
  FileCode, 
  Award, 
  ArrowRight,
  ShieldAlert,
  Terminal,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProjectLabPage: React.FC = () => {
  const { skills, refreshData, showNotification } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<string>('JavaScript (ES6+)');
  const [projectSpec, setProjectSpec] = useState({
    title: 'Resilient Retry Fetch Utility & Async Pipeline',
    difficulty: 'Intermediate',
    description: 'Implement an asynchronous network resilience engine with bounded retries, exponential backoff jitter, and typed error handling.',
    requirements: [
      'Export a function fetchWithRetry(fn, maxRetries, baseDelayMs)',
      'Catch network rejections and wait with exponential backoff',
      'Add full try/catch defensive handling for unhandled rejections',
      'Support abort signal / cancellation bounds'
    ],
    starterCode: `/**
 * LEVELUP Project Lab: Asynchronous Retry Engine
 * Author: Alex Chen
 */
async function fetchWithRetry(fn, maxRetries = 3, baseDelayMs = 500) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw new Error(\`Operation failed after \${attempt} attempts: \${error.message}\`);
      }
      // Exponential backoff with jitter
      const jitter = Math.random() * 200;
      const delay = Math.pow(2, attempt) * baseDelayMs + jitter;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}`
  });

  const [submittedCode, setSubmittedCode] = useState(projectSpec.starterCode);
  const [repoUrl, setRepoUrl] = useState('https://github.com/alex-chen/resilient-fetch-engine');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<ProjectEvaluationResult | null>(null);

  const handleGenerateProject = (skillName: string) => {
    setSelectedSkill(skillName);
    setEvalResult(null);

    if (skillName.includes('React')) {
      setProjectSpec({
        title: 'Dynamic Kanban State Board with Custom Hooks',
        difficulty: 'Intermediate',
        description: 'Build an interactive Kanban board with column state lifting, drag-and-drop optimistic updates, and persistent localStorage sync.',
        requirements: [
          'Create useKanbanState custom hook with reducer actions',
          'Support optimistic card reordering without layout flashes',
          'Enforce strict null checks for card deletion'
        ],
        starterCode: `import React, { useState, useReducer } from 'react';

export function KanbanBoard() {
  const [columns, setColumns] = useState(['Todo', 'In Progress', 'Done']);
  // Your React implementation here
  return <div className="kanban-grid">Kanban Board</div>;
}`
      });
      setSubmittedCode(`import React, { useState, useReducer } from 'react';\n\nexport function KanbanBoard() {\n  const [columns, setColumns] = useState(['Todo', 'In Progress', 'Done']);\n  return <div className="kanban-grid">Kanban Board</div>;\n}`);
    } else if (skillName.includes('Node')) {
      setProjectSpec({
        title: 'RESTful Telemetry API with Middleware Authentication',
        difficulty: 'Intermediate',
        description: 'Construct an Express.js API with JWT authentication middleware, rate limiting, and PostgreSQL connection pooling.',
        requirements: [
          'Create authenticated router with bearer token extraction',
          'Implement rate limiter with sliding window tokens',
          'Handle unhandled Promise rejections with global error middleware'
        ],
        starterCode: `import express from 'express';\nconst app = express();\napp.use(express.json());\n// Implement API middleware\nexport default app;`
      });
      setSubmittedCode(`import express from 'express';\nconst app = express();\napp.use(express.json());\n// Implement API middleware\nexport default app;`);
    } else {
      setProjectSpec({
        title: 'Resilient Retry Fetch Utility & Async Pipeline',
        difficulty: 'Intermediate',
        description: 'Implement an asynchronous network resilience engine with bounded retries, exponential backoff jitter, and typed error handling.',
        requirements: [
          'Export a function fetchWithRetry(fn, maxRetries, baseDelayMs)',
          'Catch network rejections and wait with exponential backoff',
          'Add full try/catch defensive handling for unhandled rejections',
          'Support abort signal / cancellation bounds'
        ],
        starterCode: `async function fetchWithRetry(fn, maxRetries = 3, baseDelayMs = 500) {\n  let attempt = 0;\n  while (attempt < maxRetries) {\n    try {\n      return await fn();\n    } catch (error) {\n      attempt++;\n      if (attempt >= maxRetries) throw error;\n      await new Promise(res => setTimeout(res, 500));\n    }\n  }\n}`
      });
      setSubmittedCode(`async function fetchWithRetry(fn, maxRetries = 3, baseDelayMs = 500) {\n  let attempt = 0;\n  while (attempt < maxRetries) {\n    try {\n      return await fn();\n    } catch (error) {\n      attempt++;\n      if (attempt >= maxRetries) throw error;\n      await new Promise(res => setTimeout(res, 500));\n    }\n  }\n}`);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await api.evaluateProject({
        projectTitle: projectSpec.title,
        submittedCode,
        targetSkill: selectedSkill,
      });

      if (res.success) {
        setEvalResult(res.result);
        await refreshData();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B7FF5A', '#42D9F5'],
        });
        showNotification({
          title: 'Project Evaluation Completed',
          message: `Score: ${res.result.overallScore}%. Skill boosted by +${res.result.skillsBoosted[0]?.boost}%!`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>PRACTICAL PROJECT LAB & CODE EVALUATOR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            AI Project Lab
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Generate production-grade portfolio projects targeting specific skill gaps. The Project Evaluation Agent grades implementation quality.
          </p>
        </div>

        {/* Skill Generator Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-text-secondary hidden sm:inline">Target Skill:</span>
          <select
            value={selectedSkill}
            onChange={(e) => handleGenerateProject(e.target.value)}
            className="bg-card border border-border text-xs text-text-primary px-3 py-2 rounded-lg font-mono outline-none focus:border-neon-green cursor-pointer"
          >
            {skills.map(s => (
              <option key={s.name} value={s.name}>{s.name} ({s.proficiencyLevel}%)</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Project Spec Card */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
              <span className="text-xs font-mono text-neon-cyan uppercase">
                DIFFICULTY: {projectSpec.difficulty}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/30 text-neon-green">
                Auto-Generated for {selectedSkill}
              </span>
            </div>

            <h3 className="text-lg font-bold font-heading text-text-primary mb-2">
              {projectSpec.title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              {projectSpec.description}
            </p>

            <div className="bg-background-secondary border border-border rounded-xl p-4 mb-4">
              <div className="text-[11px] font-mono text-text-secondary uppercase mb-2">
                Requirements & Evaluation Criteria:
              </div>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                {projectSpec.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <label className="text-xs font-mono text-text-secondary block mb-1.5 uppercase">
                GitHub Repository URL (Optional):
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-background-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-primary outline-none focus:border-neon-green"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 text-xs text-text-secondary">
            Verified projects are automatically added to your <span className="text-text-primary font-semibold">Career Twin portfolio</span> with AST verification.
          </div>
        </div>

        {/* Code Editor & Submission */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-neon-green" />
                <span className="text-xs font-mono text-text-primary font-semibold">
                  index.js (Source Implementation)
                </span>
              </div>
              <span className="text-xs font-mono text-text-secondary">
                Paste or edit code directly
              </span>
            </div>

            <textarea
              rows={13}
              value={submittedCode}
              onChange={(e) => setSubmittedCode(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-border rounded-xl p-4 font-mono text-xs text-neon-green/90 leading-relaxed outline-none focus:border-neon-cyan"
              spellCheck={false}
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-secondary font-mono">
              Evaluated on Correctness, Architecture & Best Practices
            </span>
            <button
              disabled={isEvaluating || !submittedCode.trim()}
              onClick={handleEvaluate}
              className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-6 py-2.5 rounded-lg shadow-neon-green flex items-center space-x-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEvaluating ? 'Agents Evaluating Code...' : 'Submit to Project Agent'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evalResult && (
        <div className="bg-card border border-neon-green/40 rounded-2xl p-6 shadow-neon-green/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-border/80 gap-4 mb-6">
            <div>
              <div className="text-xs font-mono text-neon-green uppercase mb-1">
                EVALUATION REPORT FROM PROJECT AGENT
              </div>
              <h3 className="text-xl font-bold font-heading text-text-primary">
                Overall Score: {evalResult.overallScore}% (PASSED)
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {evalResult.feedback}
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-neon-green/10 border border-neon-green/30 px-4 py-2 rounded-xl text-xs font-mono text-neon-green">
              <Award className="w-5 h-5" />
              <div>
                <div>Skill Proficiency Boosted:</div>
                <div className="font-bold text-sm">
                  {evalResult.skillsBoosted[0]?.skill} (+{evalResult.skillsBoosted[0]?.boost}%) → {evalResult.skillsBoosted[0]?.newProficiency}%
                </div>
              </div>
            </div>
          </div>

          {/* 4 Rubric Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background-secondary p-3.5 rounded-xl border border-border">
              <div className="text-[10px] font-mono text-text-secondary uppercase">Correctness</div>
              <div className="text-xl font-bold font-mono text-neon-green mt-1">
                {evalResult.correctnessScore}%
              </div>
            </div>
            <div className="bg-background-secondary p-3.5 rounded-xl border border-border">
              <div className="text-[10px] font-mono text-text-secondary uppercase">Architecture</div>
              <div className="text-xl font-bold font-mono text-neon-cyan mt-1">
                {evalResult.architectureScore}%
              </div>
            </div>
            <div className="bg-background-secondary p-3.5 rounded-xl border border-border">
              <div className="text-[10px] font-mono text-text-secondary uppercase">Best Practices</div>
              <div className="text-xl font-bold font-mono text-neon-purple mt-1">
                {evalResult.bestPracticesScore}%
              </div>
            </div>
            <div className="bg-background-secondary p-3.5 rounded-xl border border-border">
              <div className="text-[10px] font-mono text-text-secondary uppercase">Error Handling</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                {evalResult.errorHandlingScore}%
              </div>
            </div>
          </div>

          {/* Actionable Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-background-secondary p-4 rounded-xl border border-border">
              <div className="font-semibold text-neon-green mb-2">Key Strengths Identified:</div>
              <ul className="space-y-1 list-disc list-inside text-text-secondary">
                {evalResult.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-background-secondary p-4 rounded-xl border border-border">
              <div className="font-semibold text-neon-cyan mb-2">Actionable Improvements:</div>
              <ul className="space-y-1 list-disc list-inside text-text-secondary">
                {evalResult.actionableImprovements.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


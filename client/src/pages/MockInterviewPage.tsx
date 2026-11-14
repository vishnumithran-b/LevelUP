import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  Mic, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Award, 
  Bot, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MockInterviewPage: React.FC = () => {
  const { profile } = useApp();

  const [role, setRole] = useState(profile?.currentCareerGoal?.targetRole || 'Full Stack Developer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral'>('technical');

  const questions = [
    {
      id: 'q1',
      question: 'Can you explain the JavaScript Event Loop, and contrast the Microtask queue with the Macrotask queue with an example of Promise resolution?',
      idealPoints: ['Single-threaded call stack', 'Microtasks execute before next macrotask', 'Promise.then vs setTimeout', 'Starvation risks']
    },
    {
      id: 'q2',
      question: 'How do you structure database transactions in a REST API to ensure ACID consistency when multiple related records are inserted simultaneously?',
      idealPoints: ['BEGIN/COMMIT/ROLLBACK', 'Foreign key dependencies', 'Error handling and connection rollback', 'Isolation levels']
    },
    {
      id: 'q3',
      question: 'Describe a scenario where useEffect caused an infinite re-render loop in React, and how you diagnosed and resolved the dependency array.',
      idealPoints: ['Referential equality of objects/functions', 'useCallback / useMemo', 'Functional state updater', 'Linter exhaustive-deps']
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const currentQ = questions[currentIdx];

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.evaluateInterview({
        role,
        question: currentQ.question,
        answer: answerText,
      });

      if (res.success) {
        setEvaluation(res.evaluation);
        if (res.evaluation.overallScore >= 75) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#B7FF5A', '#42D9F5'],
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluation(null);
    setAnswerText('');
    setCurrentIdx(prev => (prev + 1) % questions.length);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <Mic className="w-4 h-4" />
            <span>AI MOCK INTERVIEW SIMULATOR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Technical Interview Lab
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Simulate real interview questions with automated AI evaluation across technical depth, conceptual accuracy, and communication structure.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-card border border-border text-xs text-text-primary px-3 py-2 rounded-lg font-mono outline-none"
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="AI Engineer">AI Engineer</option>
            <option value="Cloud & DevOps Engineer">Cloud & DevOps</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-card border border-border text-xs text-text-primary px-3 py-2 rounded-lg font-mono outline-none"
          >
            <option value="Junior">Junior</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Senior">Senior</option>
          </select>

          <div className="flex bg-background-secondary p-1 rounded-lg border border-border">
            <button
              onClick={() => setInterviewType('technical')}
              className={`px-2.5 py-1 rounded text-xs font-mono ${interviewType === 'technical' ? 'bg-card-elevated text-neon-green' : 'text-text-secondary'}`}
            >
              Technical
            </button>
            <button
              onClick={() => setInterviewType('behavioral')}
              className={`px-2.5 py-1 rounded text-xs font-mono ${interviewType === 'behavioral' ? 'bg-card-elevated text-neon-green' : 'text-text-secondary'}`}
            >
              Behavioral
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Question & Answer Box */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
              <span className="text-xs font-mono text-neon-cyan uppercase">
                QUESTION {currentIdx + 1} OF {questions.length} • {interviewType.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-text-secondary">
                {role}
              </span>
            </div>

            <div className="bg-background-secondary border border-border rounded-xl p-5 mb-5">
              <p className="text-sm md:text-base font-medium text-text-primary leading-relaxed">
                "{currentQ.question}"
              </p>
            </div>

            <div>
              <label className="text-xs font-mono text-text-secondary block mb-1.5 uppercase">
                Your Spoken / Written Response:
              </label>
              <textarea
                rows={9}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your structured answer here. Include concrete mechanisms, trade-offs, and examples..."
                className="w-full bg-[#0B0B0D] border border-border rounded-xl p-4 text-xs font-mono text-text-primary outline-none focus:border-neon-cyan leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              onClick={handleNextQuestion}
              className="text-xs font-mono text-text-secondary hover:text-text-primary"
            >
              Skip to Next Question →
            </button>

            <button
              disabled={!answerText.trim() || isSubmitting}
              onClick={handleSubmitAnswer}
              className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-6 py-2.5 rounded-lg shadow-neon-green flex items-center space-x-2 disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating Answer...' : 'Submit Answer for AI Review'}</span>
            </button>
          </div>
        </div>

        {/* Evaluation Output */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          {evaluation ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <span className="text-xs font-mono text-neon-green uppercase">
                  AI EVALUATION SUMMARY
                </span>
                <span className="text-sm font-bold font-mono text-text-primary">
                  Score: {evaluation.overallScore}%
                </span>
              </div>

              {/* Score Dimensions */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-background-secondary p-3 rounded-lg border border-border text-center">
                  <div className="text-[10px] font-mono text-text-secondary uppercase">Accuracy</div>
                  <div className="text-base font-bold font-mono text-neon-green mt-0.5">{evaluation.technicalAccuracy}%</div>
                </div>
                <div className="bg-background-secondary p-3 rounded-lg border border-border text-center">
                  <div className="text-[10px] font-mono text-text-secondary uppercase">Clarity</div>
                  <div className="text-base font-bold font-mono text-neon-cyan mt-0.5">{evaluation.clarityAndStructure}%</div>
                </div>
                <div className="bg-background-secondary p-3 rounded-lg border border-border text-center">
                  <div className="text-[10px] font-mono text-text-secondary uppercase">Depth</div>
                  <div className="text-base font-bold font-mono text-neon-purple mt-0.5">{evaluation.depthOfUnderstanding}%</div>
                </div>
              </div>

              <div className="bg-background-secondary border border-border rounded-xl p-4 text-xs text-text-secondary leading-relaxed mb-4">
                <div className="font-semibold text-text-primary mb-1">Feedback:</div>
                <p>{evaluation.feedback}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono text-neon-green text-[11px] uppercase block mb-1">Key Strengths:</span>
                  <ul className="list-disc list-inside text-text-secondary space-y-1">
                    {evaluation.keyStrengths?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-mono text-neon-cyan text-[11px] uppercase block mb-1">Areas to Elevate:</span>
                  <ul className="list-disc list-inside text-text-secondary space-y-1">
                    {evaluation.missingPoints?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-secondary">
              <Bot className="w-12 h-12 text-border mb-3" />
              <h4 className="text-sm font-semibold text-text-primary font-heading">
                Awaiting Answer Submission
              </h4>
              <p className="text-xs text-text-secondary mt-1 max-w-xs">
                Submit your response to receive structured scoring on technical depth, terminology, and communication structure.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-border/60 text-xs text-text-secondary flex items-center justify-between">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <button
              onClick={handleNextQuestion}
              className="text-neon-cyan hover:underline font-mono"
            >
              Next Question →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


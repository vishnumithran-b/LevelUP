import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Sparkles, ArrowRight, BrainCircuit, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentModalProps {
  onClose: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({ onClose }) => {
  const { roadmap, refreshData, showNotification } = useApp();
  
  // Find module 2 quiz
  const targetModule = roadmap?.modules.find(m => m.quiz) || roadmap?.modules[1];
  const quiz = targetModule?.quiz;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluatingStep, setEvaluatingStep] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);

  if (!quiz) {
    return null;
  }

  const currentQ = quiz.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;
  const allAnswered = Object.keys(selectedAnswers).length === quiz.questions.length;

  const handleSelectAnswer = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setEvaluatingStep('Performance Evaluation Agent: Scoring quiz answers...');

    let correctCount = 0;
    const answerPayload = quiz.questions.map((q, idx) => {
      const selected = selectedAnswers[idx];
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex: selected,
        isCorrect,
        conceptTag: q.conceptTag,
      };
    });

    const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);

    try {
      setTimeout(() => {
        setEvaluatingStep('Performance Evaluation Agent: Analyzing concept dependencies...');
      }, 700);

      setTimeout(() => {
        setEvaluatingStep('Learning Path Architect Agent: Recalculating roadmap schedule...');
      }, 1400);

      const res = await api.submitAssessment({
        moduleId: targetModule.id,
        score: scorePercentage,
        totalQuestions: quiz.questions.length,
        answers: answerPayload,
      });

      if (res.success) {
        setResult(res.result);
        await refreshData();

        if (scorePercentage >= 75) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#B7FF5A', '#42D9F5', '#A78BFA'],
          });
        }

        showNotification({
          title: 'Roadmap Adapted by AI Agents',
          message: res.result.adaptationNotes,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="liquid-glass-elevated rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden glass-reflection border border-accent/30"
      >
        {/* Top Specular Sheen */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-text-secondary hover:text-text-primary p-2 rounded-xl liquid-glass-pill transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!result ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-xs font-mono text-neon-cyan mb-1.5">
                <BrainCircuit className="w-4 h-4" />
                <span>ADAPTIVE ASSESSMENT — {targetModule.targetSkill}</span>
              </div>
              <h2 className="text-xl font-bold font-heading text-text-primary">
                {quiz.title}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Your performance directly guides the Learning Path Architect Agent to adapt your upcoming curriculum.
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center justify-between text-xs text-text-secondary font-mono mb-2">
              <span>Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
              <span>Pass threshold: {quiz.passingScore}%</span>
            </div>
            <div className="w-full bg-background-secondary h-1.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-neon-cyan h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-background-secondary border border-border/80 rounded-xl p-5 mb-6">
              <div className="text-xs font-mono text-text-secondary mb-2 uppercase">
                CONCEPT: {currentQ.conceptTag}
              </div>
              <p className="text-sm md:text-base font-medium text-text-primary whitespace-pre-wrap leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-card-elevated border-neon-cyan text-text-primary shadow-neon-cyan'
                        : 'bg-background-secondary/60 border-border hover:border-text-secondary/50 text-text-secondary'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-neon-cyan bg-neon-cyan/20' : 'border-border'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                className="text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none px-4 py-2"
              >
                Previous
              </button>

              <div className="flex items-center space-x-3">
                {!isLastQuestion ? (
                  <button
                    disabled={selectedAnswers[currentQuestionIdx] === undefined}
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="bg-card-elevated hover:bg-border text-text-primary text-xs font-medium px-5 py-2.5 rounded-lg border border-border flex items-center space-x-1.5 disabled:opacity-40"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={!allAnswered || isSubmitting}
                    onClick={handleSubmit}
                    className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-6 py-2.5 rounded-lg shadow-neon-green flex items-center space-x-2 disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Agents Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Submit & Trigger Adaptive Loop</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Live Agent Stream ticker while submitting */}
            {isSubmitting && (
              <div className="mt-4 p-3 bg-[#0B0B0D] border border-neon-cyan/30 rounded-lg flex items-center space-x-3 text-xs font-mono text-neon-cyan animate-pulse">
                <BrainCircuit className="w-4 h-4 shrink-0" />
                <span>{evaluatingStep}</span>
              </div>
            )}
          </div>
        ) : (
          /* Result & Adaptive Adaptation Summary */
          <div>
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 bg-neon-green/10 border border-neon-green/30 text-neon-green">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="text-xs font-mono text-neon-cyan uppercase tracking-wider mb-1">
                EVALUATION COMPLETED BY PERFORMANCE & LEARNING PATH AGENTS
              </div>

              <h2 className="text-2xl font-bold font-heading text-text-primary">
                Score: {result.score}%
              </h2>

              <p className="text-xs text-text-secondary mt-1">
                {result.score >= 75 ? 'Assessment Passed! Competency verified.' : 'Assessment Completed. Adaptive measures deployed.'}
              </p>
            </div>

            {/* Adaptation Card */}
            <div className="bg-background-secondary border border-border rounded-xl p-5 my-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-2">
                <Sparkles className="w-4 h-4" />
                <span>AUTOMATIC ROADMAP ADAPTATION REPORT</span>
              </div>
              <p className="text-xs text-text-primary leading-relaxed">
                {result.adaptationNotes}
              </p>

              {result.weakConcepts?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <span className="text-[11px] font-mono text-text-secondary uppercase">
                    Target Concepts Flagged for Review:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {result.weakConcepts.map((wc: string, i: number) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-mono">
                        {wc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Mentor Guidance Message */}
            <div className="bg-card-elevated border border-border/80 rounded-xl p-4 text-xs text-text-secondary leading-relaxed">
              <div className="font-semibold text-text-primary mb-1">AI Mentor Message:</div>
              <div>{result.mentorMessage}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="bg-neon-cyan hover:bg-neon-cyan/90 text-background font-semibold text-xs px-5 py-2.5 rounded-lg shadow-neon-cyan"
              >
                View Adapted Roadmap
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};


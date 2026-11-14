import React from 'react';
import { motion } from 'framer-motion';

export interface SkillScoreItem {
  id: string;
  name: string;
  score: number;
  status: 'CRITICAL' | 'WEAKNESS' | 'IMPROVEMENTS' | 'STRENGTH';
}

export const SkillScoresList: React.FC = () => {
  const scores: SkillScoreItem[] = [
    { id: '1', name: 'Communication', score: 44, status: 'CRITICAL' },
    { id: '2', name: 'Leadership', score: 56, status: 'WEAKNESS' },
    { id: '3', name: 'Problem Solving', score: 62, status: 'WEAKNESS' },
    { id: '4', name: 'Technical', score: 75, status: 'IMPROVEMENTS' },
    { id: '5', name: 'Creativity', score: 55, status: 'WEAKNESS' },
    { id: '6', name: 'Adaptability', score: 62, status: 'WEAKNESS' },
  ];

  const statusConfig = {
    CRITICAL: {
      color: '#42D9F5', // Cyan
      badgeClass: 'text-neon-cyan',
      barColor: '#42D9F5',
    },
    WEAKNESS: {
      color: '#A78BFA', // Purple
      badgeClass: 'text-neon-purple',
      barColor: '#A78BFA',
    },
    IMPROVEMENTS: {
      color: '#B7FF5A', // Neon Green
      badgeClass: 'text-neon-green',
      barColor: '#B7FF5A',
    },
    STRENGTH: {
      color: '#B7FF5A',
      badgeClass: 'text-neon-green',
      barColor: '#B7FF5A',
    },
  };

  return (
    <div className="liquid-glass-card rounded-2xl p-6 glass-reflection">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/60">
        <h3 className="text-base font-semibold text-text-primary tracking-wide font-heading">
          Skill Scores
        </h3>
        <span className="text-xs text-text-secondary font-mono">
          Based on all completed telemetry sessions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {scores.map((item, idx) => {
          const config = statusConfig[item.status];
          return (
            <div key={item.id} className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-text-primary">{item.name}</span>
                <span className="font-mono font-semibold text-text-primary">{item.score}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-background-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: config.barColor }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider pt-0.5">
                <span className={`${config.badgeClass} font-semibold`}>
                  {item.status}
                </span>
                <span className="text-text-secondary">
                  Target: 80
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


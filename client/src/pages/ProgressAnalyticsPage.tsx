import React from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award, 
  Flame, 
  Sparkles,
  Calendar
} from 'lucide-react';

export const ProgressAnalyticsPage: React.FC = () => {
  const { profile, skills, roadmap } = useApp();

  // Readiness trajectory data
  const readinessHistory = [
    { week: 'Week 1', score: 25 },
    { week: 'Week 2', score: 32 },
    { week: 'Week 3', score: 40 },
    { week: 'Week 4', score: 48 },
    { week: 'Week 5', score: 54 },
    { week: 'Current', score: profile?.currentCareerGoal?.readinessScore ?? 59 },
  ];

  // Weekly study hours data
  const weeklyHoursData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 2.2 },
    { day: 'Thu', hours: 3.0 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 2.0 },
  ];

  // Assessment score distribution
  const assessmentHistory = [
    { assessment: 'HTML5 Semantics', score: 85 },
    { assessment: 'CSS Flexbox Layouts', score: 68 },
    { assessment: 'SQL Multi-table Joins', score: 78 },
    { assessment: 'JS Asynchronous Execution', score: 75 },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>LONGITUDINAL TELEMETRY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Progress & Performance Analytics
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Comprehensive telemetry on career readiness velocity, weekly study consistency, and assessment score trajectories.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-text-secondary bg-background-secondary border border-border px-3.5 py-2 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-neon-cyan mr-1" />
          <span>PAST 30 DAYS TELEMETRY</span>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-mono text-text-secondary uppercase">Readiness Velocity</div>
          <div className="text-2xl font-bold font-mono text-neon-green mt-1 flex items-center">
            <span>+{readinessHistory[readinessHistory.length - 1].score - readinessHistory[0].score}%</span>
            <TrendingUp className="w-4 h-4 ml-2" />
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">Across 5 learning weeks</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-mono text-text-secondary uppercase">Average Assessment</div>
          <div className="text-2xl font-bold font-mono text-neon-cyan mt-1">
            76.5%
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">Above pass threshold (75%)</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-mono text-text-secondary uppercase">Study Hours Logged</div>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">
            {profile?.totalHoursLearned || 48}h
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">17.0h this past week</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-mono text-text-secondary uppercase">Streak Consistency</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 flex items-center">
            <span>{profile?.learningStreakDays || 14} Days</span>
            <Flame className="w-4 h-4 ml-1.5" />
          </div>
          <div className="text-[11px] text-neon-green mt-0.5">100% adherence to schedule</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Readiness Trend Chart */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-6">
            <h3 className="text-base font-semibold text-text-primary font-heading">
              Career Readiness Score Trend
            </h3>
            <span className="text-xs font-mono text-neon-green">
              CURRENT: {profile?.currentCareerGoal?.readinessScore ?? 59}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readinessHistory}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B7FF5A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#B7FF5A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#292930" />
                <XAxis dataKey="week" stroke="#92929D" tick={{ fill: '#92929D', fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#92929D" tick={{ fill: '#92929D', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181D', borderColor: '#292930', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#B7FF5A' }}
                />
                <Area type="monotone" dataKey="score" stroke="#B7FF5A" strokeWidth={2} fillOpacity={1} fill="url(#readinessGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Hours Bar Chart */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-6">
            <h3 className="text-base font-semibold text-text-primary font-heading">
              Weekly Learning Activity
            </h3>
            <span className="text-xs font-mono text-neon-cyan">HOURS / DAY</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292930" />
                <XAxis dataKey="day" stroke="#92929D" tick={{ fill: '#92929D', fontSize: 11 }} />
                <YAxis stroke="#92929D" tick={{ fill: '#92929D', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181D', borderColor: '#292930', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#42D9F5' }}
                />
                <Bar dataKey="hours" fill="#42D9F5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
          <h3 className="text-base font-semibold text-text-primary font-heading">
            Assessment & Diagnostic Scores
          </h3>
          <span className="text-xs font-mono text-text-secondary">AUDITED BY PERFORMANCE EVALUATION AGENT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-text-secondary font-mono uppercase">
                <th className="pb-3">Assessment Module</th>
                <th className="pb-3">Target Skill</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Roadmap Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-text-secondary">
              <tr>
                <td className="py-3 font-medium text-text-primary">HTML5 Semantic Structure & a11y</td>
                <td className="py-3 font-mono">HTML5</td>
                <td className="py-3 font-mono font-bold text-neon-green">85%</td>
                <td className="py-3"><span className="text-neon-green bg-neon-green/10 px-2 py-0.5 rounded font-mono">Passed</span></td>
                <td className="py-3 text-[11px]">Accelerated to CSS Grid phase</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-text-primary">CSS Flexbox & 2D Alignment</td>
                <td className="py-3 font-mono">CSS3</td>
                <td className="py-3 font-mono font-bold text-neon-purple">68%</td>
                <td className="py-3"><span className="text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded font-mono">Targeted Practice</span></td>
                <td className="py-3 text-[11px]">Added +4h flexbox retry exercises</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-text-primary">Relational SQL Normalization & Joins</td>
                <td className="py-3 font-mono">SQL</td>
                <td className="py-3 font-mono font-bold text-neon-green">78%</td>
                <td className="py-3"><span className="text-neon-green bg-neon-green/10 px-2 py-0.5 rounded font-mono">Passed</span></td>
                <td className="py-3 text-[11px]">Verified on Career Twin</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-text-primary">JavaScript Asynchronous Event Loop</td>
                <td className="py-3 font-mono">JavaScript (ES6+)</td>
                <td className="py-3 font-mono font-bold text-neon-green">75%</td>
                <td className="py-3"><span className="text-neon-green bg-neon-green/10 px-2 py-0.5 rounded font-mono">Passed</span></td>
                <td className="py-3 text-[11px]">Unlocked Phase 3: React 18</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


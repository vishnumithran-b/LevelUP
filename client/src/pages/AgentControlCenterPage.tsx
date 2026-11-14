import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { AgentDescriptor } from '../types.js';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Activity, 
  Eye, 
  Layers, 
  BrainCircuit, 
  X,
  Clock,
  Radio
} from 'lucide-react';

export const AgentControlCenterPage: React.FC = () => {
  const { agents, agentEvents, refreshData, showNotification } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<AgentDescriptor | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleRunPipeline = async () => {
    setIsTriggering(true);
    try {
      const res = await api.runAgentPipeline('full_onboarding_audit');
      if (res.success) {
        await refreshData();
        showNotification({
          title: 'Agent Pipeline Executed',
          message: 'All 8 autonomous agents executed their diagnostic steps.',
          type: 'success',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1">
            <Radio className="w-4 h-4 text-neon-green animate-pulse" />
            <span>AUTONOMOUS AGENT ORCHESTRATION NEXUS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Agent Control Center
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Real-time status, state-graph transitions, telemetry outputs, and execution logs for the 8 specialized AI agents.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            disabled={isTriggering}
            onClick={handleRunPipeline}
            className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-5 py-2.5 rounded-lg shadow-neon-green flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isTriggering ? 'Executing Agents...' : 'Trigger Full Orchestration'}</span>
          </button>
        </div>
      </div>

      {/* Agents Grid (8 Specialized Agents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map((agent) => {
          const isSelected = selectedAgent?.name === agent.name;
          return (
            <div
              key={agent.name}
              className={`bg-card border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-neon-green shadow-neon-green/10 bg-card-elevated'
                  : 'border-border hover:border-text-secondary/50'
              }`}
            >
              <div>
                {/* Status Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      agent.status === 'running' ? 'bg-amber-400 animate-pulse' :
                      agent.status === 'completed' ? 'bg-neon-green' : 'bg-neon-cyan'
                    }`} />
                    <span className="text-[10px] font-mono uppercase text-text-secondary">
                      {agent.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-neon-cyan bg-background-secondary px-2 py-0.5 rounded border border-border">
                    {agent.tasksCompleted} Runs
                  </span>
                </div>

                <h3 className="text-sm font-bold text-text-primary font-heading">
                  {agent.name}
                </h3>
                <div className="text-[11px] text-neon-green font-mono mt-0.5">
                  {agent.tagline}
                </div>

                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {agent.role}
                </p>

                {/* Current Activity Box */}
                <div className="mt-4 p-3 bg-background-secondary border border-border/70 rounded-xl">
                  <div className="text-[10px] font-mono text-text-secondary uppercase mb-1 flex items-center justify-between">
                    <span>Current Task:</span>
                    <span className="text-neon-cyan">{agent.lastActivity}</span>
                  </div>
                  <div className="text-xs font-mono text-text-primary truncate">
                    {agent.currentTask || 'Idle — Standing by'}
                  </div>
                </div>
              </div>

              {/* Action: Inspect Output */}
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="text-neon-cyan hover:underline font-mono flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Telemetry</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Event Stream Terminal */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-neon-green" />
            <h3 className="text-base font-semibold text-text-primary font-heading">
              Live Agent Execution Stream (SSE Telemetry)
            </h3>
          </div>
          <span className="text-xs font-mono text-text-secondary">
            STREAMING LIVE EVENTS
          </span>
        </div>

        <div className="bg-[#0B0B0D] border border-border rounded-xl p-4 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
          {agentEvents.map((evt) => (
            <div key={evt.id} className="flex items-start space-x-3 text-text-secondary hover:text-text-primary transition-colors">
              <span className="text-neon-cyan shrink-0">
                [{new Date(evt.timestamp).toLocaleTimeString()}]
              </span>
              <span className="text-neon-green font-semibold shrink-0">
                {evt.agentName}:
              </span>
              <span className="text-text-primary">
                {evt.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Inspector Modal / Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedAgent(null)}
              className="absolute top-5 right-5 text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-background-secondary"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="text-xs font-mono text-neon-green uppercase mb-1">
                TELEMETRY INSPECTION
              </div>
              <h2 className="text-xl font-bold font-heading text-text-primary">
                {selectedAgent.name}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {selectedAgent.role}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-text-secondary uppercase mb-1.5">
                  Last Generated Agent Output:
                </div>
                <div className="bg-[#0B0B0D] border border-border rounded-xl p-4 font-mono text-xs text-neon-green max-h-60 overflow-y-auto">
                  <pre>{JSON.stringify(selectedAgent.lastOutput || { status: 'Telemetry captured, standing by for trigger' }, null, 2)}</pre>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-secondary font-mono pt-3 border-t border-border">
                <span>Completed Runs: {selectedAgent.tasksCompleted}</span>
                <span>Status: {selectedAgent.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { MentorMessage } from '../types.js';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  User, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  Code
} from 'lucide-react';

export const AIMentorPage: React.FC = () => {
  const { profile, roadmap } = useApp();
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await api.getMentorHistory();
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    const userText = msgText;
    setInputText('');
    setMessages(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        sender: 'user',
        content: userText,
        timestamp: new Date().toISOString(),
      }
    ]);
    setIsSending(true);

    try {
      const res = await api.sendMentorMessage(userText);
      if (res.success) {
        setMessages(prev => [...prev.filter(m => !m.id.startsWith('temp-')), res.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    'Explain JavaScript promises simply with an analogy.',
    'Why is JavaScript async important before learning React?',
    'Generate a practice coding challenge for async/await.',
    'What skills am I missing for a Full Stack Developer role?'
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Header */}
      <div className="pb-4 border-b border-border/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-card to-card-elevated border border-neon-cyan/40 flex items-center justify-center text-neon-cyan shadow-neon-cyan/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-heading text-text-primary">
                AI Career Mentor
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/30 text-neon-green">
                Context Loaded
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 font-mono">
              Target: {profile?.currentCareerGoal?.targetRole || 'Full Stack Developer'} • Pacing: {profile?.dailyAvailableHours || 2} hrs/day
            </p>
          </div>
        </div>

        <button
          onClick={loadHistory}
          className="text-xs font-mono text-text-secondary hover:text-text-primary flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Session</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-card-elevated border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-card-elevated border border-neon-cyan/30 text-text-primary rounded-tr-none'
                    : 'bg-card border border-border text-text-primary rounded-tl-none shadow-sm'
                }`}
              >
                <div className="font-mono text-[10px] text-text-secondary uppercase mb-1">
                  {isUser ? 'Alex Chen' : 'LEVELUP AI Mentor'}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action.payload || action.label)}
                        className="text-[11px] font-mono px-3 py-1 rounded-lg bg-background-secondary hover:bg-card-elevated border border-border text-neon-green hover:border-neon-green/40 transition-colors"
                      >
                        {action.label} →
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <img
                  src={profile?.avatarUrl}
                  alt="User"
                  className="w-8 h-8 rounded-lg border border-border object-cover shrink-0 mt-1"
                />
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-3 text-xs text-neon-cyan font-mono animate-pulse">
            <Bot className="w-4 h-4" />
            <span>Mentor synthesizing architectural response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts & Input Box */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 text-xs font-mono text-text-secondary">
          <span className="shrink-0 text-[10px] uppercase text-text-secondary/70">Suggested:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="shrink-0 px-2.5 py-1 rounded-md bg-background-secondary hover:bg-card-elevated border border-border hover:border-neon-cyan/40 text-text-secondary hover:text-text-primary transition-colors text-[11px]"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Ask your mentor (e.g. 'Explain why my Promise was rejected')..."
            className="flex-1 bg-background-secondary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:border-neon-green outline-none"
          />
          <button
            disabled={!inputText.trim() || isSending}
            onClick={() => handleSendMessage(inputText)}
            className="bg-neon-green hover:bg-neon-green/90 text-background font-semibold text-xs px-5 py-3 rounded-xl disabled:opacity-40 transition-all flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};


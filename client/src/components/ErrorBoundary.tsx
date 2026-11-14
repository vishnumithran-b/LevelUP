import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LEVELUP UI Caught Unhandled Error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-6 text-white font-sans selection:bg-[#B7FF5A]/20">
          <div className="max-w-md w-full bg-[#18181D] border border-[#292930] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B7FF5A]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-xl bg-[#202027] border border-[#A78BFA]/40 flex items-center justify-center text-[#A78BFA] mb-5">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h1 className="text-xl font-bold font-heading text-[#F5F5F7] mb-2">
              LEVELUP Resilient Recovery
            </h1>
            <p className="text-xs text-[#92929D] leading-relaxed mb-4">
              An unexpected render anomaly was safely isolated by the platform boundary. Your progress and credentials remain secure.
            </p>

            {this.state.error && (
              <div className="bg-[#111114] border border-[#292930] rounded-lg p-3 mb-6 text-[11px] font-mono text-[#42D9F5] break-all max-h-24 overflow-y-auto">
                {this.state.error.message || 'Unknown render exception'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#B7FF5A] text-[#0B0B0D] font-semibold text-xs hover:bg-[#a8f247] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>

              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#202027] border border-[#292930] text-[#F5F5F7] font-medium text-xs hover:border-[#92929D] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


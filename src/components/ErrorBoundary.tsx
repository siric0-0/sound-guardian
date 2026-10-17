import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
  onReturnToStories?: () => void;
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
    console.error('Sound Guardian ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg p-6 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-base text-[#002D72]">
                {this.props.fallbackTitle || 'Something went wrong on this screen'}
              </h3>
              <p className="text-xs text-[#5B6B7A] leading-relaxed">
                Sound Guardian encountered an unexpected display issue. No data or funds are at risk.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              {this.props.onReturnToStories && (
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.onReturnToStories?.();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#F4F8FA] hover:bg-[#E1F0F8] border border-[#D0D9E2] text-[#002D72] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Stories</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

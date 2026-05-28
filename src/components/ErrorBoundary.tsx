import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-signal-red mx-auto mb-4" />
            <h1 className="text-xl font-bold text-text-primary mb-2">Something went wrong</h1>
            <p className="text-sm text-text-muted mb-6">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'sans-serif',
          maxWidth: '600px',
          margin: '0 auto',
          marginTop: '100px'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>Something went wrong</h1>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            The application encountered an error. Please refresh the page or contact support if the problem persists.
          </p>
          {this.state.error && (
            <details style={{ 
              background: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '4px',
              marginTop: '20px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                Error Details
              </summary>
              <pre style={{ 
                overflow: 'auto', 
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#6BAA6F',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


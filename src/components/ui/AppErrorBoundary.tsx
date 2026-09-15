import { Component, type ReactNode } from 'react';
export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="dashboard-shell app-status" role="alert">
          <h1>Something went wrong</h1>
          <p>Please reload your workspace and try again.</p>
          <button className="dialog-primary" onClick={() => window.location.reload()}>
            Reload dashboard
          </button>
        </main>
      );
    return this.props.children;
  }
}

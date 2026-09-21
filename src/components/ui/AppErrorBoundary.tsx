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
          <h1>Ocurrió un problema</h1>
          <p>Recarga tu perfil para volver a intentarlo.</p>
          <button className="dialog-primary" onClick={() => window.location.reload()}>
            Recargar perfil
          </button>
        </main>
      );
    return this.props.children;
  }
}

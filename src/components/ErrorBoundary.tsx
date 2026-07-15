import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('App error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-transparent px-4">
          <div className="max-w-lg rounded-3xl border border-[#E8A5A5]/30 bg-white p-8 text-center shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">Art de Table</p>
            <h1 className="mt-3 font-serif text-2xl font-bold text-[#2D2D2D]">Un composant a rencontré une erreur</h1>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              La page a été protégée pour éviter un écran blanc. Recharge la page ou corrige l’erreur indiquée ci-dessous ou dans la console.
            </p>
            {this.state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left text-xs text-red-700 font-mono overflow-auto max-h-40">
                <strong>Détail de l'erreur :</strong><br />
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

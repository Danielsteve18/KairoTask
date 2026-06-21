"use client";

import { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border"
          style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#EF444418" }}>
            <AlertCircle className="w-6 h-6" style={{ color: "#EF4444" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
              Algo salió mal
            </p>
            <p className="text-xs font-mono mt-1 max-w-md" style={{ color: "var(--dash-text-muted)" }}>
              {this.state.error?.message ?? "Error inesperado"}
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono transition-all hover:bg-white/5"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

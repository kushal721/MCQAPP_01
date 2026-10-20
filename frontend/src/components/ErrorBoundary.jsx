import React from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { reportClientError } from "../api";

// Catches render errors so a bug shows a message instead of a blank page.
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("UI crashed:", error, info.componentStack);
    reportClientError(error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card w-full max-w-md p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-extrabold text-slate-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-500">
            This page hit an unexpected error. Reloading usually fixes it.
          </p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-xl bg-slate-100 p-3 text-left text-xs text-slate-600">
            {String(error?.message || error)}
          </pre>
          <div className="mt-6 flex justify-center gap-2">
            <button className="btn-primary" onClick={() => window.location.reload()}>
              <RotateCcw className="h-4 w-4" /> Reload
            </button>
            <a href="/" className="btn-secondary">
              <Home className="h-4 w-4" /> Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

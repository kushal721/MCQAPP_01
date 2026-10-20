import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="card flex flex-col items-center px-6 py-16 text-center">
    {Icon && (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-6 w-6" />
      </div>
    )}
    <h3 className="text-base font-bold text-slate-900">{title}</h3>
    {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="card flex flex-col items-center px-6 py-14 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
      <AlertTriangle className="h-6 w-6" />
    </div>
    <h3 className="text-base font-bold text-slate-900">Couldn't load this page</h3>
    <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    {onRetry && (
      <button className="btn-secondary mt-6" onClick={onRetry}>
        <RotateCcw className="h-4 w-4" /> Try again
      </button>
    )}
  </div>
);

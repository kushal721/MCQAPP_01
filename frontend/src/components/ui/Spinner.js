import React from "react";
import { Loader2 } from "lucide-react";

const Spinner = ({ className = "h-5 w-5" }) => (
  <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />
);

export const PageLoader = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
    <Spinner className="h-7 w-7 text-brand-600" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default Spinner;

import React from "react";

const ProgressBar = ({ value, max, className = "" }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;

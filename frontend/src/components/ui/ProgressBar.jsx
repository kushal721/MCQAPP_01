import React from "react";

const ProgressBar = ({ value, max, className = "" }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-paper-sunk ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-marigold-500 transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;

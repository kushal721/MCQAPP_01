import React from "react";
import { Link } from "react-router-dom";

// The mark is a filled answer bubble, as on an OMR exam sheet.
export const LogoMark = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="8" className="fill-ink" />
    <circle cx="16" cy="16" r="7" className="fill-marigold-300" />
  </svg>
);

const Logo = ({ to = "/", suffix }) => (
  <Link to={to} className="flex items-center gap-2.5">
    <LogoMark />
    <span className="font-display text-lg font-bold tracking-tight text-ink">
      MCQ Prep
    </span>
    {suffix && <span className="badge bg-paper-sunk text-ink-500">{suffix}</span>}
  </Link>
);

export default Logo;

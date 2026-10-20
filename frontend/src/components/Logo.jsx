import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Logo = ({ to = "/", suffix }) => (
  <Link to={to} className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md shadow-brand-600/25">
      <GraduationCap className="h-5 w-5" />
    </span>
    <span className="text-lg font-extrabold tracking-tight text-slate-900">
      MCQ<span className="text-brand-600">Prep</span>
    </span>
    {suffix && (
      <span className="badge bg-slate-100 text-slate-600">{suffix}</span>
    )}
  </Link>
);

export default Logo;

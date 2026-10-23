import React from "react";
import { Loader } from "../icons";

const Spinner = ({ className = "h-5 w-5" }) => <Loader className={className} />;

export const PageLoader = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-500">
    <Spinner className="h-7 w-7 text-ink" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default Spinner;

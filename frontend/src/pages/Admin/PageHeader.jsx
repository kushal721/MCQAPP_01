import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "../../components/icons";

// crumbs: [{ label, to }]; the last one is the current page.
const PageHeader = ({ crumbs = [], title, subtitle, actions }) => (
  <div className="mb-8">
    {crumbs.length > 0 && (
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-sm text-ink-500">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink-400" />}
            {c.to ? (
              <Link to={c.to} className="font-medium hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-ink-700">{c.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  </div>
);

export default PageHeader;

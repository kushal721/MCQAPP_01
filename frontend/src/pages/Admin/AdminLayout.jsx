import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ExternalLink,
  LayoutDashboard,
  Library,
  LogOut,
  PlusCircle,
} from "lucide-react";
import Logo from "../../components/Logo";
import { useAuth } from "../../lib/auth";
import { initials } from "../../lib/palette";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/courses", label: "Courses", icon: Library },
  { to: "/admin/questions/new", label: "Add question", icon: PlusCircle },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { admin, logout } = useAuth();
  // Block body on purpose: newer browsers return a Promise from scrollTo, and
  // React would treat a returned value as the effect's cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
        <div className="px-2">
          <Logo to="/admin" suffix="Admin" />
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <Link to="/" className="btn-secondary w-full">
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initials(admin?.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{admin?.name}</p>
              <p className="truncate text-xs text-slate-500">{admin?.email}</p>
            </div>
            <button onClick={logout} className="icon-btn" title="Sign out" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo to="/admin" suffix="Admin" />
          <div className="flex items-center">
            <Link to="/" className="icon-btn" aria-label="View site">
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button onClick={logout} className="icon-btn" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

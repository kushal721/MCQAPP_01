import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import Logo from "./Logo";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
  }`;

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <Link to="/#courses" className={navClass({ isActive: false })}>
            Courses
          </Link>
          <Link to="/admin" className="btn-secondary ml-3 py-2">
            <LayoutDashboard className="h-4 w-4" /> Admin
          </Link>
        </nav>

        <button
          className="icon-btn md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="container-page flex flex-col gap-1 border-t border-slate-100 py-3 md:hidden">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <Link to="/#courses" className={navClass({ isActive: false })}>
            Courses
          </Link>
          <Link to="/admin" className={navClass({ isActive: false })}>
            Admin panel
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;

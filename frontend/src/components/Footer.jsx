import React from "react";
import Logo from "./Logo";

const Footer = () => (
  <footer className="mt-auto border-t border-slate-200 bg-white">
    <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
      <Logo />
      <p className="text-sm text-slate-500">
        Practice smarter, one question at a time. © {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;

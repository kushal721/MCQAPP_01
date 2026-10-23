import React from "react";
import Logo from "./Logo";

const Footer = () => (
  <footer className="mt-auto border-t border-line">
    <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
      <Logo />
      <p className="text-sm text-ink-500">
        Practice questions for IOE, IOM and Loksewa. © {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;

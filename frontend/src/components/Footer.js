import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black py-6 px-4 md:px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">Quiz App</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="#"
            className="text-sm font-medium text-white hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white hover:underline"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="#" className="text-white hover:text-blue-300"></Link>
          <Link href="#" className="text-white hover:text-blue-300"></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

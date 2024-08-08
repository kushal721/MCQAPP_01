import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false); // Close the mobile menu after click
    }
  };

  return (
    <header className="bg-black py-6 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">Quiz App</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleScroll("popular-quiz")}
            className="text-lg font-medium text-white hover:underline"
          >
            Quizzes
          </button>
          <button
            onClick={() => handleScroll("quiz-categories")}
            className="text-lg font-medium text-white hover:underline"
          >
            Categories
          </button>
          <Link
            to="/about"
            className="text-lg font-medium text-white hover:underline"
          >
            About
          </Link>
        </nav>
        <div className="md:hidden relative">
          <button
            onClick={toggleMobileMenu}
            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Menu
          </button>
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={() => handleScroll("popular-quiz")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 w-full text-left"
                >
                  Quizzes
                </button>
                <button
                  onClick={() => handleScroll("quiz-categories")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 w-full text-left"
                >
                  Categories
                </button>
                <Link
                  to="/leaderboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
                >
                  Leaderboard
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  About
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

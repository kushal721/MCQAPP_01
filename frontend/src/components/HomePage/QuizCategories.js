import React from "react";
import { Link } from "react-router-dom";

const QuizCategories = () => {
  const path = "/sub-categories";
  const categories = [
    { name: "KU" },
    { name: "IOE" },
    { name: "IOM" },
    { name: "Loksewa Aayog Nepal " },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 md:text-3xl">
          Explore Quiz Categories
        </h2>
        <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={path}
              className="bg-black rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span className="flex text-xl justify-centertext-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuizCategories;

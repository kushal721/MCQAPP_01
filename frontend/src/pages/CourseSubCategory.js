import React from "react";
import { Link } from "react-router-dom";

const CourseSubCategory = () => {
  const subjects = [
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Mathematics" },
    { name: "Computer Science" },
  ];

  return (
    <div className="bg-white min-h-screen py-12 md:py-16 lg:py-20">
      <main className="container mx-auto">
        <div className="space-y-4 text-center md:text-left px-7 ">
          <h1 className="text-3xl font-bold tracking-tighter text-black sm:text-4xl md:text-5xl">
            Institute of Engineering (IOE)
          </h1>
          <p className="text-black">Test yourself subjectwise...</p>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-8 px-8 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <Link
              key={index}
              to="/quiz"
              className="group relative overflow-hidden rounded-lg bg-black text-center text-white transition-all hover:bg-gray-800"
            >
              <div className="flex h-32 items-center justify-center p-4 sm:h-40 ">
                <h2 className="text-xl font-bold">{subject.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CourseSubCategory;

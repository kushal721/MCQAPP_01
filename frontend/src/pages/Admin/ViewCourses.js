import React from "react";
import { Link } from "react-router-dom";

const ViewCourses = () => {
  const courses = [
    { name: "IOE" },
    { name: "IOM" },
    { name: "KU" },
    { name: "Loksewa" },
  ];

  return (
    <div className="bg-white min-h-screen py-12 md:py-16 lg:py-20">
      <main className="container mx-auto">
        <div className="space-y-4 text-center md:text-left px-7 ">
          <h1 className="text-3xl font-bold tracking-tighter text-black sm:text-4xl md:text-5xl">
            All Courses
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-8 px-8 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Link
              key={index}
              to="/viewSubject"
              className="group relative overflow-hidden rounded-lg bg-black text-center text-white transition-all hover:bg-gray-800"
            >
              <div className="flex h-32 items-center justify-center p-4 sm:h-40 ">
                <h2 className="text-xl font-bold">{course.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ViewCourses;

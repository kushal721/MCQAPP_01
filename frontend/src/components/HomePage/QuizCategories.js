import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const QuizCategories = () => {
  const [quizCategory, setQuizCategory] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/course/getAllCourse"
        );
        setQuizCategory(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 md:text-3xl">
          Explore Quiz Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
          {quizCategory.map((category, index) => (
            <Link
              key={index}
              to={`/sub-categories/${category._id}`}
              // to={path}
              className="bg-black rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span className="flex text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white">
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

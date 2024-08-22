import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PopularQuizzes = () => {
  const [popularQuiz, setPopularQuiz] = useState([]);

  useEffect(() => {
    const fetchPopularQuiz = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/course/getAllCourse"
        );
        setPopularQuiz(response.data);
      } catch (error) {
        console.log("Error fetching courses", error);
      }
    };
    fetchPopularQuiz();
  }, []);

  return (
    <section className="bg-gray-100 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 md:text-3xl">Popular Quizzes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {popularQuiz.map((quiz, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
            >
              <div className="text-center">
                <h3 className="text-lg font-bold">{quiz.name}</h3>
                <p className="text-gray-500">{quiz.courseDescription}</p>
              </div>
              <Link to="/quiz">
                <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
                  Take Quiz
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularQuizzes;

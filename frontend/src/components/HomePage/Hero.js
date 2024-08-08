import React from "react";

const Hero = () => {
  const handleStartQuizClick = () => {
    const popularQuizSection = document.getElementById("popular-quiz");
    if (popularQuizSection) {
      popularQuizSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <main className="flex-1">
        <section className="bg-black py-12 md:py-20">
          <div className="container mx-auto flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Test Your Knowledge with Our Quizzes
            </h1>
            <p className="mt-4 max-w-md text-white/80 md:text-lg">
              Explore a wide range of quizzes and challenge yourself to become a
              trivia master.
            </p>
            <button
              onClick={handleStartQuizClick}
              className="mt-6 bg-white text-blue-600 px-4 py-2 rounded"
            >
              Start Quiz
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;

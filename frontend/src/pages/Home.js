import React from "react";
import Header from "../components/Header";
import Hero from "../components/HomePage/Hero";
import PopularQuizes from "../components/HomePage/PopularQuizes";
import QuizCategories from "../components/HomePage/QuizCategories";

const Home = () => {
  return (
    <>
      <div>
        <Hero />
      </div>
      <div id="quiz-categories">
        <QuizCategories />
      </div>
      <div id="popular-quiz">
        <PopularQuizes />
      </div>
    </>
  );
};

export default Home;

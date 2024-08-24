// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const QuizPage = () => {
//   const [selectedOption, setSelectedOption] = useState("");
//   const [questionNumber, setQuestionNumber] = useState(1);
//   const [time, setTime] = useState("58:00");
//   const [quizzes, setQuizzes] = useState([]);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:4000/api/question/getQuestionBySubject/${id}`
//         );
//         setQuizzes(response.data);
//         console.log("QUiz data", response.data);
//       } catch (error) {
//         console.log("Error fetching quizzes", error);
//       }
//     };
//     fetchQuizzes();
//   }, []);

//   const handleOptionChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleNextQuestion = () => {
//     setQuestionNumber(questionNumber + 1);
//     setSelectedOption("");
//   };

//   return (
//     <section className="py-12 md:py-20">
//       <main className="container mx-auto mt-8 px-4">
//         <div className="bg-gray-100 p-6 rounded-lg shadow-md">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
//             <h1 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-0">
//               Institute of Engineering (IOE)
//             </h1>
//             <span className="text-lg lg:text-xl mb-2 lg:mb-0">
//               Time: {time}
//             </span>
//             <button
//               onClick={handleNextQuestion}
//               className="mt-4 lg:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
//             >
//               Next
//             </button>
//           </div>
//           {quizzes.map((quiz, index) => (
//             <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-lg font-medium">
//                   Question: {questionNumber}/10
//                 </span>
//               </div>

//               <div className="mb-4">
//                 <p className="text-lg font-medium">{quiz.question_text}</p>
//                 <div className="mt-2">
//                   <label className="block mb-2">
//                     <input
//                       type="radio"
//                       value="option1"
//                       checked={selectedOption === "option1"}
//                       onChange={handleOptionChange}
//                       className="mr-2"
//                     />
//                     This is option 1
//                   </label>
//                   <label className="block mb-2">
//                     <input
//                       type="radio"
//                       value="option2"
//                       checked={selectedOption === "option2"}
//                       onChange={handleOptionChange}
//                       className="mr-2"
//                     />
//                     this is option 2
//                   </label>
//                   <label className="block mb-2">
//                     <input
//                       type="radio"
//                       value="option3"
//                       checked={selectedOption === "option3"}
//                       onChange={handleOptionChange}
//                       className="mr-2"
//                     />
//                     this is option 3
//                   </label>
//                   <label className="block mb-2">
//                     <input
//                       type="radio"
//                       value="option4"
//                       checked={selectedOption === "option4"}
//                       onChange={handleOptionChange}
//                       className="mr-2"
//                     />
//                     this is option 4
//                   </label>
//                 </div>
//               </div>
//               <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
//                 <p className="text-lg font-medium">Ans: C</p>
//                 <p className="mt-2">
//                   <strong>Explanation:</strong> Because this is the formula of
//                   kinetic energy.
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </section>
//   );
// };

// export default QuizPage;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./QuizPage.css"; // Import a CSS file for custom styles

const QuizPage = () => {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [time, setTime] = useState("58:00");
  const { subject_id, course_id } = useParams(); // Assuming you have both in the URL params

  //Function to fetch question
  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/question/getQuestionBySubject/${subject_id}`
      );
      setQuestion(response.data);
      setSelectedOption(null);
      setIsOptionSelected(false);
      setCorrectAnswer(
        response.data.options.find((option) => option.is_correct)
      );
    } catch (error) {
      console.log("Error fetching question:", error);
    }
  };
  useEffect(() => {
    if (subject_id) {
      fetchQuestion();
    }
  }, [subject_id]);

  //function to record attempted questions
  const recordAttempt = async (isCorrect) => {
    try {
      await axios.post("http://localhost:4000/api/question/attemptedQuestion", {
        quizType: "subjectwise",
        userId: "64c25a2fbd74f0e7358d342b",
        courseId: course_id,
        subjectId: subject_id,
        questionId: question._id,
        isCorrect,
      });
    } catch (error) {
      console.log("Error recording question attempt:", error);
    }
  };

  const handleOptionChange = (event) => {
    if (!isOptionSelected) {
      const selected = event.target.value;
      setSelectedOption(selected);
      setIsOptionSelected(true);
      const isCorrect = selected === correctAnswer.option_text;

      // Call recordAttempt function
      recordAttempt(isCorrect);
    }
  };

  const handleNextQuestion = () => {
    if (isOptionSelected) {
      fetchQuestion();
    } else {
      alert("Please select an option before proceeding to the next question."); // Alert if no option is selected
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  const currentOptions = question.options;

  return (
    <section className="py-12 md:py-20">
      <main className="container mx-auto mt-8 px-4">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-0">
              Subject Name
            </h1>
            <span className="text-lg lg:text-xl mb-2 lg:mb-0">
              Time: {time}
            </span>
            <button
              onClick={handleNextQuestion}
              className="mt-4 lg:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
              disabled={!isOptionSelected}
            >
              Next
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">
                {/* Removed questionNumber reference */}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-lg font-medium">{question.question_text}</p>
              <div className="mt-2">
                {currentOptions.map((option) => (
                  <label
                    key={option._id}
                    className={`block mb-2 option ${
                      isOptionSelected
                        ? option.option_text === correctAnswer.option_text
                          ? "correct"
                          : selectedOption === option.option_text
                          ? "incorrect"
                          : ""
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-option"
                      value={option.option_text}
                      checked={selectedOption === option.option_text}
                      onChange={handleOptionChange}
                      className="mr-2"
                      disabled={isOptionSelected}
                    />
                    {option.option_text}
                  </label>
                ))}
              </div>
            </div>
            {isOptionSelected && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                <p className="text-lg font-medium">
                  Answer: {correctAnswer.option_text}
                </p>
                <p className="mt-2">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default QuizPage;

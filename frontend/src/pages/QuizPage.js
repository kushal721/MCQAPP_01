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

const QuizPage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [time, setTime] = useState("58:00");
  const [quizzes, setQuizzes] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/question/getQuestionBySubject/${id}`
        );
        setQuizzes(response.data);
        console.log("Quiz data", response.data);
      } catch (error) {
        console.log("Error fetching quizzes", error);
      }
    };
    fetchQuizzes();
  }, [id]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    if (questionNumber < quizzes.length) {
      setQuestionNumber(questionNumber + 1);
      setSelectedOption("");
    }
  };

  const currentQuestion = quizzes[questionNumber - 1];

  return (
    <section className="py-12 md:py-20">
      <main className="container mx-auto mt-8 px-4">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-0">
              Institute of Engineering (IOE)
            </h1>
            <span className="text-lg lg:text-xl mb-2 lg:mb-0">
              Time: {time}
            </span>
            <button
              onClick={handleNextQuestion}
              className="mt-4 lg:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700"
            >
              Next
            </button>
          </div>
          {currentQuestion && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">
                  Question: {questionNumber}/{quizzes.length}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-lg font-medium">
                  {currentQuestion.question_text}
                </p>
                <div className="mt-2">
                  {currentQuestion.options.map((option) => (
                    <label key={option._id} className="block mb-2">
                      <input
                        type="radio"
                        name="quiz-option"
                        value={option.option_text}
                        checked={selectedOption === option.option_text}
                        onChange={handleOptionChange}
                        className="mr-2"
                      />
                      {option.option_text}
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                <p className="text-lg font-medium">
                  Answer:{" "}
                  {
                    currentQuestion.options.find((option) => option.is_correct)
                      ?.option_text
                  }
                </p>
                <p className="mt-2">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </section>
  );
};

export default QuizPage;

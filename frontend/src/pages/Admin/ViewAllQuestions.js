import React from "react";

const ViewAllQuestions = () => {
  const questions = [
    {
      id: 1,
      question: "What is the formula for the kinetic energy of an object?",
      options: [
        "This is option 1",
        "This is option 2",
        "This is option 3",
        "This is option 4",
      ],
      answer: "C",
      explanation: "Because this is the formula of kinetic energy.",
    },
    {
      id: 2,
      question: "What is the formula for the kinetic energy of an object?",
      options: [
        "This is option 1",
        "This is option 2",
        "This is option 3",
        "This is option 4",
      ],
      answer: "B",
      explanation: "Because this is the formula of kinetic energy.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">
          All Questions of KU
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-lg p-3 border rounded shadow-sm"
          />
        </div>

        {/* Questions List */}
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white p-6 mb-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">
                {index + 1}. {question.question}
              </h2>
              <div>
                <button className="text-sm text-white bg-black px-3 py-1 rounded-md mr-2">
                  Edit
                </button>
                <button className="text-sm text-white bg-black px-3 py-1 rounded-md">
                  Delete
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="mb-4">
              {question.options.map((option, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    id={`option-${question.id}-${idx}`}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`option-${question.id}-${idx}`}
                    className="text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>

            {/* Answer and Explanation */}
            <div className="border-t pt-4">
              <p className="text-lg font-semibold">Ans: {question.answer}</p>
              <p className="text-sm font-medium text-gray-800">Explanation:</p>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllQuestions;

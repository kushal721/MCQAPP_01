import React from "react";

const AddQuestion = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="w-full max-w-4xl p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add Question
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700"
            >
              Course Name
            </label>
            <select
              id="course"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Course</option>
              <option value="course1">Course 1</option>
              <option value="course2">Course 2</option>
            </select>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject Name
            </label>
            <select
              id="subject"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Subject</option>
              <option value="Subject1">Subject 1</option>
              <option value="Subject2"> Subject 2</option>
            </select>
          </div>

          <div className="col-span-2">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
            <input
              type="text"
              id="question"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Question"
              required
            />
          </div>

          {[1, 2, 3, 4].map((option, index) => (
            <div key={index} className="flex items-center">
              <div className="w-full">
                <label
                  htmlFor={`option${option}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Option {option}
                </label>
                <input
                  type="text"
                  id={`option${option}`}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={`Enter Option ${option}`}
                  required
                />
              </div>
              <div className="ml-3 mt-6">
                <input
                  type="checkbox"
                  id={`correct${option}`}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor={`correct${option}`}
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Correct
                </label>
              </div>
            </div>
          ))}

          <div className="col-span-2">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Explanation
            </label>
            <textarea
              type="text"
              id="subject"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Please enter"
              required
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
            >
              Add Question
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddQuestion;

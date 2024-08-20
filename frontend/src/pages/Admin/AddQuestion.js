import React, { useState, useEffect } from "react";
import axios from "axios";

const AddQuestion = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);
  const [explanation, setExplanation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/course/getAllCourse"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  //get subject by selected course
  useEffect(() => {
    if (selectedCourse) {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/subject/getSubjectByCourse/${selectedCourse}`
          );
          console.log("Subjects response:", response.data);
          setSubjects(response.data.subjects);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };

      fetchSubjects();
    }
  }, [selectedCourse]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages

    try {
      const response = await axios.post(
        "http://localhost:4000/api/question/addQuestion",
        {
          subject_id: selectedSubject,
          question_text: questionText,
          options,
          explanation,
        }
      );

      setMessage("Question added successfully!");

      // Reset form fields

      setQuestionText("");
      setOptions([
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ]);
      setExplanation("");
    } catch (error) {
      console.error("Error adding question:", error);
      setMessage("Error adding question: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="w-full max-w-4xl p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add Question
        </h1>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
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
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCourse && (
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
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
              >
                <option value="">Select Subject</option>
                {Array.isArray(subjects) &&
                  subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

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
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
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
                  value={options[index].option_text}
                  onChange={(e) =>
                    handleOptionChange(index, "option_text", e.target.value)
                  }
                  placeholder={`Enter Option ${option}`}
                  required
                />
              </div>
              <div className="ml-3 mt-6">
                <input
                  type="checkbox"
                  id={`correct${option}`}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={options[index].is_correct}
                  onChange={(e) =>
                    handleOptionChange(index, "is_correct", e.target.checked)
                  }
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
              htmlFor="explanation"
              className="block text-sm font-medium text-gray-700"
            >
              Explanation
            </label>
            <textarea
              id="explanation"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Please enter"
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
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </main>
    </div>
  );
};

export default AddQuestion;

import React, { useState, useEffect } from "react";
import axios from "axios";

const AddSubject = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [loading, setLoading] = useState(true); // Loading state for courses
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/course/getAllCourse"
        );
        setCourses(response.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
        setError("Failed to load courses. Please try again later.");
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const newSubject = {
        name: subjectName,
        courseId: selectedCourse,
      };

      const response = await axios.post(
        "http://localhost:4000/api/subject/addSubject",
        newSubject
      );
      setSuccess("Subject added successfully!");
      setSubjectName(""); // Clear the subject name field
      setSelectedCourse(""); // Clear the selected course
      
    } catch (error) {
      console.error("Error adding subject:", error);
      console.log(
        error.response?.data?.message ||
          "Failed to add subject. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl text-center font-bold text-gray-800">
          Add New Subject
        </h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700"
                >
                  Choose Course
                </label>
                <select
                  id="course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2.5 border"
                  required
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Subject Name"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 text-white bg-black rounded-md hover:bg-slate-800 focus:outline-none"
              >
                Add Subject
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default AddSubject;

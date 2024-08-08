import React from "react";

const AddCourse = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl  text-center font-bold text-gray-800">
          Add New Course
        </h1>
        <form className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Course Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Course Name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              type="text-area "
              id="description"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Course Description"
              required
            />
          </div>
          <button
            type="submit"
            className=" px-4 py-2 text-white bg-black rounded-md hover:bg-slate-800 focus:outline-none "
          >
            Add Course
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddCourse;

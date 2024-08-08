const Course = require("../models/course"); // Import your Course model

// Function to add a new course to the database.
exports.addCourse = async (req, res) => {
  try {
    const { name, courseDescription } = req.body;

    const newCourse = new Course({
      name,
      courseDescription,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!", newCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to get all courses from the database.
exports.getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Funcation to update the course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id; // Extracting the course ID from the request parameters
    const updatedData = req.body; // Getting the updated data from the request body

    // Step 1: Check if there's any data provided for update
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    // Step 2: Find the course by ID and update it with the provided data
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedData,
      {
        new: true, // Return the updated course document
        runValidators: true, // Apply validation rules from the schema
      }
    );

    // Step 3: If no course is found with the given ID, return a 404 error
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    // Step 4: Return a success message and the updated course data
    res.status(200).json({
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    // Step 5: Catch any errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a course from the database.

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id; // Extracting the course ID from the request parameters

    //  Find the course by ID and remove it
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    //  If no course is found with the given ID, return a 404 error
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    //  Return a success message
    res
      .status(200)
      .json({ message: "Course deleted successfully!", deletedCourse });
  } catch (error) {
    //  Catch any errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};

const Subject = require("../models/subject");

exports.addSubject = async (req, res) => {
  try {
    const { name, courseId } = req.body;

    // Validate input
    if (!name || !courseId) {
      return res
        .status(400)
        .json({ message: "Name and courseId are required." });
    }
    // Check if a subject with the same name already exists for the given courseId
    const existingSubject = await Subject.findOne({ name, courseId });
    if (existingSubject) {
      return res
        .status(400)
        .json({ message: "Subject already exists for this course." });
    }

    // Create a new subject
    const newSubject = new Subject({ name, courseId });

    // Save the subject to the database
    await newSubject.save();

    // Send response
    res.status(201).json({
      message: "Subject added successfully",
      subject: newSubject,
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Function to gett all the subject by courseId
exports.getAllSubjectsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Validate input
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required." });
    }

    // Find all subjects belonging to the given courseId
    const subjects = await Subject.find({ courseId });

    // Send response
    res.json({ subjects });
  } catch (error) {
    console.error("Error getting subjects by courseId:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Function to update subject
exports.updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id; // Extracting the course ID from the request parameters
    const updatedData = req.body; // Getting the updated data from the request body

    console.log("upade data0", updatedData);
    console.log("subject ide", subjectId);

    // Step 1: Check if there's any data provided for update
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No data provided for update." });
    }

    // Step 2: Find the course by ID and update it with the provided data
    const updatedSubject = await Subject.findByIdAndUpdate(
      subjectId,
      updatedData,
      {
        new: true, // Return the updated course document
        runValidators: true, // Apply validation rules from the schema
      }
    );

    // Step 3: If no course is found with the given ID, return a 404 error
    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    // Step 4: Return a success message and the updated course data
    res.status(200).json({
      message: "Subject updated successfully!",
      course: updatedSubject,
    });
  } catch (error) {
    // Step 5: Catch any errors and return a 500 status with the error message
    res.status(500).json({ error: error.message });
  }
};

//Function to delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    if (!subjectId) {
      return res.status(404).json({ message: "Subject Not found" });
    }

    const deleteSubject = await Subject.findByIdAndDelete(subjectId);

    res
      .status(200)
      .json({ message: "Subject deleted successfully", deleteSubject });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

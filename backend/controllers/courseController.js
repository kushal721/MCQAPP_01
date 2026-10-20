const mongoose = require("mongoose");
const Course = require("../models/course");
const Subject = require("../models/subject");
const Question = require("../models/question");
const QuestionAttempt = require("../models/questionAttempt");

// Function to add a new course to the database.
exports.addCourse = async (req, res) => {
  try {
    const { name, courseDescription } = req.body;

    if (!name || !courseDescription) {
      return res
        .status(400)
        .json({ message: "Name and description are required." });
    }

    const newCourse = await Course.create({ name, courseDescription });
    res.status(201).json({ message: "Course added successfully!", newCourse });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "A course with this name already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

// Function to get all courses, with subject and question counts.
exports.getAllCourse = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      { $sort: { createdAt: 1, _id: 1 } },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "courseId",
          as: "subjects",
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "subjects._id",
          foreignField: "subject_id",
          as: "questions",
        },
      },
      {
        $project: {
          name: 1,
          courseDescription: 1,
          createdAt: 1,
          subjectCount: { $size: "$subjects" },
          questionCount: { $size: "$questions" },
        },
      },
    ]);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get a single course by ID.
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID." });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Function to update the course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { name, courseDescription } = req.body;

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (courseDescription !== undefined)
      updatedData.courseDescription = courseDescription;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No data provided for update." });
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "A course with this name already exists." });
    }
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a course along with its subjects, questions and attempts.
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    const subjectIds = await Subject.find({ courseId }).distinct("_id");
    await Question.deleteMany({ subject_id: { $in: subjectIds } });
    await QuestionAttempt.deleteMany({ courseId });
    await Subject.deleteMany({ courseId });

    res
      .status(200)
      .json({ message: "Course deleted successfully!", deletedCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

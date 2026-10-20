const mongoose = require("mongoose");
const Subject = require("../models/subject");
const Question = require("../models/question");
const QuestionAttempt = require("../models/questionAttempt");

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
    const existingSubject = await Subject.findOne({ name: name.trim(), courseId });
    if (existingSubject) {
      return res
        .status(409)
        .json({ message: "Subject already exists for this course." });
    }

    const newSubject = await Subject.create({ name, courseId });

    res.status(201).json({
      message: "Subject added successfully",
      subject: newSubject,
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Function to get all the subjects of a course, with question counts
exports.getAllSubjectsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const subjects = await Subject.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { $sort: { createdAt: 1, _id: 1 } },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "subject_id",
          as: "questions",
        },
      },
      {
        $project: {
          name: 1,
          courseId: 1,
          createdAt: 1,
          questionCount: { $size: "$questions" },
        },
      },
    ]);

    res.json({ subjects });
  } catch (error) {
    console.error("Error getting subjects by courseId:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Function to get a single subject (with its course)
exports.getSubjectById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid subject ID." });
  }

  try {
    const subject = await Subject.findById(id).populate("courseId");
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }
    const questionCount = await Question.countDocuments({ subject_id: id });
    res.json({ ...subject.toObject(), questionCount });
  } catch (error) {
    console.error("Error getting subject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Function to update subject
exports.updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "No data provided for update." });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      subjectId,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    res.status(200).json({
      message: "Subject updated successfully!",
      subject: updatedSubject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Subject already exists for this course." });
    }
    res.status(500).json({ message: error.message });
  }
};

//Function to delete a subject along with its questions and attempts
exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    await Question.deleteMany({ subject_id: subjectId });
    await QuestionAttempt.deleteMany({ subjectId });

    res
      .status(200)
      .json({ message: "Subject deleted successfully", deletedSubject });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

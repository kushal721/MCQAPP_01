const Course = require("../models/course");
const Subject = require("../models/subject");
const Question = require("../models/question");
const QuestionAttempt = require("../models/questionAttempt");

// Totals for the admin dashboard.
exports.getStats = async (req, res) => {
  try {
    const [courses, subjects, questions, attempts] = await Promise.all([
      Course.countDocuments(),
      Subject.countDocuments(),
      Question.countDocuments(),
      QuestionAttempt.countDocuments(),
    ]);
    res.json({ courses, subjects, questions, attempts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require("mongoose");
const Question = require("../models/question");
const Subject = require("../models/subject");
const QuestionAttempt = require("../models/questionAttempt");

const { isValid } = mongoose.Types.ObjectId;
const toId = (id) => new mongoose.Types.ObjectId(id);

// Returns an error message if the options array is malformed, otherwise null.
const validateOptions = (options) => {
  if (!Array.isArray(options) || options.length < 2) {
    return "A question needs at least two options.";
  }
  const invalidOptions = options.some(
    (option) =>
      !option.option_text ||
      !String(option.option_text).trim() ||
      typeof option.is_correct !== "boolean"
  );
  if (invalidOptions) {
    return "Each option must include 'option_text' and 'is_correct' fields.";
  }
  if (!options.some((option) => option.is_correct)) {
    return "Mark at least one option as correct.";
  }
  return null;
};

exports.addQuestion = async (req, res) => {
  const { subject_id, question_text, options, explanation } = req.body;

  try {
    if (!subject_id || !question_text) {
      return res.status(400).json({
        message:
          "Please fill in all required fields: subject_id, question_text, and options.",
      });
    }

    const optionsError = validateOptions(options);
    if (optionsError) {
      return res.status(400).json({ message: optionsError });
    }

    const question = await Question.create({
      subject_id,
      question_text,
      options,
      explanation,
    });
    res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  const { id } = req.params;
  if (!isValid(id)) {
    return res.status(400).json({ message: "Invalid question ID." });
  }

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not fetch question." });
  }
};

// All questions of a subject (used by the admin panel).
exports.getQuestionsBySubject = async (req, res) => {
  const { subject_id } = req.params;
  if (!isValid(subject_id)) {
    return res.status(400).json({ message: "Invalid subject ID." });
  }

  try {
    const questions = await Question.find({ subject_id }).sort({
      createdAt: -1,
      _id: -1,
    });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error. Could not fetch questions." });
  }
};

// A random question from a subject that this user has not attempted yet.
exports.getQuestionBySubject = async (req, res) => {
  const { subject_id } = req.params;
  const { userId } = req.query;

  const quizType = "subjectwise";

  if (!isValid(subject_id)) {
    return res.status(400).json({ message: "Invalid subject ID." });
  }
  if (!isValid(userId)) {
    return res.status(400).json({ message: "A valid userId is required." });
  }

  try {
    // Find questions already attempted by the user
    const attemptedQuestions = await QuestionAttempt.find({
      userId: toId(userId),
      subjectId: toId(subject_id),
      quizType,
    }).distinct("questionId");

    const question = await Question.aggregate([
      {
        $match: {
          subject_id: toId(subject_id),
          _id: { $nin: attemptedQuestions },
        },
      },
      { $sample: { size: 1 } },
      // Answers are revealed only after the attempt is recorded.
      { $project: { "options.is_correct": 0, explanation: 0 } },
    ]);

    if (question.length === 0) {
      return res
        .status(404)
        .json({ message: "No new questions available for this subject." });
    }

    res.status(200).json(question[0]);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Server error. Could not fetch question." });
  }
};

exports.updateQuestion = async (req, res) => {
  const question_id = req.params.id;
  const { subject_id, question_text, options, explanation } = req.body;

  if (!isValid(question_id)) {
    return res.status(400).json({ message: "Invalid question ID format." });
  }

  const updateData = {};

  if (subject_id) updateData.subject_id = subject_id;
  if (question_text) updateData.question_text = question_text;
  if (options) {
    const optionsError = validateOptions(options);
    if (optionsError) {
      return res.status(400).json({ message: optionsError });
    }
    updateData.options = options;
  }
  // An empty string clears the explanation.
  if (explanation !== undefined) updateData.explanation = explanation;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update." });
  }

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      question_id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    res
      .status(200)
      .json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Server error. Could not update question." });
  }
};

exports.deleteQuestion = async (req, res) => {
  const question_id = req.params.id;

  if (!isValid(question_id)) {
    return res.status(400).json({ message: "Invalid question ID format." });
  }

  try {
    const deletedQuestion = await Question.findByIdAndDelete(question_id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }
    await QuestionAttempt.deleteMany({ questionId: question_id });

    res
      .status(200)
      .json({ message: "Question deleted successfully.", deletedQuestion });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Server error. Could not delete question." });
  }
};

exports.recordQuestionAttempt = async (req, res) => {
  const {
    quizType = "subjectwise",
    userId,
    courseId,
    subjectId,
    questionId,
    selectedOptionId,
  } = req.body;

  if (
    !isValid(userId) ||
    !isValid(courseId) ||
    !isValid(subjectId) ||
    !isValid(questionId)
  ) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Correctness is decided on the server from the chosen option.
    const selected = question.options.id(selectedOptionId);
    if (!selected) {
      return res.status(400).json({ message: "Invalid option selected." });
    }
    const isCorrect = selected.is_correct;
    const reveal = {
      isCorrect,
      correctOptionIds: question.options
        .filter((option) => option.is_correct)
        .map((option) => option._id),
      explanation: question.explanation || "",
    };

    // Check if the attempt already exists to avoid duplicate entries
    const existingAttempt = await QuestionAttempt.findOne({
      quizType,
      userId,
      subjectId,
      questionId,
    });

    if (existingAttempt) {
      return res
        .status(409)
        .json({ message: "Question already attempted.", ...reveal });
    }

    await QuestionAttempt.create({
      quizType,
      userId,
      courseId,
      subjectId,
      questionId,
      isCorrect,
    });

    res
      .status(201)
      .json({ message: "Question attempt recorded successfully.", ...reveal });
  } catch (error) {
    console.error("Error recording question attempt:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not record question attempt." });
  }
};

// Per-subject progress of a user inside a course: { [subjectId]: { attempted, correct } }
exports.getCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.query;

  if (!isValid(courseId) || !isValid(userId)) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const subjectIds = await Subject.find({ courseId }).distinct("_id");
    const rows = await QuestionAttempt.aggregate([
      {
        $match: {
          userId: toId(userId),
          subjectId: { $in: subjectIds },
          quizType: "subjectwise",
        },
      },
      {
        $group: {
          _id: "$subjectId",
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
    ]);

    const progress = {};
    rows.forEach((row) => {
      progress[row._id] = { attempted: row.attempted, correct: row.correct };
    });
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Server error. Could not fetch progress." });
  }
};

// Clears a user's attempts for a subject so they can practise it again.
exports.resetSubjectProgress = async (req, res) => {
  const { subject_id } = req.params;
  const { userId } = req.query;

  if (!isValid(subject_id) || !isValid(userId)) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const { deletedCount } = await QuestionAttempt.deleteMany({
      userId,
      subjectId: subject_id,
      quizType: "subjectwise",
    });
    res.status(200).json({ message: "Progress reset.", deletedCount });
  } catch (error) {
    console.error("Error resetting progress:", error);
    res.status(500).json({ message: "Server error. Could not reset progress." });
  }
};

const mongoose = require("mongoose");
const Question = require("../models/question");
const QuestionAttempt = require("../models/questionAttempt");

exports.addQuestion = async (req, res) => {
  const { subject_id, question_text, options, explanation } = req.body;

  try {
    // Basic validation for required fields
    if (
      !subject_id ||
      !question_text ||
      !Array.isArray(options) ||
      options.length === 0
    ) {
      return res.status(400).json({
        message:
          "Please fill in all required fields: subject_id, question_text, and options.",
      });
    }

    // Validate that each option has 'option_text' and 'is_correct' fields
    const invalidOptions = options.some(
      (option) => !option.option_text || typeof option.is_correct !== "boolean"
    );
    if (invalidOptions) {
      return res.status(400).json({
        message:
          "Each option must include 'option_text' and 'is_correct' fields.",
      });
    }

    const question = await Question.create({
      subject_id,
      question_text,
      options,
      explanation,
    });
    res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.getQuestionBySubject = async (req, res) => {
//   const { subject_id } = req.params;

//   // Validate subject_id
//   if (!mongoose.Types.ObjectId.isValid(subject_id)) {
//     return res.status(400).json({ message: "Invalid subject ID." });
//   }

//   try {
//     // Find questions by subject_id
//     const questions = await Question.find({ subject_id });

//     // Check if any questions were found
//     if (questions.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No questions found for this subject." });
//     }

//     // Return the found questions
//     res.status(200).json(questions);
//   } catch (error) {
//     // Error handling
//     console.error("Error fetching questions:", error);
//     res
//       .status(500)
//       .json({ message: "Server error. Could not fetch questions." });
//   }
// };

exports.getQuestionBySubject = async (req, res) => {
  const { subject_id } = req.params;

  const quizType = "subjectwise";

  // Validate subject_id
  if (!mongoose.Types.ObjectId.isValid(subject_id)) {
    return res.status(400).json({ message: "Invalid subject ID." });
  }

  try {
    // Hardcoded userId for testing
    const userId = new mongoose.Types.ObjectId("64c25a2fbd74f0e7358d341b");

    // Find questions already attempted by the user
    const attemptedQuestions = await QuestionAttempt.find({
      userId: userId,
      subjectId: new mongoose.Types.ObjectId(subject_id),
      quizType,
    }).distinct("questionId");

    // Find a random question by subject_id that is not in the attempted questions
    const question = await Question.aggregate([
      {
        $match: {
          subject_id: new mongoose.Types.ObjectId(subject_id),
          _id: { $nin: attemptedQuestions },
        },
      },
      { $sample: { size: 1 } },
    ]);

    // Check if any question was found
    if (question.length === 0) {
      return res
        .status(404)
        .json({ message: "No new questions available for this subject." });
    }

    // Return the found question
    res.status(200).json(question[0]);
  } catch (error) {
    // Error handling
    console.error("Error fetching question:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch question." });
  }
};

exports.updateQuestions = async (req, res) => {
  const question_id = req.params.id;
  const { subject_id, question_text, options, explanation } = req.body;

  // Validate question_id
  if (!mongoose.Types.ObjectId.isValid(question_id)) {
    return res.status(400).json({ message: "Invalid question ID format." });
  }

  // Build the update object
  const updateData = {};

  if (question_text) updateData.question_text = question_text;
  if (options) {
    // Validate options structure
    if (!Array.isArray(options)) {
      return res.status(400).json({ message: "Options should be an array." });
    }

    // Validate each option
    const invalidOptions = options.some(
      (option) => !option.option_text || typeof option.is_correct !== "boolean"
    );
    if (invalidOptions) {
      return res.status(400).json({
        message:
          "Each option must include 'option_text' and 'is_correct' fields.",
      });
    }

    updateData.options = options;
  }
  if (explanation) updateData.explanation = explanation;

  // Check if there is anything to update
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update." });
  }

  try {
    // Find the question and update it
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
    res
      .status(500)
      .json({ message: "Server error. Could not update question." });
  }
};

exports.deleteQuestion = async (req, res) => {
  const question_id = req.params.id;

  try {
    // Validate question_id
    if (!mongoose.Types.ObjectId.isValid(question_id)) {
      return res.status(400).json({ message: "Invalid question ID format." });
    }

    // Delete the question
    const deletedQuestion = await Question.findByIdAndDelete(question_id);
    res
      .status(200)
      .json({ message: "Question deleted successfully.", deletedQuestion });
  } catch (error) {}
};

exports.recordQuestionAttempt = async (req, res) => {
  const { quizType, userId, courseId, subjectId, questionId, isCorrect } =
    req.body;

  // Validate IDs
  if (
    // !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(subjectId) ||
    !mongoose.Types.ObjectId.isValid(questionId)
  ) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    // Check if the attempt already exists to avoid duplicate entries
    const existingAttempt = await QuestionAttempt.findOne({
      quizType,
      // userId,
      courseId,
      subjectId,
      questionId,
    });

    if (existingAttempt) {
      return res.status(409).json({ message: "Question already attempted." });
    }

    // Create a new question attempt
    const newAttempt = new QuestionAttempt({
      quizType,
      userId,
      courseId,
      subjectId,
      questionId,
      isCorrect,
    });

    // Save the attempt to the database
    await newAttempt.save();

    res
      .status(201)
      .json({ message: "Question attempt recorded successfully." });
  } catch (error) {
    console.error("Error recording question attempt:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not record question attempt." });
  }
};

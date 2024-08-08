const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionAttemptSchema = new Schema({

  quizType: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
  },

  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
});

module.exports = mongoose.model("QuestionAttempt", questionAttemptSchema);

const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionAttemptSchema = new Schema(
  {
    quizType: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

questionAttemptSchema.index({ userId: 1, subjectId: 1, quizType: 1 });

module.exports = mongoose.model("QuestionAttempt", questionAttemptSchema);

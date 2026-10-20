const mongoose = require("mongoose");
const { Schema } = mongoose;
// Question Schema
const questionSchema = new Schema(
  {
    subject_id: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    question_text: { type: String, required: true, trim: true },
    options: [
      {
        option_text: { type: String, required: true, trim: true },
        is_correct: { type: Boolean, required: true },
      },
    ],
    explanation: { type: String, trim: true },
  },
  { timestamps: true }
);

questionSchema.index({ subject_id: 1 });

module.exports = mongoose.model("Question", questionSchema);

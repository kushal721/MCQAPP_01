const mongoose = require("mongoose");
const { Schema } = mongoose;
// Question Schema
const questionSchema = new Schema({
  subject_id: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  question_text: { type: String, required: true },
  options: [
    {
      option_text: { type: String, required: true },
      is_correct: { type: Boolean, required: true },
    },
  ],
  explanation: { type: String },
  
});

module.exports = mongoose.model("Question", questionSchema);

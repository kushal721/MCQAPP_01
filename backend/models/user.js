const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },

  totalAttemptedQuestions: { type: Number, required: true },
  totalCorrectAnswers: { type: Number, required: true },
  totalWrongAnswers: { type: Number, required: true },

  totalScore: { type: Number, required: true },
  lastUpdated: { type: Date, required: true },
});

module.exports = mongoose.model("User", userSchema);

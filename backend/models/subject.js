const mongoose = require("mongoose");
const { Schema } = mongoose;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
});

module.exports = mongoose.model("Subject", subjectSchema);

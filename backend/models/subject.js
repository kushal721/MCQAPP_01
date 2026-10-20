const mongoose = require("mongoose");
const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

// The same subject name (e.g. "Physics") may exist in several courses.
subjectSchema.index({ name: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);

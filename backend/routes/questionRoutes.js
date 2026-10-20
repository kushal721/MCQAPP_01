const express = require("express");
const router = express.Router();
const {
  addQuestion,
  getQuestionById,
  getQuestionsBySubject,
  getQuestionBySubject,
  updateQuestion,
  deleteQuestion,
  recordQuestionAttempt,
  getCourseProgress,
  resetSubjectProgress,
} = require("../controllers/questionController");
const { requireAdmin } = require("../middleware/auth");

// Admin only: these return questions with their answers, or change them.
router.post("/addQuestion", requireAdmin, addQuestion);
router.get("/getQuestion/:id", requireAdmin, getQuestionById);
router.get("/getQuestionsBySubject/:subject_id", requireAdmin, getQuestionsBySubject);
router.put("/updateQuestion/:id", requireAdmin, updateQuestion);
router.delete("/deleteQuestion/:id", requireAdmin, deleteQuestion);

// Public: the student quiz flow.
router.get("/getQuestionBySubject/:subject_id", getQuestionBySubject);
router.post("/attemptedQuestion", recordQuestionAttempt);
router.get("/progress/:courseId", getCourseProgress);
router.delete("/resetProgress/:subject_id", resetSubjectProgress);

module.exports = router;

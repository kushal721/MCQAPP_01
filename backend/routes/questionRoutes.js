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

router.post("/addQuestion", addQuestion);
router.get("/getQuestion/:id", getQuestionById);
router.get("/getQuestionsBySubject/:subject_id", getQuestionsBySubject);
router.get("/getQuestionBySubject/:subject_id", getQuestionBySubject);
router.put("/updateQuestion/:id", updateQuestion);
router.delete("/deleteQuestion/:id", deleteQuestion);
router.post("/attemptedQuestion", recordQuestionAttempt);
router.get("/progress/:courseId", getCourseProgress);
router.delete("/resetProgress/:subject_id", resetSubjectProgress);

module.exports = router;

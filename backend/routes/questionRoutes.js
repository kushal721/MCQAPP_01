const express = require("express");
const router = express.Router();
const {
  addQuestion,
  getQuestionBySubject,
  updateQuestions,
  deleteQuestion,
  recordQuestionAttempt,
} = require("../controllers/questionController");

router.post("/addQuestion", addQuestion);
router.get("/getQuestionBySubject/:subject_id", getQuestionBySubject);

router.put("/updateSubject/:id", updateQuestions);
router.delete("/deleteQuestion/:id", deleteQuestion);
router.post("/attemptedQuestion", recordQuestionAttempt);

module.exports = router;

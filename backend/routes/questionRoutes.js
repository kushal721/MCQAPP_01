const express = require("express");
const router = express.Router();
const {
  addQuestion,
  getQuestionBySubject,
  updateQuestions,
} = require("../controllers/questionController");

router.post("/addQuestion", addQuestion);
router.get("/getQuestionBySubject/:subject_id", getQuestionBySubject);

router.put("/updateSubject/:id", updateQuestions);

module.exports = router;

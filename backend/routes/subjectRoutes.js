const express = require("express");
const router = express.Router();

const {
  addSubject,
  getAllSubjectsByCourseId,
} = require("../controllers/subjectController");

router.post("/addSubject", addSubject);
router.get("/getSubjectByCourse/:courseId", getAllSubjectsByCourseId);
module.exports = router;

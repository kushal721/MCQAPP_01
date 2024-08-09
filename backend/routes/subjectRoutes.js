const express = require("express");
const router = express.Router();

const {
  addSubject,
  getAllSubjectsByCourseId,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

router.post("/addSubject", addSubject);
router.get("/getSubjectByCourse/:courseId", getAllSubjectsByCourseId);
router.put("/updateSubject/:id", updateSubject);
router.delete("/deleteSubject/:id", deleteSubject);
module.exports = router;

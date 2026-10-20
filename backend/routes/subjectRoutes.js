const express = require("express");
const router = express.Router();

const {
  addSubject,
  getAllSubjectsByCourseId,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const { requireAdmin } = require("../middleware/auth");

router.post("/addSubject", requireAdmin, addSubject);
router.get("/getSubjectByCourse/:courseId", getAllSubjectsByCourseId);
router.get("/getSubject/:id", getSubjectById);
router.put("/updateSubject/:id", requireAdmin, updateSubject);
router.delete("/deleteSubject/:id", requireAdmin, deleteSubject);
module.exports = router;

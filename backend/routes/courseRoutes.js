const express = require("express");

const {
  addCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/addCourse", requireAdmin, addCourse);
router.get("/getAllCourse", getAllCourse);
router.get("/getCourse/:id", getCourseById);
router.put("/updateCourse/:id", requireAdmin, updateCourse);
router.delete("/deleteCourse/:id", requireAdmin, deleteCourse);

module.exports = router;

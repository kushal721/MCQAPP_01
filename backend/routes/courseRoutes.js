const express = require("express");

const {
  addCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/addCourse", addCourse);
router.get("/getAllCourse", getAllCourse);
router.get("/getCourse/:id", getCourseById);
router.put("/updateCourse/:id", updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);

module.exports = router;

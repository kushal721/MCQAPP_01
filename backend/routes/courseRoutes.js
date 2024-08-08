const express = require("express");

const {
  addCourse,
  getAllCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/addCourse", addCourse);
router.get("/getAllCourse", getAllCourse);
router.put("/updateCourse/:id", updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);

module.exports = router;

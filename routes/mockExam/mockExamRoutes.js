// routes/mockExam/mockExamRoutes.js
const express = require("express");
const router = express.Router();
const {
  getRegisteredCourses,
  generateMockExam,
} = require("../../controllers/mockExam/mockExamController");

// Fetch registered courses for a student
router.get("/courses/:studentId", getRegisteredCourses);

// Generate MCQs for a selected course title
router.post("/generate", generateMockExam);

module.exports = router;

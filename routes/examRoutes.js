// routes/examRoutes.js
const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

// GET /api/exams/:courseCode
router.get("/:courseCode", examController.getExamsByCourseCode);

module.exports = router;

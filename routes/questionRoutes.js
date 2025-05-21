// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

// GET /api/questions/:examId
router.get("/:examId", questionController.getQuestionsByExamId);

module.exports = router;

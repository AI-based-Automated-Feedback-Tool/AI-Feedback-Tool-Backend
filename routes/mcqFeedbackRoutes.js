const express = require("express");
const router = express.Router();
const { generateAIForMCQSubmission } = require("../services/aiServices/generateMcqFeedbackService");

// POST /api/mcq-feedback
router.post("/mcq-feedback", async (req, res) => {
  const { submissionId } = req.body;

  if (!submissionId) {
    return res.status(400).json({ error: "submissionId is required" });
  }

  try {
    await generateAIForMCQSubmission(submissionId);
    res.status(200).json({ message: "AI MCQ feedback generation complete." });
  } catch (error) {
    console.error("[MCQ Feedback Error]:", error);
    res.status(500).json({ error: "Failed to generate MCQ feedback." });
  }
});

module.exports = router;

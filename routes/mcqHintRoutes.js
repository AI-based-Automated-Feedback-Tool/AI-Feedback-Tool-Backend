const express = require("express");
const router = express.Router();
const { generateMcqHint } = require("../services/aiServices/generateMcqHintService");

router.post("/mcq", async (req, res) => {
  try {
    const { examId, questionId, questionText, choices, studentAnswer, hintTier } = req.body;

    // Basic validation
    if (!examId || !questionId || !questionText || !choices) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hint = await generateMcqHint({ examId, questionId, questionText, choices, studentAnswer, hintTier });
    res.status(200).json(hint);
  } catch (err) {
    console.error("Hint Error:", err);
    res.status(500).json({ error: "Failed to generate hint" });
  }
});

module.exports = router;

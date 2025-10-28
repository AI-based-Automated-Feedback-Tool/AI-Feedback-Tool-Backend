// routes/codeHintRoutes.js
const express = require("express");
const router = express.Router();
const { generateCodeHint } = require("../services/aiServices/generateCodeHintService");

/**
 * POST /api/hints/code
 * Body: {
 *   examId, questionId, promptText, language,
 *   starterCode?, studentCode?, testCases?, hintTier?
 * }
 * Returns: { hintText, cooldownSeconds, remainingHints? }
 */
router.post("/code", async (req, res) => {
  try {
    const {
      examId,
      questionId,
      promptText,
      language,
      starterCode = "",
      studentCode = "",
      testCases = [],
      hintTier = "Nudge",
    } = req.body;

    // Basic validation
    if (!examId || !questionId || !promptText || !language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await generateCodeHint({
      examId,
      questionId,
      promptText,
      language,
      starterCode,
      studentCode,
      testCases,
      hintTier,
    });

    return res.status(200).json(result); // { hintText, cooldownSeconds, remainingHints? }
  } catch (err) {
    console.error("Code Hint Error:", err);
    return res.status(500).json({ error: "Failed to generate code hint" });
  }
});

module.exports = router;

// routes/chartTaskRoutes.js
const express = require("express");
const { analyzeChartImage } = require("../services/aiServices/chartAnalysisService");

const router = express.Router();

/**
 * POST /api/chart-tasks/:questionId/submit
 * body: { userId, imageUrl, imageMime, questionText }
 */
router.post("/:questionId/submit", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { userId, imageUrl, imageMime, questionText } = req.body || {};

    if (!questionId || !userId || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call AI
    const ai_feedback = await analyzeChartImage({
      questionText: questionText || "(question text not provided)",
      imageUrl,
      imageMime: imageMime || "image/*",
    });

    // TODO: Persist to Supabase later (essay_exam_submissions_answers)
    return res.json({ ok: true, ai_feedback });
  } catch (err) {
    console.error("Chart submit error:", err);
    return res.status(500).json({ error: "Failed to analyze diagram" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { generateAIForEssaySubmission } = require('../services/aiServices/generateEssayFeedbackService'); // ✅ call separate service

// POST /api/essay-feedback/generate-essay-feedback
router.post('/generate-essay-feedback', async (req, res) => {
  const { submissionId } = req.body;

  if (!submissionId) {
    return res.status(400).json({ error: 'submissionId is required' });
  }

  const result = await generateAIForEssaySubmission(submissionId);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

module.exports = router;

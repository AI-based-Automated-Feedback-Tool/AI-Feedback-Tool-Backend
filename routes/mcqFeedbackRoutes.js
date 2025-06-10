// routes/mcqFeedbackRoutes.js

const express = require('express');
const router = express.Router();
const { generateAIForMCQSubmission } = require('../services/aiServices/generateMcqFeedbackService');

router.post('/', async (req, res) => {
  const { submissionId } = req.body;

  console.log(' Received POST /api/mcq-feedback with submissionId:', submissionId);

  // Validation
  if (!submissionId) {
    console.error(' submissionId missing in request body');
    return res.status(400).json({ error: 'submissionId is required' });
  }

  try {
    console.log(' Starting AI feedback generation...');
    await generateAIForMCQSubmission(submissionId);
    console.log(' AI feedback generation completed successfully');

    res.status(200).json({ message: 'AI feedback generated successfully' });
  } catch (err) {
    console.error(' Error during AI feedback generation:', err);
    res.status(500).json({ error: 'Failed to generate AI feedback', details: err.message });
  }
});

module.exports = router;

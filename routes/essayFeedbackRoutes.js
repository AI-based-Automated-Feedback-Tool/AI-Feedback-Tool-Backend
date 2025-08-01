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

// GET /api/essay-feedback/review/:submissionId
router.get('/review/:submissionId', async (req, res) => {
  const { submissionId } = req.params;

  try {
    const { supabase } = require('../supabaseClient'); // adjust if needed

    const { data, error } = await supabase
      .from('essay_exam_submissions_answers')
      .select('id, student_answer, ai_feedback, is_correct, score')
      .eq('submission_id', submissionId);

    if (error) {
      console.error('❌ Review fetch error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Server error fetching review:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

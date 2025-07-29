const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { generateFeedback } = require('../services/aiServices/openrouterService'); // Or cohereService

// POST /api/essay-feedback/generate-essay-feedback
router.post('/generate-essay-feedback', async (req, res) => {
  const { submissionId } = req.body;

  if (!submissionId) {
    return res.status(400).json({ error: 'submissionId is required' });
  }

  // Step 1: Fetch all essay answers for the given submission
  const { data: answers, error } = await supabase
    .from('essay_exam_submissions_answers')
    .select('id, student_answer')
    .eq('submission_id', submissionId);

  if (error || !answers || answers.length === 0) {
    return res.status(404).json({ error: 'No answers found for this submission' });
  }

  try {
    // Step 2: Generate and save feedback for each answer
    for (const answer of answers) {
      const parsedAnswer = JSON.parse(answer.student_answer);
      const prompt = `Provide constructive feedback for this answer:\n"${parsedAnswer.text}"`;

      const feedbackText = await generateFeedback(prompt);

      // Step 3: Save feedback in Supabase
      await supabase
        .from('essay_exam_submissions_answers')
        .update({ ai_feedback: { comment: feedbackText } })
        .eq('id', answer.id);

      console.log(`Feedback saved for answer ${answer.id}:`, feedbackText);
    }

    return res.status(200).json({ success: true, message: 'AI feedback generated and saved.' });
  } catch (err) {
    console.error('Error generating feedback:', err.message);
    return res.status(500).json({ error: 'AI generation failed' });
  }
});

module.exports = router;

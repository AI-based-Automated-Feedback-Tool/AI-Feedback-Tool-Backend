const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { generateFeedback } = require('../services/aiServices/cohereService'); // ✅ Using cohereService

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

  console.log('Received submissionId:', submissionId);
  console.log('Supabase answers:', answers);
  console.log('Supabase error:', error);

  if (error || !answers || answers.length === 0) {
    return res.status(404).json({ error: 'No answers found for this submission' });
  }

  try {
    // Step 2: Generate and save feedback for each valid answer
    for (const answer of answers) {
      if (!answer.student_answer) {
        console.warn(`Skipping answer ${answer.id}: student_answer is null or empty.`);
        continue;
      }

      let parsedAnswer;
      try {
        parsedAnswer = JSON.parse(answer.student_answer);
      } catch (parseError) {
        console.warn(`Skipping answer ${answer.id}: JSON parse error: ${parseError.message}`);
        continue;
      }

      const prompt = `Provide constructive feedback for this answer:\n"${parsedAnswer.text}"`;

      let feedbackText;
      try {
        feedbackText = await generateFeedback(prompt); // ✅ From cohereService
      } catch (generationError) {
        console.error(`AI generation failed for answer ${answer.id}: ${generationError.message}`);
        continue;
      }

      await supabase
        .from('essay_exam_submissions_answers')
        .update({ ai_feedback: { comment: feedbackText } })
        .eq('id', answer.id);

      console.log(`✅ Feedback saved for answer ${answer.id}:`, feedbackText);
    }

    return res.status(200).json({ success: true, message: 'AI feedback generated and saved.' });
  } catch (err) {
    console.error('❌ Server error:', err.message);
    return res.status(500).json({ error: 'AI generation failed' });
  }
});

module.exports = router;

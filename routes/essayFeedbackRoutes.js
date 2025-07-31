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

  console.log('📩 Received submissionId:', submissionId);
  console.log('📄 Supabase answers:', answers);
  if (error) console.error('❌ Supabase error:', error);

  if (error || !answers || answers.length === 0) {
    return res.status(404).json({ error: 'No answers found for this submission' });
  }

  try {
    // Step 2: Generate and save feedback for each answer
    for (const answer of answers) {
      const parsedAnswer = answer.student_answer;

      if (!parsedAnswer || typeof parsedAnswer !== 'object' || !parsedAnswer.text) {
        console.warn(`⚠️ Skipping answer ${answer.id}: Invalid or missing student_answer.text`);
        continue;
      }

      const prompt = `Provide constructive feedback for this answer:\n"${parsedAnswer.text}"`;

      let feedbackText;
      try {
        feedbackText = await generateFeedback(prompt); // ✅ AI call
      } catch (generationError) {
        console.error(`❌ AI generation failed for answer ${answer.id}: ${generationError.message}`);
        continue;
      }

      // Step 3: Save feedback to Supabase
      const { error: updateError } = await supabase
        .from('essay_exam_submissions_answers')
        .update({ ai_feedback: { comment: feedbackText } })
        .eq('id', answer.id);

      if (updateError) {
        console.error(`❌ Error saving feedback for ${answer.id}:`, updateError);
      } else {
        console.log(`✅ Feedback saved for answer ${answer.id}:`, feedbackText);
      }
    }

    return res.status(200).json({ success: true, message: 'AI feedback generated and saved.' });
  } catch (err) {
    console.error('❌ Server error:', err.message);
    return res.status(500).json({ error: 'AI generation failed' });
  }
});

module.exports = router;

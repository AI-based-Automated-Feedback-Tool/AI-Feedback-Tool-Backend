const express = require('express');
const router = express.Router();

module.exports = router;

const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

router.post('/generate-essay-feedback', async (req, res) => {
  const { submissionId } = req.body;

  if (!submissionId) {
    return res.status(400).json({ error: 'submissionId is required' });
  }

  // Fetch answers for that submission
  const { data: answers, error } = await supabase
    .from('essay_exam_submissions_answers')
    .select('id, student_answer')
    .eq('submission_id', submissionId);

  if (error || !answers || answers.length === 0) {
    return res.status(404).json({ error: 'No answers found for this submission' });
  }

  res.status(200).json({ answers });
});

module.exports = router;

const { generateFeedback } = require('../services/aiServices/openrouterService'); // or cohereService

router.post('/generate-essay-feedback', async (req, res) => {
  const { submissionId } = req.body;

  if (!submissionId) {
    return res.status(400).json({ error: 'submissionId is required' });
  }

  const { data: answers, error } = await supabase
    .from('essay_exam_submissions_answers')
    .select('id, student_answer')
    .eq('submission_id', submissionId);

  if (error || !answers || answers.length === 0) {
    return res.status(404).json({ error: 'No answers found for this submission' });
  }

  try {
    for (const answer of answers) {
      const parsedAnswer = JSON.parse(answer.student_answer);
      const prompt = `Provide constructive feedback for this answer:\n"${parsedAnswer.text}"`;

      const feedbackText = await generateFeedback(prompt); // Use your AI service here

      console.log('Generated feedback:', feedbackText); // test log
    }

    res.status(200).json({ message: 'Feedback generated (not saved yet)' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

    for (const answer of answers) {
      const parsedAnswer = JSON.parse(answer.student_answer);
      const prompt = `Provide constructive feedback for this answer:\n"${parsedAnswer.text}"`;

      const feedbackText = await generateFeedback(prompt);

      await supabase
        .from('essay_exam_submissions_answers')
        .update({ ai_feedback: { comment: feedbackText } })
        .eq('id', answer.id);
    }

    return res.status(200).json({ success: true, message: 'AI feedback generated successfully.' });




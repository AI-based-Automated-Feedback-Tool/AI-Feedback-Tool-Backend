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


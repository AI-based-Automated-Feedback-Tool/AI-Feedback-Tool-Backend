// services/aiServices/generateEssayFeedbackService.js
const { supabase } = require('../../supabaseClient');
const cohereService = require('./cohereService'); // still uses generate()

const generateAIForEssaySubmission = async (submissionId) => {
  try {
    console.log(`generateAIForEssaySubmission called with submissionId: ${submissionId}`);

    // Fetch all essay answers for the submission
    const { data: answers, error } = await supabase
      .from('essay_exam_submissions_answers')
      .select('id, student_answer')
      .eq('submission_id', submissionId);

    if (error || !answers || answers.length === 0) {
      throw new Error('No valid answers found or Supabase error');
    }

    for (const answer of answers) {
      const { id, student_answer } = answer;

      if (!student_answer) {
        console.warn(`Skipping answer ${id}: no student_answer`);
        continue;
      }

      let parsed;
      try {
        parsed = typeof student_answer === 'object' ? student_answer : JSON.parse(student_answer);
      } catch (err) {
        console.warn(`Skipping answer ${id}: invalid JSON`);
        continue;
      }

      const prompt = `Give detailed, constructive feedback on the following essay answer:\n"${parsed.text}"`;

      try {
        const feedback = await cohereService.generate(prompt);

        // Save feedback
        await supabase
          .from('essay_exam_submissions_answers')
          .update({ ai_feedback: { comment: feedback } })
          .eq('id', id);

        console.log(`✅ Feedback saved for answer ${id}`);
      } catch (genErr) {
        console.error(`❌ AI generation failed for answer ${id}:`, genErr.message);
        continue;
      }
    }

    return { success: true, message: 'Essay feedback generated and saved' };
  } catch (err) {
    console.error('[Essay Feedback Error]:', err.message);
    return { success: false, message: err.message };
  }
};

module.exports = {
  generateAIForEssaySubmission,
};

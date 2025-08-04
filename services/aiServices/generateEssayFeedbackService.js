const { supabase } = require('../../supabaseClient');
const cohereService = require('./cohereService'); // use .generate()

// Function to evaluate the answer and return a score
function evaluateAnswer(feedbackText) {
  if (/comprehensive|accurate|well-structured/i.test(feedbackText)) {
    return { is_correct: true, score: 9 };
  } else if (/partially correct|needs more detail/i.test(feedbackText)) {
    return { is_correct: false, score: 5 };
  } else {
    return { is_correct: false, score: 2 };
  }
}

const generateAIForEssaySubmission = async (submissionId) => {
  try {
    console.log(`📩 Received submissionId: ${submissionId}`);

    const { data: answers, error } = await supabase
      .from('essay_exam_submissions_answers')
      .select('id, student_answer')
      .eq('submission_id', submissionId);

    console.log('📄 Supabase answers:', answers);
    if (error) console.error('❌ Supabase error:', error);

    if (error || !answers || answers.length === 0) {
      return { success: false, message: 'No valid answers found or Supabase error' };
    }

    for (const answer of answers) {
      const { id, student_answer } = answer;

      if (!student_answer) {
        console.warn(`⚠️ Skipping answer ${id}: no student_answer`);
        continue;
      }

      let parsed;
      try {
        parsed = typeof student_answer === 'object' ? student_answer : JSON.parse(student_answer);
      } catch (err) {
        console.warn(`⚠️ Skipping answer ${id}: Invalid JSON`);
        continue;
      }

      if (!parsed.text) {
        console.warn(`⚠️ Skipping answer ${id}: Missing text field`);
        continue;
      }

      const prompt = `Evaluate the following student answer in the context of the essay question. 
      Essay Question: "${answer.question.text}"
      Student Answer: "${parsed.text}"
      Provide constructive feedback and highlight how well the answer addresses the question.`;

      try {
        const feedback = await cohereService.generate(prompt);
         const { is_correct, score } = evaluateAnswer(feedback);

         await supabase
          .from('essay_exam_submissions_answers')
          .update({
            ai_feedback: { comment: feedback },
            is_correct,
            score
          })
          .eq('id', id);

        console.log(`✅ Feedback saved for answer ${id}:`, feedback);
      } catch (genErr) {
        console.error(`❌ AI generation failed for ${id}:`, genErr.message);
      }
    }

    return { success: true, message: 'AI feedback generated and saved.' };
  } catch (err) {
    console.error('❌ Essay feedback generation error:', err.message);
    return { success: false, message: 'Essay AI generation failed' };
  }
};

module.exports = { generateAIForEssaySubmission };

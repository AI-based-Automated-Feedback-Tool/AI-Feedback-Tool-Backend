const { supabase } = require('../../supabaseClient');
const cohereService = require('./cohereService');

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
      .select(`
        id,
        student_answer,
        question_id,
        question:essay_questions(question_text)
      `)
      .eq('submission_id', submissionId);

    console.log('📄 Supabase answers:', answers);

    if (error || !answers || answers.length === 0) {
      console.error('❌ Supabase error or no answers found:', error);
      return { success: false, message: 'No valid answers found or Supabase error' };
    }

    for (const answer of answers) {
      const { id, student_answer, question } = answer;

      // Parse student answer
      let parsed;
      try {
        parsed = typeof student_answer === 'object' ? student_answer : JSON.parse(student_answer);
      } catch (err) {
        console.warn(`⚠️ Skipping answer ${id}: Invalid JSON`);
        continue;
      }

      if (!parsed?.text || !question?.question_text) {
        console.warn(`⚠️ Skipping answer ${id}: Missing student text or question`);
        continue;
      }

      const prompt = `Essay Question: "${question.question_text}"\nStudent Answer: "${parsed.text}"\nEvaluate this answer. Provide feedback and a score out of 10.`;

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

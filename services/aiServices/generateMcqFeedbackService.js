// services/aiServices/generateMcqFeedbackService.js
const { supabase } = require('../../supabaseClient');
const cohereService = require('./cohereService');

const generateAIForMCQSubmission = async (submissionId) => {
  try {
    console.log(`🔵 generateAIForMCQSubmission called with submissionId: ${submissionId}`);

    // Fetch submitted answers with related question and student answer
    console.log(`🟡 Fetching answers for submissionId: ${submissionId}`);
    const { data: answersData, error: answersError } = await supabase
      .from('exam_submissions_answers')
      .select(
        `
        id,
        mcq_questions ( question_text, options, answers ),
        student_answer
      `
      )
      .eq('submission_id', submissionId);

    if (answersError) throw new Error(`Error fetching answers: ${answersError.message}`);

    console.log(`✅ Fetched ${answersData.length} answers.`);

    // Build prompt
    let prompt = `You are an expert tutor providing detailed feedback to a student based on their answers to multiple-choice questions. For each question, explain why the student's answer is correct or incorrect, and give learning advice.\n\n`;

    answersData.forEach((entry, index) => {
      const question = entry.mcq_questions?.question_text || 'N/A';
      const options = entry.mcq_questions?.options?.join(', ') || 'N/A';
      const correctAnswers = entry.mcq_questions?.answers?.join(', ') || 'N/A';
      const studentAnswer = entry.student_answer?.join(', ') || 'N/A';

      prompt += `Question ${index + 1}: ${question}\n`;
      prompt += `Options: ${options}\n`;
      prompt += `Correct Answer(s): ${correctAnswers}\n`;
      prompt += `Student Answer: ${studentAnswer}\n`;
      prompt += `Feedback:\n`;
    });

    console.log(`🟡 Sending prompt to Cohere...`);
    console.log(`📝 Prompt length (characters): ${prompt.length}`);

    // Call Cohere AI
    const cohereResponse = await cohereService.generate(prompt);
    const aiFeedback = cohereResponse || 'No feedback generated.';

    console.log(`✅ Received AI feedback from Cohere.`);

    // Update all rows with the same AI feedback
    const { error: updateError } = await supabase
      .from('exam_submissions_answers')
      .update({ ai_feedback: aiFeedback })
      .eq('submission_id', submissionId);

    if (updateError) throw new Error(`Error updating feedback: ${updateError.message}`);

    console.log(`✅ AI feedback saved to exam_submissions_answers.`);

  } catch (err) {
    console.error('❌ [MCQ Feedback Error]:', err);
    throw err;
  }
};

module.exports = {
  generateAIForMCQSubmission,
};

const { supabase } = require('../../supabaseClient');
const cohereService = require('./cohereService');

const generateAIForMCQSubmission = async (submissionId) => {
  try {
    console.log(`generateAIForMCQSubmission called with submissionId: ${submissionId}`);

    // 1️⃣ Fetch submitted answers and related question data
    const { data: answersData, error: answersError } = await supabase
      .from('exam_submissions_answers')
      .select(`
        id,
        mcq_questions ( question_text, options, answers ),
        student_answer
      `)
      .eq('submission_id', submissionId);

    if (answersError) throw new Error(`Error fetching answers: ${answersError.message}`);
    console.log(`Fetched ${answersData.length} answers.`);

    // 2️⃣ Process each question individually
    for (const entry of answersData) {
      const rowId = entry.id;
      const question = entry.mcq_questions?.question_text || 'N/A';
      const options = entry.mcq_questions?.options?.join(', ') || 'N/A';
      const correctAnswers = entry.mcq_questions?.answers?.join(', ') || 'N/A';
      const studentAnswer = entry.student_answer?.join(', ') || 'N/A';

      // 3️⃣ Build prompt specific to this question
      const prompt = `
You are an expert tutor giving feedback on a multiple-choice question.

Question: ${question}
Options: ${options}
Correct Answer(s): ${correctAnswers}
Student's Answer: ${studentAnswer}

Provide helpful, constructive feedback explaining whether the answer is correct or not, why, and tips for improvement.
`;

      console.log(`Sending prompt to Cohere for rowId: ${rowId}...`);

      // 4️⃣ Get AI feedback from Cohere
      const cohereResponse = await cohereService.generate(prompt);
      const aiFeedback = cohereResponse || 'No feedback generated.';

      // 5️⃣ Save feedback to this specific row
      const { error: updateError } = await supabase
        .from('exam_submissions_answers')
        .update({ ai_feedback: aiFeedback })
        .eq('id', rowId);

      if (updateError) {
        console.error(`❌ Failed to update feedback for rowId ${rowId}`);
        throw updateError;
      }

      console.log(`✅ Feedback saved for rowId ${rowId}`);
    }

    console.log(`🎉 All feedback generated and saved.`);

  } catch (err) {
    console.error('[MCQ Feedback Error]:', err);
    throw err;
  }
};

module.exports = {
  generateAIForMCQSubmission,
};

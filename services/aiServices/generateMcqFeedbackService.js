// services/aiServices/generateMcqFeedbackService.js

const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAIForMCQSubmission(submissionId) {
  console.log('🔵 generateAIForMCQSubmission called with submissionId:', submissionId);

  try {
    // Step 1: Fetch answers for this submission
    console.log('🟡 Fetching answers for submissionId:', submissionId);

    const { data: answersData, error } = await supabase
      .from('exam_submissions_answers')
      .select(`
        id,
        question_id,
        student_answer,
        is_correct,
        mcq_questions ( question_text, answers )
      `)
      .eq('submission_id', submissionId);

    if (error) {
      console.error('❌ Error fetching submission answers:', error);
      throw error;
    }

    if (!answersData || answersData.length === 0) {
      console.warn('⚠️ No answers found for this submission.');
      return;
    }

    console.log(`✅ Fetched ${answersData.length} answers.`);

    // Step 2: Build AI prompt
    const promptParts = answersData.map((answer, index) => {
      const questionText = answer.mcq_questions?.question_text || 'Unknown Question';
      const correctAnswer = Array.isArray(answer.mcq_questions?.answers)
        ? answer.mcq_questions.answers.join(', ')
        : 'Unknown Answer';
      const studentAnswer = Array.isArray(answer.student_answer)
        ? answer.student_answer.join(', ')
        : 'Unknown Answer';

      return `
Question ${index + 1}:
Q: ${questionText}
Correct Answer: ${correctAnswer}
Student Answer: ${studentAnswer}

Please provide a short and constructive feedback for the student based on whether their answer was correct or not.
`;
    });

    const fullPrompt = `
You are an expert teacher assistant. For each of the following MCQ answers, provide constructive feedback.
If the answer is correct, praise and reinforce it. If incorrect, explain why and what is the correct concept.

${promptParts.join('\n---\n')}
`;

    console.log('🟡 Sending prompt to OpenAI...');
    console.log('📝 Prompt length (characters):', fullPrompt.length);

    // Step 3: Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an AI teacher assistant providing MCQ feedback.' },
        { role: 'user', content: fullPrompt }
      ],
      temperature: 0.7
    });

    const aiResponse = completion?.choices?.[0]?.message?.content;
    console.log('✅ OpenAI response received:');
    console.log(aiResponse);

    if (!aiResponse) {
      throw new Error('No AI response received.');
    }

    // Step 4: Split AI response → naive splitting (you can improve it)
    const feedbacks = aiResponse.split(/Question \d+:/).filter((f) => f.trim() !== '');

    console.log(`🟡 Splitting AI response → ${feedbacks.length} feedback parts found.`);

    // Step 5: Update feedbacks in DB
    for (let i = 0; i < answersData.length; i++) {
      const feedback = feedbacks[i]?.trim() || 'No feedback.';
      const answerId = answersData[i].id;

      console.log(`🟡 Updating feedback for answerId: ${answerId} → "${feedback}"`);

      const { error: updateError } = await supabase
        .from('exam_submissions_answers')
        .update({ ai_feedback: { feedback } }) // Save as JSON object
        .eq('id', answerId);

      if (updateError) {
        console.error(`❌ Failed to update ai_feedback for answerId ${answerId}:`, updateError);
      } else {
        console.log(`✅ ai_feedback updated for answerId ${answerId}`);
      }
    }

    console.log('✅ All AI MCQ feedback stored in database.');
  } catch (err) {
    console.error('❌ [MCQ Feedback Error]:', err);
    throw err;
  }
}

module.exports = {
  generateAIForMCQSubmission
};

const { createClient } = require("@supabase/supabase-js");
const { OpenAI } = require("openai");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAIForMCQSubmission(submissionId) {
  // 1️⃣ Fetch answers + questions
  const { data: answersData, error } = await supabase
    .from("exam_submissions_answers")
    .select(`
      id,
      question_id,
      student_answer,
      is_correct,
      mcq_questions ( question_text, answers )
    `)
    .eq("submission_id", submissionId);

  if (error) {
    console.error("Error fetching submission answers:", error);
    return;
  }

  // 2️⃣ Build AI Prompt
  let prompt = `You are an educational assistant.\n
Please review the student's MCQ exam results. For each question:

- If correct: praise briefly.
- If incorrect: explain why the answer is incorrect, and give a tip for improvement.

Here are the questions and answers:\n\n`;

  answersData.forEach((answer, index) => {
    prompt += `Question ${index + 1}: ${answer.mcq_questions.question_text}\n`;
    prompt += `Correct Answer(s): ${answer.mcq_questions.answers}\n`;
    prompt += `Student Answer: ${answer.student_answer}\n`;
    prompt += `Result: ${answer.is_correct ? "Correct" : "Incorrect"}\n\n`;
    prompt += `Feedback:\n`;
  });

  prompt += `\nPlease give clear feedback for each question.\n`;

  // 3️⃣ Call OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4", // or "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You are a helpful educational assistant." },
      { role: "user", content: prompt },
    ],
  });

  const aiResponse = completion.choices[0].message.content;
  console.log("AI Response:", aiResponse);

  // 4️⃣ Parse AI response
  const feedbacks = aiResponse.split("Feedback:").slice(1);

  // 5️⃣ Save feedback back into exam_submissions_answers
  for (let i = 0; i < answersData.length; i++) {
    const feedback = feedbacks[i]?.trim() || "No feedback.";
    const answerId = answersData[i].id;

    await supabase
      .from("exam_submissions_answers")
      .update({ ai_feedback: { feedback } })
      .eq("id", answerId);
  }

  console.log("✅ AI feedback saved to exam_submissions_answers.");
}

module.exports = { generateAIForMCQSubmission };

const { OpenAI } = require('openai');

const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateEssayQuestionsDeepseek(
    topic,
    difficultyLevel,
    guidance,
    keyConcepts,
    doNotInclude,
    wordLimitAI,
    pointsAI,
    noOfQuestion,
    gradingNotesAI
) {
    let prompt = `You are an experienced educator tasked with creating essay-type assessment questions.

      Generate ${noOfQuestion} essay question${noOfQuestion > 1 ? 's' : ''} on the topic: "${topic}".
      Difficulty level: ${difficultyLevel}.
      ${guidance ? `Guidance/Instructions for students: ${guidance}` : ''}
      ${keyConcepts ? `Key concepts students must include: ${keyConcepts}` : ''}
      ${doNotInclude ? `Avoid including: ${doNotInclude}` : ''}

      Each question should:
      - specify the question prompt (clear, engaging, suitably challenging for the difficulty level)
      - specify the word limit: ${wordLimitAI}
      - specify the points awarded: ${pointsAI}
      - include grading notes for the teacher: ${gradingNotesAI}

      Return output as a JSON array of question objects. Each object must have:
      {
      "question_text": "...",
      "word_limit": ${wordLimitAI},
      "points": ${pointsAI},
      "grading_note": "..."
      }

      Important: Output **strict JSON only**, with no extra explanation or text.`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 3000,
          temperature: 0.7,
        });

        let rawText = response.choices?.[0]?.message?.content?.trim() || "";

        const cleaned = rawText
          .replace(/^```(json)?/gi, "")
          .replace(/```$/g, "")
          .replace(/^[^{[]*/, "")
          .replace(/[^}\]]*$/, "");

        const questions = JSON.parse(cleaned);
        return questions;
      } catch (err) {
        if (err.code === 429 && attempt < 3) {
          console.warn(`Rate limited by DeepSeek. Retrying in ${attempt * 2}s...`);
          await sleep(2000 * attempt);
          continue;
        }
        console.error("Failed DeepSeek generation:", err);
        throw new Error("Failed to generate DeepSeek essay questions.");
      }
    }
}

module.exports = {
    generateEssayQuestionsDeepseek
};
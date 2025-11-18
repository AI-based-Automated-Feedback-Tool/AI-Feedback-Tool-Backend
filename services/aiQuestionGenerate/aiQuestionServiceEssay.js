const {CohereClientV2} = require('cohere-ai');

const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY
});

async function generateEssayQuestions(
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

    const response = await cohere.chat({
        model: 'command-xlarge-nightly',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
    });

  // … process the response like your previous function …
  let rawText = '';
  if (response.message && Array.isArray(response.message.content)) {
    rawText = response.message.content.map(b => b.text||'').join('').trim();
  } else {
    rawText = JSON.stringify(response.message || response);
  }
  rawText = rawText.replace(/^```(json)?/gi, '').replace(/```$/g, '').trim();

  let questions;
  try {
    questions = JSON.parse(rawText);
  } catch (err) {
    console.error('Failed to parse AI response:', rawText);
    throw new Error('AI output could not be parsed. Please try again.');
  }

  return questions;
}

module.exports = {
    generateEssayQuestions
};
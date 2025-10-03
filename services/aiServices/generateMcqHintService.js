//const openrouter = require("./openrouterService"); // or cohereService
const cohere = require("./cohereService");

async function generateMcqHint({ examId, questionId, questionText, choices, studentAnswer, hintTier }) {
  const prompt = `
  You are a helpful tutor. Provide a hint (not the answer) for the following MCQ.

  Question: ${questionText}
  Choices: ${choices.join(", ")}
  Student Answer: ${studentAnswer || "Not answered"}
  Hint Tier: ${hintTier}

  Rules:
  - Do NOT reveal option letters (A, B, C…).
  - Keep it under 120 words.
  - Give a conceptual nudge, not the solution.
  `;

  try {
    const aiText = await cohere.generate(prompt);
    return { hintText: aiText, cooldownSeconds: 30, remainingHints: 9 };
  } catch (err) {
    console.error("AI Hint Error:", err);
    return { hintText: "Try focusing on the key concept and eliminate clearly wrong choices.", cooldownSeconds: 30, remainingHints: 9 };
  }
}

module.exports = { generateMcqHint };

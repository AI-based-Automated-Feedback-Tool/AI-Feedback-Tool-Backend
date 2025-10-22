// services/aiServices/chartAnalysisService.js
const cohere = require("./cohereService");

/**
 * Analyze an uploaded diagram image against the question prompt.
 */
async function analyzeChartImage({ questionText, imageUrl, imageMime }) {
  const prompt = `
You are a helpful grader. An image diagram was uploaded as the student's answer.

Question:
${questionText}

Student Diagram URL: ${imageUrl}
Image MIME: ${imageMime}

Instructions:
- Describe what the diagram shows (entities/classes/relations/flow).
- Compare to the question; note missing or mismatched parts.
- Give 2–4 concrete improvements.
- Keep under 180 words.
`;

  return cohere.generate(prompt);
}

module.exports = { analyzeChartImage };

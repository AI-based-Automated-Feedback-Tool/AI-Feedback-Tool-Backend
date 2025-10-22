const { generate } = require("./cohereService");

async function analyzeChartImage({ questionText, imageUrl, imageMime }) {
  const prompt = `
You are a helpful grader. An image diagram was uploaded as the student's answer.

Question:
${questionText}

Student Diagram URL: ${imageUrl}
Image MIME: ${imageMime}

Instructions:
- Identify what the diagram represents (UML, ERD, Flow, etc.)
- Compare it to question requirements
- List missing or incorrect elements
- Provide 2–4 improvement suggestions
- Keep under 180 words and DO NOT mention being an AI model
`;

  return generate(prompt); 
}

module.exports = { analyzeChartImage };

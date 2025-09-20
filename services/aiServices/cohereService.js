const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

module.exports.generate = async (prompt) => {
  try {
    const response = await cohere.chat({
      model: "command-a-03-2025", 
      message: prompt,
      temperature: 0.7,
      max_tokens: 2000, 
    });

    // The new API returns the text in response.text
    return response.text;
  } catch (err) {
    console.error("[Cohere Error]:", err);
    throw err;
  }
};
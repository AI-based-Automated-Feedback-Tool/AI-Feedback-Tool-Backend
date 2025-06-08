const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

module.exports.generate = async (prompt) => {
  const response = await cohere.generate({
    model: 'command',
    prompt,
    maxTokens: 2000,
    temperature: 0.7,
  });
  return response.generations[0].text;
};
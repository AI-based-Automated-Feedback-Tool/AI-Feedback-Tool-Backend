// routes/cohereRoute.js
const express = require('express');
const router = express.Router();
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await cohere.generate({
      model: 'command',
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
    });

    const output = response.generations[0].text;
    res.json({ result: output });
  } catch (err) {
    console.error('Cohere API error:', err);
    res.status(500).json({ error: 'Cohere API call failed', details: err.message });
  }
});

module.exports = router;

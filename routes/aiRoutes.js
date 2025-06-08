const express = require('express');
const router = express.Router();

const cohereService = require('../services/aiServices/cohereService');
const openrouterService = require('../services/aiServices/openrouterService');

router.post('/generate', async (req, res) => {
  const { prompt, provider = 'cohere' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let result;

    if (provider === 'openrouter') {
      result = await openrouterService.generateWithOpenRouter(prompt);
    } else {
      // default fallback to Cohere
      result = await cohereService.generate(prompt);
    }

    res.json({ result });
  } catch (err) {
    console.error(`[${provider} Error]:`, err);
    res.status(500).json({
      error: `${provider} API failed`,
      details: err.message
    });
  }
});

module.exports = router;

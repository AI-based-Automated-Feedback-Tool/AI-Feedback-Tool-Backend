require('dotenv').config();
const fetch = require('node-fetch');

module.exports.generateWithOpenRouter = async (prompt) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,  // from your .env
      },
      body: JSON.stringify({
        model: 'sarvamai/sarvam-m:free', // You can change this to other models like `openchat/openchat-3.5`
        messages: [
          { role: "system", content: "You are an expert educational AI assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API response:", data);
      throw new Error(data.error?.message || 'OpenRouter API call failed');
    }

    return data.choices[0]?.message?.content || 'No response from model.';
  } catch (err) {
    console.error('[openrouter Error]:', err);
    throw new Error(`OpenRouter API Error: ${err.message}`);
  }
};

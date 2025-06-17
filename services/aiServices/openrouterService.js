//fetched openrouter API key
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

module.exports.generateWithOpenRouter = async (prompt) => {
  //check if api key is available or not
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is missing");
  }

  //make post request to the openrouter api
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'sarvamai/sarvam-m:free',
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
};

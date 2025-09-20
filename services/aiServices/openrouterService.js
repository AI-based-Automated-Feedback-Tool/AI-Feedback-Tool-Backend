// Fetch the OpenRouter API key from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Set a default max_tokens value or fetch it from environment variables
const DEFAULT_MAX_TOKENS = process.env.MAX_TOKENS || 427;

module.exports.generateWithOpenRouter = async (prompt) => {
  // Check if the API key is available
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is missing");
  }

  let maxTokens = DEFAULT_MAX_TOKENS;

  try {
    while (true) {
      // Make a POST request to the OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o', // Specify the model to use
          messages: [
            { role: "system", content: "You are an expert educational AI assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7, // Set the temperature for response randomness
          max_tokens: maxTokens, // Use the configurable max_tokens value
        }),
      });

      // Parse the response JSON
      const data = await response.json();

      // Check if the response is not OK and handle errors
      if (!response.ok) {
        console.error("OpenRouter API response:", data);

        // Handle insufficient credits error
        if (data.error?.code === 402 && data.error?.message.includes('fewer max_tokens')) {
          const match = data.error.message.match(/can only afford (\d+)/);
          if (match) {
            const affordableTokens = parseInt(match[1], 10);
            if (affordableTokens < maxTokens) {
              maxTokens = affordableTokens; // Reduce max_tokens and retry
              console.warn(`Retrying with reduced max_tokens: ${maxTokens}`);
              continue;
            }
          }
        }

        throw new Error(data.error?.message || 'OpenRouter API call failed');
      }

      // Return the content of the first choice or a default message
      return data.choices[0]?.message?.content || 'No response from model.';
    }
  } catch (error) {
    // Log the error for debugging
    console.error("[openrouter Error]:", error.message);
    throw error;
  }
};

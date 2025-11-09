const { jsonrepair } = require('jsonrepair');

function cleanJSON(text) {
  return text
    .replace(/^```(json)?/gi, '')
    .replace(/```$/g, '')
    .replace(/^'+|'+$/g, '')
    .trim();
}

function parseAIResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty or invalid AI response');
  }

  let cleaned = cleanJSON(rawText);

  // Fix common issues
  cleaned = cleaned
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
    .replace(/:\s*([a-zA-Z0-9_]+)\s*([},])/g, ':"$1"$2')
    .replace(/:\s*(\d+)\s*([},])/g, ':$1$2')
    .replace(/:\s*true\s*([},])/g, ':true$2')
    .replace(/:\s*false\s*([},])/g, ':false$2')
    .replace(/:\s*null\s*([},])/g, ':null$2');

  let questions = [];

  try {
    questions = JSON.parse(cleaned);
  } catch (err) {
    console.warn('JSON.parse failed, trying jsonrepair...');
    try {
      const repaired = jsonrepair(cleaned);
      questions = JSON.parse(repaired);
    } catch (repairErr) {
      console.error('Final parse failed. Raw:', rawText);
      throw new Error('AI output could not be parsed, even after repair.');
    }
  }

  if (!Array.isArray(questions)) {
    throw new Error('AI response is not a JSON array');
  }

  return questions;
}

module.exports = { parseAIResponse };
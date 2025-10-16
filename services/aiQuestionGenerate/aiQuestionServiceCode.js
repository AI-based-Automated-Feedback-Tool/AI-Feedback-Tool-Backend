const {CohereClientV2} = require('cohere-ai');

const cohere = new CohereClientV2({
    token: process.env.CO_API_KEY
});

// Normalize test_cases to proper types
function normalizeTestCases(testCases = []) {
  return testCases.map((tc) => {
    let parsedInput, parsedOutput;
    try {
      parsedInput = JSON.parse(tc.input);
    } catch {
      parsedInput = tc.input;
    }
    try {
      parsedOutput = JSON.parse(tc.output);
    } catch {
      parsedOutput = tc.output;
    }
    return { input: parsedInput, output: parsedOutput };
  });
}

async function generateCodeQuestions(
    topicDescription, 
    aiformSelectedLanguageName, 
    aiformSelectedLanguageID,
    subQuestionType, 
    guidance, 
    keyConcepts, 
    doNotInclude, 
    questionNo, 
    expectedFunctionSignature, 
    gradingDescription,
    defaultPoints = 10
) {
    // Build dynamic prompt
    let prompt = `You are an expert coding question designer.

        Generate ${questionNo} ${subQuestionType} coding question${questionNo > 1 ? 's' : ''} in ${aiformSelectedLanguageName}.
        Topic: ${topicDescription}.
        ${guidance ? `Guidance: ${guidance}` : ''}
        ${keyConcepts ? `Include key concepts: ${keyConcepts}` : ''}
        ${doNotInclude ? `Avoid: ${doNotInclude}` : ''}
        ${expectedFunctionSignature ? `Expected function signature: ${expectedFunctionSignature}` : ''}

        Points assignment instructions (user input): "${gradingDescription}".
        If the instructions are unclear or ambiguous, assign ${defaultPoints} points to each question.

        Each question must include:
        - question_description
        - function_signature
        - wrapper_code
        - test_cases (as a JSON array of objects with "input" and "output")
        - language_id (use ${aiformSelectedLanguageID})
        - points

        Return the output as a valid JSON array.
        
        Important: Return the output as **strict JSON only**. Do not include any explanations, greetings, or extra text. Only output a JSON array.`;

    const response = await cohere.chat({
        model: 'command-xlarge-nightly',
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 2000,
        temperature: 0.7,
    })

    let rawText = ''
    if (response.message && Array.isArray(response.message.content)) {
        rawText = response.message.content
          .map(block => block.text || '')
          .join('')
          .trim();
    } else {
        rawText = JSON.stringify(response.message || response);
    }

    // Remove ```json and ``` if present
    rawText = rawText
      .replace(/^```(json)?/gi, '')
      .replace(/```$/g, '')
      .replace(/^'+|'+$/g, '')
      .trim();

    let questions = [];
    try {
      questions = JSON.parse(rawText);
    } catch (err) {
      console.warn('Failed to parse AI response', err);
      return {
        error: true,
        message: 'AI output could not be parsed. Please try again.',
        rawOutput: rawText
      };
    }

    // Normalize test_cases and add language_id
    questions = questions.map(q => ({
        ...q,
        test_cases: normalizeTestCases(q.test_cases),
        language_id: aiformSelectedLanguageID
    }));
    
    return questions;
}
module.exports = {
    generateCodeQuestions
};
const {OpenAI} = require('openai');
const { parseAIResponse } = require('../../utils/parseAIResponse');

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
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

async function generateCodeQuestionsDeepSeek(
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
    try {
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

            Important: Return the output as **strict JSON only**. Do not include markdown (like \`\`\`json), explanations, greetings, code blocks, or extra text. Only output a JSON array.
            Return the output as a **valid JSON array**.
            Do not add any line breaks, markdown, code blocks, or extra text.
            Ensure all strings are properly closed and escaped`;

        const response = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1:free',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 3000,
            temperature: 0.7,
        })

        let rawText = response.choices?.[0]?.message?.content?.trim() || '';

        let questions = [];
        try {
          questions = parseAIResponse(rawText);
        } catch (err) {
            console.error('❌ Failed to parse AI response. Raw output:', rawText);
            throw new Error('AI output could not be parsed. Please try again.');
        }

        // Normalize test_cases and add language_id
        questions = questions.map(q => ({
            ...q,
            test_cases: normalizeTestCases(q.test_cases),
            language_id: aiformSelectedLanguageID
        }));
        
        return questions;
    } catch (error) {
        console.error("Code question generation error-Deepseek:", error);
        return [{ error: true, message: error.message || 'Code question generation failed' }];
    }
}
module.exports = {
    generateCodeQuestionsDeepSeek
};
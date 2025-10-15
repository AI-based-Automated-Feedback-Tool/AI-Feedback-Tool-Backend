const {CohereClientV2} = require('cohere-ai');

const cohere = new CohereClientV2({
    token: process.env.CO_API_KEY
});

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
    gradingDescription
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

        Return the output as a valid JSON array.`;

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

    const rawText = response.message.content[0].text;

    let questions = [];
    try {
      questions = JSON.parse(rawText);
    } catch (err) {
      console.warn('Failed to parse AI response', err);
      return {
        error: true,
        message: 'AI output could not be parsed. Please try again.'
      };
    }
    return questions;
}
module.exports = {
    generateCodeQuestions
};
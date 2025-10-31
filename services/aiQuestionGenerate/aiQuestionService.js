const {CohereClientV2} = require('cohere-ai');

const cohere = new CohereClientV2({
    token: process.env.CO_API_KEY
});

async function generateQuestions(topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType, gradingNotes) {
    try {
        const response = await cohere.chat({
            model: 'command-xlarge-nightly',
            messages: [
                {
                    role: 'user',
                    content: `Generate ${numQuestions} ${difficulty} level${questionType} questions on the topic of ${topic}. Give me questions with 4 answer choices. And also include the correct answer.Focus on these key concepts: ${keyConcepts}. The questions should not include the following: ${doNotInclude}. Follow this guidance: ${guidence}. If the grading notes do not clearly define point values,assign points automatically based on question difficulty:
                    - Easy: 1 points
                    - Medium: 2 points
                    - Hard: 5 points. Format the output strictly as a JSON array like this:[{"question":"Question text here","choices": ["choice1", "choice2", "choice3", "choice4"],"correct_answer": "correct choice"},"points": number]. Generate questions according to ${gradingNotes}. Do NOT include any extra text, markdown, or backticks. Only return valid JSON.`
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        })
        const rawContent = response.message.content[0].text;
        return JSON.parse(rawContent);
    } catch (error) {
        console.error("Cohere error:", error);
        return [{ error: true, message: error.message || 'Cohere failed' }];
    }
}
module.exports = {
    generateQuestions
};
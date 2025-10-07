const {CohereClientV2} = require('cohere-ai');

const cohere = new CohereClientV2({
    token: process.env.CO_API_KEY
});

async function generateQuestions(topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType) {
    const response = await cohere.chat({
        model: 'command-xlarge-nightly',
        messages: [
            {
                role: 'user',
                content: `Generate ${numQuestions} ${difficulty} level${questionType} questions on the topic of ${topic}. Give me questions with 4 answer choices. And also include the correct answer.The questions should focus on the following key concepts: ${keyConcepts}. The questions should not include the following: ${doNotInclude}. Use the following guidance to help you generate the questions: ${guidence}. Format the output strictly as a JSON array like this:[{"question":"Question text here","choices": ["choice1", "choice2", "choice3", "choice4"],"correct_answer": "correct choice"}] Do NOT include any extra text, markdown, or backticks. Only return valid JSON.`
            }
        ],
        max_tokens: 1000,
        temperature: 0.7,
    })
    return response.message.content[0].text
}
module.exports = {
    generateQuestions
};
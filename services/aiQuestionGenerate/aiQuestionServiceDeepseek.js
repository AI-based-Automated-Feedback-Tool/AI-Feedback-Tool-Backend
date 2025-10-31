const { OpenAI } = require('openai');

const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
});

async function generateQuestionsDeepseek(topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType, gradingNotes) {
    try {
        const response = await openai.chat.completions.create({
            messages: [
                { 
                    role: "user", 
                    content: `Generate ${numQuestions} ${difficulty} level${questionType} questions on the topic of ${topic}. Give me questions with 4 answer choices. And also include the correct answer.Focus on these key concepts: ${keyConcepts}. The questions should not include the following: ${doNotInclude}. Follow this guidance: ${guidence}. Follow this guidance: ${guidence}. If the grading notes do not clearly define point values,assign points automatically based on question difficulty:
                    - Easy: 1 points
                    - Medium: 2 points
                    - Hard: 5 points. Format the output strictly as a JSON array like this:[{"question":"Question text here","choices": ["choice1", "choice2", "choice3", "choice4"],"correct_answer": "correct choice"}, "points": number] Do NOT include any extra text, markdown, or backticks. Only return valid JSON.`
                }
            ],
            model: "deepseek/deepseek-r1:free",
        });

        const rawContent = response.choices[0].message.content;
        return JSON.parse(rawContent);
    } catch (error) {
        console.error("DeepSeek error:", error);
        return [{ error: true, message: error.message || 'DeepSeek failed' }];
    }

}

module.exports = {
    generateQuestionsDeepseek
};
const {CohereClientV2} = require('cohere-ai');

const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY
});

async function generateQuestions(topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType, gradingNotes) {
    try {
        const response = await cohere.chat({
            model: 'command-xlarge-nightly',
            messages: [
                {
                    role: 'user',
                    content: `You are a question generator.

                        Generate ${numQuestions} ${difficulty}-level ${questionType} questions on the topic of "${topic}". 
                        Each question should have 4 answer choices and a correct answer.

                        Focus on these key concepts: ${keyConcepts}.
                        Do not include any of the following: ${doNotInclude}.
                        Follow this guidance: ${guidence}.

                        If the grading notes below explicitly define point values for questions, use those values.
                        If they do NOT define point values, assign points automatically based on question difficulty:
                        - Easy: 1 point
                        - Medium: 2 points
                        - Hard: 5 points

                        Grading notes: ${gradingNotes}

                        Format the output **strictly** as a JSON array like this:
                        [
                        {
                            "question": "Question text here",
                            "choices": ["choice1", "choice2", "choice3", "choice4"],
                            "correct_answer": "correct choice",
                            "points": number
                        }
                        ]

                        Do NOT include any explanations, markdown, or extra text. Output only valid JSON.`
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
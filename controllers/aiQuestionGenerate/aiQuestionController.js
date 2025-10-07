const {generateQuestions} = require('../../services/aiQuestionGenerate/aiQuestionService.js');

const generateAIQuestions = async (req, res) => {
    try {
        const {topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType} = req.body;
        const questions = await generateQuestions(topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType);
        res.status(200).json({questions: JSON.parse(questions)});
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({error: 'Failed to generate questions'});
    }
}

module.exports = {
    generateAIQuestions
};
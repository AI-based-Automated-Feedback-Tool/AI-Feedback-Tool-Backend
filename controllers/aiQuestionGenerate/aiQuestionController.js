const {generateQuestions} = require('../../services/aiQuestionGenerate/aiQuestionService.js');
const {generateQuestionsDeepseek} = require('../../services/aiQuestionGenerate/aiQuestionServiceDeepseek.js');

const generateAIQuestions = async (req, res) => {
    try {
        const {topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType, aiModel} = req.body;

        let questions;
        if (aiModel === 'deepseek') {
            questions = await generateQuestionsDeepseek(topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType);
        } else {
            questions = await generateQuestions(topic, numQuestions, difficulty, guidence, keyConcepts, doNotInclude, questionType);
        }

        // Check if service returned an error
        if (!questions || (Array.isArray(questions) && questions[0]?.error)) {
            const message = questions[0]?.message || 'Failed to generate questions';
            return res.status(500).json({ error: message });
        }

        // Return questions normally
        res.status(200).json({ questions });

    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({error: 'Failed to generate questions'});
    }
}

module.exports = {
    generateAIQuestions
};
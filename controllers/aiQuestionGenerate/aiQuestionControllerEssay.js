const {generateEssayQuestions } = require('../../services/aiQuestionGenerate/aiQuestionServiceEssay');

const generateAIQuestionsEssay = async (req, res) => {
    try {
        const {
            topic,
            difficultyLevel,
            guidance,
            keyConcepts,
            doNotInclude,
            wordLimitAI,
            pointsAI,
            noOfQuestion,
            gradingNotesAI
            } = req.body;
        const questions = await generateEssayQuestions(topic, difficultyLevel, guidance, keyConcepts, doNotInclude, wordLimitAI, pointsAI, noOfQuestion, gradingNotesAI);
        res.status(200).json({questions});
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({error: 'Failed to generate questions'});
    }
}

module.exports = {
    generateAIQuestionsEssay
};
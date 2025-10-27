const {generateEssayQuestions } = require('../../services/aiQuestionGenerate/aiQuestionServiceEssay');
const { generateEssayQuestionsDeepseek } = require('../../services/aiQuestionGenerate/aiQuestionServiceEssayDeepSeek');

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
            gradingNotesAI,
            aiModel
        } = req.body;

        let questions;
        if (aiModel === "deepseek") {
            questions = await generateEssayQuestionsDeepseek(topic, difficultyLevel, guidance, keyConcepts, doNotInclude, wordLimitAI, pointsAI, noOfQuestion, gradingNotesAI);
        } else {
            questions = await generateEssayQuestions(topic, difficultyLevel, guidance, keyConcepts, doNotInclude, wordLimitAI, pointsAI, noOfQuestion, gradingNotesAI);
        }
        res.status(200).json({questions});
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({error: 'Failed to generate questions'});
    }
}

module.exports = {
    generateAIQuestionsEssay
};
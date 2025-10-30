const {generateEssayQuestions } = require('../../services/aiQuestionGenerate/aiQuestionServiceEssay');
const { generateEssayQuestionsDeepseek } = require('../../services/aiQuestionGenerate/aiQuestionServiceEssayDeepSeek');
import { checkAndIncrementUsage } from '../../utils/checkAndIncrementUsage.js';

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

        //get user id
        const userId = req.user.id;

        // check and increment usage
        const canProceed = await checkAndIncrementUsage(userId, aiModel);
        if (!canProceed) {
            return res.status(403).json({error: 'Daily usage limit reached for the selected AI model'});
        }

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
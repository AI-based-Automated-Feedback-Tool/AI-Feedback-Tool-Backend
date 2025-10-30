const {generateCodeQuestions } = require('../../services/aiQuestionGenerate/aiQuestionServiceCode');
const {generateCodeQuestionsDeepSeek } = require('../../services/aiQuestionGenerate/aiQuestionServiceCodeDeepSeek');
const {checkAndIncrementUsage} = require('../../utils/checkAndIncrementUsage.js');

const generateAIQuestionsCode = async (req, res) => {
    try {
        const {
            topicDescription, 
            aiformSelectedLanguageName, 
            aiformSelectedLanguageID,
            subQuestionType, 
            guidance, 
            keyConcepts, 
            doNotInclude, 
            questionNo, 
            expectedFunctionSignature, 
            gradingDescription,
            aiModel
        } = req.body;

        //get user id
        const userId = req.user.id;

        // check and increment usage
        const canProceed = await checkAndIncrementUsage(userId, aiModel);
        if (!canProceed) {
            return res.status(403).json({error: 'Daily usage limit reached for the selected AI model'});
        }

        // start generating questions
        let questions;
        if (aiModel === 'deepseek') {
            questions = await generateCodeQuestionsDeepSeek(topicDescription, aiformSelectedLanguageName, aiformSelectedLanguageID, subQuestionType, guidance, keyConcepts, doNotInclude, questionNo, expectedFunctionSignature, gradingDescription);
        } else {
            questions = await generateCodeQuestions(topicDescription, aiformSelectedLanguageName, aiformSelectedLanguageID, subQuestionType, guidance, keyConcepts, doNotInclude, questionNo, expectedFunctionSignature, gradingDescription);
        }
        // Check if service returned an error
        if (!questions || (Array.isArray(questions) && questions[0]?.error)) {
            const message = questions[0]?.message || 'Failed to generate questions';
            return res.status(500).json({ error: message });
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({error: 'Failed to generate questions'});
    }
}

module.exports = {
    generateAIQuestionsCode
};
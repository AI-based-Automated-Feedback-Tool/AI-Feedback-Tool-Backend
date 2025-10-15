const {generateQuestionsCode} = require('../../services/aiQuestionGenerate/aiQuestionServiceCode');

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
            gradingDescription
        } = req.body;
        const questions = await generateQuestionsCode(topicDescription, aiformSelectedLanguageName, aiformSelectedLanguageID, subQuestionType, guidance, keyConcepts, doNotInclude, questionNo, expectedFunctionSignature, gradingDescription);
        res.status(200).json({questions});
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({error: 'Failed to generate questions'});
    }
}

module.exports = {
    generateAIQuestionsCode
};
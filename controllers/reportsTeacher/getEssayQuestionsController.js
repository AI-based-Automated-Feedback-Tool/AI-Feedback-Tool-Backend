const getEssayQuestions = require('../../services/reportsTeacher/getEssayQuestionsService');

const getEssayQuestionDetails = async (req, res) => {
    try {
        const {examId} = req.query;
        if (!examId) {
            const err = new Error("Exam ID is required");
            err.status = 400;
            throw err;
        }
        const essayQuestions = await getEssayQuestions({exam_id: examId});
        res.status(200).json({
            message: "Essay questions details retrieved successfully",
            essayQuestions
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Failed to retrieve essay questions"
        });
    }
}

module.exports = { getEssayQuestionDetails };
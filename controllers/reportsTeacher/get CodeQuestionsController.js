const getCodeQuestions = require('../../services/reportsTeacher/getCodeQuestions');

const getCodeQuestionDetails = async (req, res) => {
    try {
        const examId = req.query;
        if (!examId) {
            const err = new Error("Exam ID is required");
            err.status = 400;
            throw err;
        }
        const codeQuestions = await getCodeQuestions({exam_id: examId});
        res.status(200).json({
            message: "Code questions details retrieved successfully",
            codeQuestions
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Failed to retrieve code questions"
        });
    }
}

module.exports = { getCodeQuestionDetails };
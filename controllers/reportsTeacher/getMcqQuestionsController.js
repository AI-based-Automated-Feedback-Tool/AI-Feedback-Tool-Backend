const  getMcqQuestions = require('../../services/reportsTeacher/getMcqQuestionsService'); 
const getMcqQuestionsController = async (req, res) => {
    try {
        const {examId} = req.query; 
        if (!examId) {
            const err = new Error("Exam ID is required");
            err.status = 400;
            throw err;
        }
        const mcqQuestions = await getMcqQuestions({exam_id: examId});
        
        res.status(200).json({
            message: "Mcq questions details retrieved successfully", 
            mcqQuestions
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = {getMcqQuestionsController};
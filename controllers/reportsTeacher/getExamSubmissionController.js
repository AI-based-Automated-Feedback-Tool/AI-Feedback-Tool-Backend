const  getExamSubmission = require('../../services/reportsTeacher/getExamSubmissionService'); // Importing the getCourseCode function from the service layer
const getExamSubmissionController = async (req, res) => {
    try {
        const {examId} = req.query; 
        if (!examId) {
            const err = new Error("Exam ID is required");
            err.status = 400;
            throw err;
        }
        const examSubmissions = await getExamSubmission({exam_id: examId});
        
        res.status(200).json({
            message: "Exam submission details retrieved successfully", 
            examSubmissions
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = {getExamSubmissionController};
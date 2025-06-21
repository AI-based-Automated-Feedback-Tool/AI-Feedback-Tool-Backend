const  getStudentExamDetails = require('../../services/reportsTeacher/getStdentExamDetailsService'); 
const getStudentExamDetailsController = async (req, res) => {
    try {
        const {examId, studentId} = req.query; 
        if (!examId || !studentId) {
            const err = new Error("Exam ID and Student ID are required");
            err.status = 400;
            throw err;
        }
        const submittedAnswers = await getStudentExamDetails({exam_id: examId, student_id: studentId});

        res.status(200).json({
            message: "Student exam details retrieved successfully", 
            submittedAnswers
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = {getStudentExamDetailsController};
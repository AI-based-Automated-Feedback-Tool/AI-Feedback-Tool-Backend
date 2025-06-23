const  getStudentExamDetails = require('../../services/reportsTeacher/getStdentExamDetailsService'); 
const getStudentExamDetailsController = async (req, res) => {
    try {
        const {examId, studentId, examType} = req.query; 
        if (!examId || !studentId || !examType) {
            const err = new Error("Exam ID, Student ID, and Exam Type are required");
            err.status = 400;
            throw err;
        }
        const submittedAnswers = await getStudentExamDetails({exam_id: examId, student_id: studentId, exam_type: examType});

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
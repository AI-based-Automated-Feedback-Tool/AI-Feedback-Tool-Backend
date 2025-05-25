const getExamTitleFromExam = require('../../services/reportsTeacher/getExamTitleService'); // Importing the getExamTitle function from the service layer

const getExamTitle = async (req, res) => {
    try {
        const { course_id } = req.query; 
        if (!course_id) {
            const err = new Error("Course ID is required");
            err.status = 400; 
            throw err;
        }
        const exams = await getExamTitleFromExam({ course_id }); // Calling the service function to get exam titles
        
        res.status(200).json({
            message: "Exam titles retrieved successfully", 
            exams
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = { getExamTitle }; 
const  getExamDetails = require('../../services/examDetails/fetchExamDetailsService'); 
const getExamController = async (req, res) => {
    try {
        const {examId} = req.query; 
        if (!examId) {
            const err = new Error("Exam ID is required");
            err.status = 400;
            throw err;
        }
        const examDetails = await getExamDetails({exam_id: examId});

        res.status(200).json({
            message: "Exam details retrieved successfully", 
            examDetails
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = {getExamController};
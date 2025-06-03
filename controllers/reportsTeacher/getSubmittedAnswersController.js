const  getSubmittedAnswers = require('../../services/reportsTeacher/getSubmittedAnswers'); 
const getSubmittedAnswersController = async (req, res) => {
    try {
        const {submissionId} = req.query; 
        if (!submissionId) {
            const err = new Error("Submission ID is required");
            err.status = 400;
            throw err;
        }
        const submittedAnswers = await getSubmittedAnswers({submission_id: submissionId});

        res.status(200).json({
            message: "Submitted answers retrieved successfully", 
            submittedAnswers
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = {getSubmittedAnswersController};
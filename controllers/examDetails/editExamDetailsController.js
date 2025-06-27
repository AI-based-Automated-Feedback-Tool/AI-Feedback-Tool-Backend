const {editExamDetails} = require('../../services/examDetails/editExamDetailsService');

const editExamDetailsController = async (req, res) => {
    try {
        const examData = req.body;

        if (!examData || !examData.exam_id) {
            const err = new Error("Exam ID is required");
            err.status = 400;
            throw err;
        }

        const updatedExamDetails = await editExamDetails({ exam_id: examData.exam_id, examData });

        res.status(200).json({
            message: "Exam details updated successfully",
            updatedExamDetails
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}
module.exports = { editExamDetailsController };
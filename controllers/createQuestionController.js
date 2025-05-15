const addQuestionToExam = require('../services/createQuestionService'); // Importing the addQuestionToExam function from the service layer

const createQuestions = async (req, res) => {
    try {
        const question = await addQuestionToExam(req.body)
        res.status(201).json({message: "Question created successfully", question}) // Sending a success response with the created question
    } catch (error) {
        res.status(error.status || 500).json({message:error.message}) // Sending an error response with the error message
    }
}    

module.exports = {createQuestions}; // Exporting the createQuestions function for use in other files
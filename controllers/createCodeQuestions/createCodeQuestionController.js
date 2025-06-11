const addCodeQuestion = require('../../services/createCodeQuestion/createCodeQuestionService')

const createCodeQuestion =  async (req, res) => {
    try {
        const question = await addCodeQuestion(req.body)
        res.status(201).json({message: "Code question created successfully", question}) // Sending a success response with the created question
    } catch (error) {
        res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
    }
}
module.exports = {createCodeQuestion}; 
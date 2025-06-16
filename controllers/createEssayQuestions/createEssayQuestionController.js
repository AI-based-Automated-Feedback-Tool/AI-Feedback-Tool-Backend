const createEssayQuestions = require('../../services/createEssayQuestion/createEssayQuestionsService');

const addEssayQuestion =  async (req, res) => {
    try {
        const question = await createEssayQuestions(req.body)
        res.status(201).json({message: "Essay question created successfully", question}) // Sending a success response with the created question
    } catch (error) {
        res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
    }
}
module.exports = {addEssayQuestion}; 
const express = require('express');
const router = express.Router();
const postExamSubmission = require('../controllers/createCodeQuestions/postCodeQuestion');

router.post('/', async (req, res) => {
    try {
        const { submissionData, answers } = req.body;

        const result = await postExamSubmission(submissionData, answers);

        res.status(201).json({ message: "Submission successful", result });
    } catch (error) {
        console.error("Submission error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});

module.exports = router;

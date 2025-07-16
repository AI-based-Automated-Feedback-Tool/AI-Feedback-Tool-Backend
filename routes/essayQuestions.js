const express = require('express');
const router = express.Router();
const { submitEssayAnswers } = require('../controllers/essayQuestionsController');


router.get('/:examId', getEssayQuestionsByExamId);

// Endpoint to submit essay answers
router.post('/submit', submitEssayAnswers);

module.exports = router;

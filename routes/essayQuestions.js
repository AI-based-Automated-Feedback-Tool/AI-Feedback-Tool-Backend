const express = require('express');
const router = express.Router();
const { 
    getEssayQuestionsByExamId, 
    submitEssayAnswers 
} = require('../controllers/essayQuestionsController');

// GET: Fetch essay questions by exam ID
router.get('/:examId', getEssayQuestionsByExamId);

// POST: Submit essay answers
router.post('/submit', submitEssayAnswers);

module.exports = router;

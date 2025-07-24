const express = require('express');
const router = express.Router();
const { 
    getEssayQuestionsByExamId, 
    submitEssayAnswers, 
    createEssaySubmission
} = require('../controllers/essayQuestionsController');

// GET: Fetch essay questions by exam ID
router.get('/:examId', getEssayQuestionsByExamId);

// POST: Submit essay answers
router.post('/submit', submitEssayAnswers);

// POST: Create a new submission (before submitting answers)
router.post('/create-submission', createEssaySubmission);

module.exports = router;

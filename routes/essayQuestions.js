const express = require('express');
const router = express.Router();
const { submitEssayAnswers } = require('../controllers/essayQuestionsController');

// Endpoint to submit essay answers
router.post('/submit', submitEssayAnswers);

module.exports = router;

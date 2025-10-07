const express = require('express');
const router = express.Router();
const {generateAIQuestions} = require('../../controllers/aiQuestionGenerate/aiQuestionController.js');

router.post('/', generateAIQuestions);

module.exports = router;
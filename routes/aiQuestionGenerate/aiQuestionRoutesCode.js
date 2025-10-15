const express = require('express');
const router = express.Router();
const {generateAIQuestionsCode} = require('../../controllers/aiQuestionGenerate/aiQuestionControllerCode.js');

router.post('/', generateAIQuestionsCode);

module.exports = router;
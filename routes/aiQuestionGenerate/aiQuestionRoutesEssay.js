const express = require('express');
const router = express.Router();
const {generateAIQuestionsEssay} = require('../../controllers/aiQuestionGenerate/aiQuestionControllerEssay.js');
router.post('/', generateAIQuestionsEssay);

module.exports = router;
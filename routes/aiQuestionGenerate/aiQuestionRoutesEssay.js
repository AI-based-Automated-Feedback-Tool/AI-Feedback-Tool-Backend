const express = require('express');
const router = express.Router();
const {generateAIQuestionsEssay} = require('../../controllers/aiQuestionGenerate/aiQuestionControllerEssay.js');
const { supabaseAuth } = require('../../middleware/supabaseAuth.js');

router.post('/', supabaseAuth, generateAIQuestionsEssay);

module.exports = router;
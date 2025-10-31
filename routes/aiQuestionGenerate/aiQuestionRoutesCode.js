const express = require('express');
const router = express.Router();
const {generateAIQuestionsCode} = require('../../controllers/aiQuestionGenerate/aiQuestionControllerCode.js');
const { supabaseAuth } = require('../../middleware/supabaseAuth.js');

router.post('/', supabaseAuth, generateAIQuestionsCode);

module.exports = router;
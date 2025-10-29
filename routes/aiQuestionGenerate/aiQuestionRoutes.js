const express = require('express');
const router = express.Router();
const {generateAIQuestions} = require('../../controllers/aiQuestionGenerate/aiQuestionController.js');
const { supabaseAuth } = require('../../middleware/supabaseAuth.js');

router.post('/', supabaseAuth, generateAIQuestions);

module.exports = router;
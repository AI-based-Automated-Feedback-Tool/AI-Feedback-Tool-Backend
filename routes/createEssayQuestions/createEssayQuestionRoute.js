const express = require('express');
const router = express.Router();
const {addEssayQuestion} = require('../../controllers/createEssayQuestions/createEssayQuestionController');

router.post('/', addEssayQuestion)

module.exports = router;
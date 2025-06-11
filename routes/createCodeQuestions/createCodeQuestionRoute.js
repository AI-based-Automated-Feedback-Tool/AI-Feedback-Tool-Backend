const express = require('express');
const router = express.Router();
const {createCodeQuestion} = require('../../controllers/createCodeQuestions/createCodeQuestionController');

router.post('/', createCodeQuestion)

module.exports = router;
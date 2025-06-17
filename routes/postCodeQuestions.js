const express = require('express');
const router = express.Router();
const {submitCodeAnswers} = require('../controllers/createCodeQuestions/postCodeQuestion');

router.post("/", submitCodeAnswers);


module.exports = router;

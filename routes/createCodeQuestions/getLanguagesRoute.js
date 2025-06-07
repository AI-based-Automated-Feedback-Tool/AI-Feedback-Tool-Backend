const express = require('express');
const router = express.Router();
const {getLanguagesController} = require('../../controllers/createCodeQuestions/getLanguagesController');

router.get ('/', getLanguagesController);
module.exports = router;
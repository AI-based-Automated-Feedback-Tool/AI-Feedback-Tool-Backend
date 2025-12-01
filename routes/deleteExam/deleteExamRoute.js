const express = require('express');
const router = express.Router();
const {removeExam} = require('../../controllers/deleteExam/deleteExamController');

router.delete('/', removeExam);

module.exports = router;
